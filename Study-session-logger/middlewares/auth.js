const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Data file paths
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

// Helper functions
function readUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users:', error);
        return false;
    }
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'Please log in to access this page');
        res.redirect('/login');
    }
}

// Authentication functions
function authenticateUser(username, password) {
    const users = readUsers();
    const user = users.find(u => u.username === username);
    
    if (user && bcrypt.compareSync(password, user.password)) {
        return { username: user.username };
    }
    return null;
}

function createUser(username, password) {
    const users = readUsers();
    
    if (users.find(u => u.username === username)) {
        return { success: false, error: 'Username already exists' };
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    if (writeUsers(users)) {
        return { success: true };
    } else {
        return { success: false, error: 'Failed to create account' };
    }
}

module.exports = {
    requireAuth,
    authenticateUser,
    createUser
}; 