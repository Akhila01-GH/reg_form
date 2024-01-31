const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'register_info',
    insecureAuth: true
});


// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL');
    }
});

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'template', 'index.html')));

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, email, phone, password, gender } = req.body;

    // Insert user data into the database
    const insertQuery = 'INSERT INTO credentials (username, email, phone, password, gender) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [username, email, phone, password, gender], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).send('User registered successfully');
        }
    });
});

// Route to handle the default (index) page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
