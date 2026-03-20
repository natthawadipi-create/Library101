const express = require('express');
const router = express.Router();

router.get('/books', async (req, res) => { // เช็ครายการหนังสือในคลัง
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

router.put('/return', async (req, res) => {//นี้ admin ต้องกรอก book_id user_id และreturn_date เพื่ออัพเดทวันที่คืนหนังสือ กรอกด้วยมือ
    const {user_id, book_id,borrow_id, return_date}=req.body;

    try{   
        await req.conn.query(`UPDATE Borrow SET return_date = ? WHERE user_id = ? AND book_id = ? AND borrow_id = ? AND return_date IS NULL`,
            [return_date, user_id, book_id, borrow_id]
        );//อัพเดทวันที่คืน

        await req.conn.query(`UPDATE Books SET available_quantity = available_quantity+1 WHERE book_id = ?`,[book_id]);
        //เพิ่มจำนวนหนังสือกลับในคลัง

        res.send('Return recorded successfully');//ถ้าสำเร็จจะต้องส่งความนี้กลับไป

    }catch(error){
        console.error(error);
        res.status(500).send('Error updating return');
    }

});

router.get('/borrow_history/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const [results] = await req.conn.query(
            `SELECT b.user_id, b.book_id, bk.book_name, 
                    b.borrow_date, b.due_date, b.return_date
             FROM Borrow b
             JOIN Books bk ON b.book_id = bk.book_id
             WHERE b.user_id = ?`,
            [user_id]
        );

        if (results.length === 0) {
            return res.status(404).json({
                message: 'No borrow history found'
            });
        }

        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching borrow history'
        });
    }
});

router.post('/books_admin', async (req, res) => {
    const { book_id, book_name, available_quantity } = req.body;

    if (!book_id || !book_name || available_quantity == null) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const status = available_quantity > 0 ? 'available' : 'not available';

        await req.conn.query(
            `INSERT INTO Books (book_id, book_name, status, available_quantity) 
             VALUES (?, ?, ?, ?)`,
            [book_id, book_name, status, available_quantity]
        );

        res.status(201).send('Book added successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding book');
    }

});

module.exports = router;