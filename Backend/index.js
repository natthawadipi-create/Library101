const express=require('express');
const mysql=require('mysql2/promise');

const app=express();
const port=8000;

let conn=null;

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

app.get('/books', async (req, res) => {//เช็ครายการหนังสือในคลัง
    const results=await conn.query('SELECT * FROM Books')
    res.json(results[0]);
});

app.post('/login', async (req, res) => {
    const {user_id, username, password, role}=req.body;

    try {
        const [rows] = await conn.execute('SELECT user_id, username, role FROM Users WHERE user_id = ? AND username = ? AND password = ? AND role = ?',
            [user_id,username, password, role]);

        if (rows.length === 0){
            return res.status(401).send('User_id, username, password or role incorrect');
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

app.get('/borrow', async (req, res) => {//เอาไว้เช็คประวัติการยืม ต้องสามารถใช้ได้แค่เพียงแอดมินเท่านั้น เดี่ยวมาแก้ (เมื่อ userล้อคอินจะเข้ามาได้แค่หน้านี้เท่านั้น)
    const results=await conn.query('SELECT * FROM Borrow')
    res.json(results[0]);
});

app.post('/borrow', async (req, res) => {//user ต้องกรอก book_id และ ี user_id รวมถึงง borrow_date เพให้ระบบบันทึก
    const {user_id, book_id, borrow_date}=req.body;

    try{
        //เช็คจำนวนหนังสือที่สามารถยืมได้
        const [books] = await conn.query('SELECT available_quantity FROM Books WHERE book_id = ?',[book_id]);

        if (books.length === 0){
            return res.status(404).send('Book not found');
        }

        if (books[0].available_quantity<=0){
            return res.send('Cannot borrow: Book not available');
        }

        //คกำหนดวันคืนหนังสือ 2 สัปดาห์หลังจากวันยืม
        const due_date=new Date(borrow_date);
        due_date.setDate(due_date.getDate()+14);

        //เเพื่อข้อมูลการยืมหนังสือ
        await conn.query(`INSERT INTO Borrow (borrow_date, due_date, return_date, user_id, book_id)
            VALUES (?, ?, NULL, ?, ?)`,[borrow_date, due_date, user_id, book_id]);

        //ลดจำนวนหนังสือที่สามารถยืมได้ในคลัง
        await conn.query(`UPDATE Books SET available_quantity=available_quantity-1 WHERE book_id = ?`,[book_id]);

        res.send('Borrow successful');//ถ้าสำเร็จจะต้องส่งความนี้กลับไป

    }catch(error){
        console.error(error);
        res.status(500).send('Error borrowing book');
    }

});
//admin สามารถเข้าหน้า return เพื่อกรอกอัพเดตข้อมูลและ book เพื่อดูรายการหนังสือที่มี
app.put('/admin/return', async (req, res) => {//นี้ admin ต้องกรอก book_id user_id และreturn_date เพื่ออัพเดทวันที่คืนหนังสือ กรอกด้วยมือ
    const {user_id, book_id, return_date}=req.body;

    try{   
        //อัพเดทวันที่คืน
        await conn.query(`UPDATE Borrow SET return_date = ? WHERE user_id = ? AND book_id = ? AND return_date IS NULL`,
            [return_date, user_id, book_id]
        );

        //เพิ่มจำนวนหนังสือกลับในคลัง
        await conn.query(`UPDATE Books SET available_quantity = available_quantity+1 WHERE book_id = ?`,[book_id]);

        res.send('Return recorded successfully');//ถ้าสำเร็จจะต้องส่งความนี้กลับไป

    }catch(error){
        console.error(error);
        res.status(500).send('Error updating return');
    }

});


app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});