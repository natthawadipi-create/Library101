/*const express=require('express');
const mysql=require('mysql2/promise');
const cors=require('cors');  

const app=express();
const port=8000;

let conn=null;

app.use(cors()); 
app.use(express.json());

const initMySQL = async () => {
    conn=await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 3307
    });
}

//app.get('/books', async (req, res) => {//เช็ครายการหนังสือในคลัง
  //  const results=await conn.query('SELECT * FROM Books')
    //res.json(results[0]);
//});

app.get('/users', async (req, res) => {//เช็ครายการหนังสือในคลัง
    const results=await conn.query('SELECT * FROM Users')
    res.json(results[0]);
});

app.post('/login', async (req, res) => {
    const {username, password}=req.body;

    try {
        const [rows] = await conn.execute('SELECT user_id, username, role FROM Users WHERE username = ? AND password = ?',
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

app.get('/books_user', async (req, res) => { // เช็ครายการหนังสือในคลัง
    const results = await conn.query(`
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

app.post('/borrow', async (req, res) => { 
    // user ต้องกรอก user_id , book_id และ borrow_date
    const { user_id, book_id, borrow_date } = req.body;

    try {

        // เช็คจำนวนหนังสือในคลัง
        const [books] = await conn.query(
            'SELECT available_quantity FROM Books WHERE book_id = ?',
            [book_id]
        );

        if (books.length === 0) {
            return res.status(404).send('Book not found');
        }

        if (books[0].available_quantity <= 0) {
            return res.send('Cannot borrow: Book not available');
        }

        // กำหนดวันคืน 14 วันหลังจากยืม
        const due_date = new Date(borrow_date);
        due_date.setDate(due_date.getDate() + 14);

        // บันทึกข้อมูลการยืม
        await conn.query(
            `INSERT INTO Borrow (borrow_date, due_date, return_date, user_id, book_id)
             VALUES (?, ?, NULL, ?, ?)`,
            [borrow_date, due_date, user_id, book_id]
        );

        // ลดจำนวนหนังสือ
        await conn.query(
            `UPDATE Books 
             SET available_quantity = available_quantity - 1 
             WHERE book_id = ?`,
            [book_id]
        );

        // อัปเดต status ถ้าหนังสือหมด
        await conn.query(
            `UPDATE Books 
             SET status = 'not available' 
             WHERE book_id = ? AND available_quantity = 0`,
            [book_id]
        );

        res.send('Borrow successful');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error borrowing book');
    }
});

//app.get('/borrow', async (req, res) => {//เอาไว้เช็คประวัติการยืม ต้องสามารถใช้ได้แค่เพียงแอดมินเท่านั้น เดี่ยวมาแก้ (เมื่อ userล้อคอินจะเข้ามาได้แค่หน้านี้เท่านั้น)
  //  const results=await conn.query('SELECT * FROM Borrow')
    //res.json(results[0]);
//});

//admin สามารถเข้าหน้า return เพื่อกรอกอัพเดตข้อมูลและ book เพื่อดูรายการหนังสือที่มี
app.put('/borrow', async (req, res) => {//นี้ admin ต้องกรอก book_id user_id และreturn_date เพื่ออัพเดทวันที่คืนหนังสือ กรอกด้วยมือ
    const {user_id, book_id,borrow_id, return_date}=req.body;

    try{   
        //อัพเดทวันที่คืน
        await conn.query(`UPDATE Borrow SET return_date = ? WHERE user_id = ? AND book_id = ? AND borrow_id = ? AND return_date IS NULL`,
            [return_date, user_id, book_id, borrow_id]
        );

        //เพิ่มจำนวนหนังสือกลับในคลัง
        await conn.query(`UPDATE Books SET available_quantity = available_quantity+1 WHERE book_id = ?`,[book_id]);

        res.send('Return recorded successfully');//ถ้าสำเร็จจะต้องส่งความนี้กลับไป

    }catch(error){
        console.error(error);
        res.status(500).send('Error updating return');
    }
});

app.get('/borrow_history/:user_id', async (req, res) => {

    const user_id = req.params.user_id;

    try {

        const [rows] = await conn.query(
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

app.post('/books', async (req, res) => {

    const { book_id, book_name, available_quantity } = req.body;

    if (!book_id || !book_name || available_quantity == null) {
        return res.status(400).send('Missing required fields');
    }

    try {

        const status = available_quantity > 0 ? 'available' : 'not available';

        await conn.query(
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

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});*/