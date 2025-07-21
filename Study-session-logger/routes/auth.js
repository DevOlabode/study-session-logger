const express = require('express');
const router = express.Router();
const { authenticateUser, createUser } = require('../middlewares/auth');

// Login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { 
        error: req.flash('error'), 
        success: req.flash('success') 
    });
});

// Login process
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticateUser(username, password);
    
    if (user) {
        req.session.user = user;
        req.flash('success', `Welcome back, ${user.username}!`);
        res.redirect('/');
    } else {
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    req.flash('success', 'You have been logged out successfully');
    res.redirect('/login');
});

// Register page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', { 
        error: req.flash('error'),
        success: req.flash('success')
    });
});

// Register process
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/register');
    }
    
    const result = createUser(username, password);
    if (result.success) {
        req.flash('success', 'Account created successfully! Please log in.');
        res.redirect('/login');
    } else {
        req.flash('error', result.error);
        res.redirect('/register');
    }
});

module.exports = router; 