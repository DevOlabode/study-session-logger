const fs = require('fs');
const path = require('path');
const notifier = require('node-notifier');

// Data file paths
const sessionsFile = path.join(__dirname, '..', 'data', 'sessions.json');

// Helper functions
function readSessions() {
    try {
        const data = fs.readFileSync(sessionsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading sessions:', error);
        return [];
    }
}

function writeSessions(sessions) {
    try {
        fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing sessions:', error);
        return false;
    }
}

// Session operations
function createSession(sessionData, username) {
    const sessions = readSessions();
    const now = new Date();
    const startDateTime = sessionData.startTime ? new Date(sessionData.startTime) : now;
    const endDateTime = new Date(startDateTime.getTime() + (parseInt(sessionData.duration) * 60 * 1000));
    
    const newSession = {
        id: Date.now().toString(),
        subject: sessionData.subject.trim(),
        duration: parseInt(sessionData.duration),
        notes: sessionData.notes ? sessionData.notes.trim() : '',
        date: sessionData.date || now.toISOString().split('T')[0],
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timestamp: now.toISOString(),
        username: username,
        status: 'active'
    };

    sessions.push(newSession);
    
    if (writeSessions(sessions)) {
        // Schedule notification
        const timeUntilEnd = endDateTime.getTime() - now.getTime();
        if (timeUntilEnd > 0) {
            setTimeout(() => {
                notifier.notify({
                    title: 'Study Session Complete!',
                    message: `Your ${sessionData.duration}-minute session on ${sessionData.subject} has ended.`,
                    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
                    sound: true
                });
            }, timeUntilEnd);
        }
        
        return { success: true, session: newSession };
    } else {
        return { success: false, error: 'Failed to save session' };
    }
}

function completeSession(sessionId) {
    const sessions = readSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
        sessions[sessionIndex].status = 'completed';
        sessions[sessionIndex].actualEndTime = new Date().toISOString();
        
        if (writeSessions(sessions)) {
            return { success: true };
        } else {
            return { success: false, error: 'Failed to update session' };
        }
    } else {
        return { success: false, error: 'Session not found' };
    }
}

function deleteSession(sessionId) {
    const sessions = readSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    
    if (writeSessions(filteredSessions)) {
        return { success: true };
    } else {
        return { success: false, error: 'Failed to delete session' };
    }
}

function getSessionsByUser(username) {
    const sessions = readSessions();
    return sessions.filter(session => session.username === username);
}

function calculateStats(sessions) {
    const stats = {
        totalSessions: sessions.length,
        totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
        subjects: {}
    };

    sessions.forEach(session => {
        if (!stats.subjects[session.subject]) {
            stats.subjects[session.subject] = {
                count: 0,
                totalTime: 0
            };
        }
        stats.subjects[session.subject].count++;
        stats.subjects[session.subject].totalTime += session.duration;
    });

    return stats;
}

module.exports = {
    readSessions,
    writeSessions,
    createSession,
    completeSession,
    deleteSession,
    getSessionsByUser,
    calculateStats
}; 