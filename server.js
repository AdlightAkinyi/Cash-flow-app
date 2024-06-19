const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass1234',
    database: 'cash_flow_app'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'User already exists' });
        }
        res.json({ success: true });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err || results.length === 0) {
            return res.json({ success: false });
        }
        res.json({ success: true, userId: results[0].id });
    });
});

app.post('/add-expense', (req, res) => {
    const { userId, description, amount } = req.body;
    const query = 'INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)';
    db.query(query, [userId, description, amount], (err, result) => {
        if (err) {
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

app.get('/expenses', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.json({ success: false });
        }
        res.json({ success: true, expenses: results });
    });
});

app.delete('/delete-expense', (req, res) => {
    const { id } = req.body;
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
