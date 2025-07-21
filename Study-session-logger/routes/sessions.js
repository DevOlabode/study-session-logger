const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { 
    createSession, 
    completeSession, 
    deleteSession, 
    getSessionsByUser, 
    calculateStats 
} = require('../middlewares/sessions');

// Home page - requires authentication
router.get('/', requireAuth, (req, res) => {
    const sessions = getSessionsByUser(req.session.user.username);
    res.render('index', { 
        sessions, 
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error')
    });
});

// Create new session
router.post('/session', requireAuth, (req, res) => {
    const { subject, duration, notes, date, startTime } = req.body;
    
    if (!subject || !duration) {
        req.flash('error', 'Subject and duration are required');
        return res.redirect('/');
    }

    const result = createSession({ subject, duration, notes, date, startTime }, req.session.user.username);
    
    if (result.success) {
        req.flash('success', 'Study session created successfully!');
        res.redirect('/');
    } else {
        req.flash('error', result.error);
        res.redirect('/');
    }
});

// Complete session
router.post('/session/:id/complete', requireAuth, (req, res) => {
    const { id } = req.params;
    const result = completeSession(id);
    
    if (result.success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: result.error });
    }
});

// Delete session
router.delete('/session/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const result = deleteSession(id);
    
    if (result.success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: result.error });
    }
});

// Statistics page
router.get('/stats', requireAuth, (req, res) => {
    const sessions = getSessionsByUser(req.session.user.username);
    const stats = calculateStats(sessions);
    
    res.render('stats', { 
        stats, 
        sessions, 
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error')
    });
});

module.exports = router; 