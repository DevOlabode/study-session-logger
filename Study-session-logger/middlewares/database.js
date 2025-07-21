const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Data directory and file paths
const dataDir = path.join(__dirname, '..', 'data');
const sessionsFile = path.join(dataDir, 'sessions.json');
const usersFile = path.join(dataDir, 'users.json');

// Initialize database files
function initializeDatabase() {
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    // Initialize sessions file if it doesn't exist
    if (!fs.existsSync(sessionsFile)) {
        fs.writeFileSync(sessionsFile, JSON.stringify([], null, 2));
    }

    // Initialize users file if it doesn't exist
    if (!fs.existsSync(usersFile)) {
        const defaultPassword = bcrypt.hashSync('admin123', 10);
        const defaultUsers = [{
            username: 'admin',
            password: defaultPassword,
            createdAt: new Date().toISOString()
        }];
        fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2));
    }
}

module.exports = {
    initializeDatabase
}; 