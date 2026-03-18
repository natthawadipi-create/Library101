const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    const {username, password}=req.body;

    try {
        const [rows] = await req.conn.query('SELECT user_id, username, role FROM Users WHERE username = ? AND password = ?',
            [username, password]);

        if (rows.length === 0){
            return res.status(401).send('Username or password incorrect');
        }

        res.json({
            message: 'Login success',
            user: rows[0]
        });

    } catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }

});

router.post('/register', async (req, res) => {
    const {username, password, role, email} = req.body;

    try {
        const [result] = await req.conn.query('INSERT INTO Users (username, password, role, email) VALUES (?, ?, ?, ?)',
            [username, password, role, email]);
        res.json({ message: 'User registered successfully' });
    } catch(error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;