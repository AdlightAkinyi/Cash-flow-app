const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from a .env file
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log('MySQL connected...');
});

// Routes

// Serve index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other static files
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/app.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.js'));
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.json({ success: false, message: 'User already exists or database error' });
        }
        res.json({ success: true });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error logging in:', err);
            return res.json({ success: false });
        }
        res.json({ success: true, userId: results[0].id });
    });
});

// Add expense endpoint
app.post('/add-expense', (req, res) => {
    const { userId, description, amount } = req.body;
    const query = 'INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)';
    db.query(query, [userId, description, amount], (err, result) => {
        if (err) {
            console.error('Error adding expense:', err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

// Get expenses endpoint
app.get('/expenses', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            return res.json({ success: false });
        }
        res.json({ success: true, expenses: results });
    });
});

// Delete expense endpoint
app.delete('/delete-expense', (req, res) => {
    const { id } = req.body;
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting expense:', err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});