const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

// Import middlewares and routes
const { initializeDatabase } = require('./middlewares/database');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(flash());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global variables for templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', authRoutes);
app.use('/', sessionRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Study Session Logger running on http://localhost:${PORT}`);
    console.log('Default login: admin / admin123');
}); 