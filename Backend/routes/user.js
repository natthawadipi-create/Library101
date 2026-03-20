const express = require('express');
const router = express.Router();

//router.get('/', async (req, res) => {//เช็ครายการหนังสือในคลัง
  //  const results=await req.conn.query('SELECT * FROM Users')//หา conn ใน server.js(rep.conn)มาใช้
    //res.json(results[0]);
//});

router.get('/books_user', async (req, res) => { // เช็ครายการหนังสือในคลัง
    const results = await req.conn.query(`
        SELECT 
            book_id,
            book_name,
            available_quantity,
            CASE
                WHEN available_quantity > 0 THEN 'พร้อมยืม'
                ELSE 'ไม่พร้อมยืม'
            END AS borrow_status
        FROM Books
    `);

    res.json(results[0]);
});

router.post('/borrow', async (req, res) => {
    const { user_id, book_id, borrow_date } = req.body;

    try {
        const [books] = await req.conn.query(
            'SELECT available_quantity FROM Books WHERE book_id = ?',
            [book_id]
        );

        if (books.length === 0) {
            return res.status(404).send('Book not found');
        }

        if (books[0].available_quantity <= 0) {
            return res.send('Cannot borrow: Book not available');
        }

        const due_date = new Date(borrow_date);
        due_date.setDate(due_date.getDate() + 14);

        await req.conn.query(`INSERT INTO Borrow (borrow_date, due_date, return_date, user_id, book_id)
             VALUES (?, ?, NULL, ?, ?)`,
             [borrow_date, due_date, user_id, book_id]);

        await req.conn.query(`UPDATE Books SET available_quantity = available_quantity - 1 WHERE book_id = ?`,
            [book_id]);

        await req.conn.query(`UPDATE Books SET status = 'not available' 
            WHERE book_id = ? AND available_quantity = 0`,
            [book_id]);

        res.send('Borrow successful');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error borrowing book');
    }
});

router.get('/borrow_history/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const [rows] = await req.conn.query(
            `SELECT 
                b.borrow_id,
                bk.book_name,
                b.borrow_date,
                b.due_date,
                b.return_date,
                CASE
                    WHEN b.return_date IS NOT NULL THEN 'Returned'
                    WHEN b.due_date < CURDATE() THEN 'Overdue'
                    WHEN b.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) THEN 'Due Soon'
                    ELSE 'Borrowing'
                END AS status
            FROM Borrow b
            JOIN Books bk ON b.book_id = bk.book_id
            WHERE b.user_id = ?`,
            [user_id]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching borrow history');
    }
});

module.exports = router;