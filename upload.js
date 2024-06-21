const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 4000;

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Godwin1721957',
    database: 'student', // Corrected database name
});

app.use(express.static('publics'));

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

app.post('/upload', upload.single('image'), (req, res) => {
    const {buffer } = req.file;
    const selectedTable = req.body.table;
    const candidateName = req.body.name;
    const sql = `INSERT INTO ${selectedTable} (candidateName,candidatePhoto) VALUES (?, ?)`;

    db.query(sql, [candidateName, buffer], (err, result) => {
        if (err) {
            console.error('Error saving image to database:', err);
            res.status(500).send('Error saving image to database');
        } else {
            console.log('Image saved successfully!');
            res.status(200).send('Image saved successfully');
        }
    });
});

// Serve the upload.html file
app.get('', (req, res) => {
    res.sendFile(__dirname + '/publics/upload.html'); // Corrected path to upload.html
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});