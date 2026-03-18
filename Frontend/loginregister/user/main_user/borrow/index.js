const BASE_URL = 'http://localhost:8000';

let bookId = '';
let userId = '';

window.onload = async () => {

    // ดึง book_id จาก URL
    const urlParams = new URLSearchParams(window.location.search);
    bookId = urlParams.get('book_id');

    console.log('bookId', bookId);

    // ดึง user จาก localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('กรุณา login ก่อน');
        window.location.href = '../../loginregister/index_login.html';
        return;
    }

    userId = user.id; // 🔥 สำคัญ
};

// validate
const validateData = (borrowData) => {
    let errors = [];

    if (!borrowData.user_id) {
        errors.push('ไม่พบ user');
    }

    if (!borrowData.book_id) {
        errors.push('ไม่พบหนังสือ');
    }

    if (!borrowData.borrow_date) {
        errors.push('ไม่พบวันที่ยืม');
    }

    return errors;
};

// submit
const submitData = async () => {
    let messageDOM = document.getElementById('message');

    try {
        // ดึง user ใหม่ทุกครั้งที่กด เพื่อป้องกันค่าหาย
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;

        // ดึง ID โดยเช็กหลายชื่อ เผื่อ Backend ส่งมาไม่เหมือนกัน
        // ลองเปลี่ยนเป็น user.user_id หรือ user.id ตามที่ปรากฎใน Database
        const currentUserId = user?.id || user?.user_id || user?.userId;

        const borrowData = {
            user_id: currentUserId, // ใช้ค่าที่ดึงมาใหม่ตรงนี้
            book_id: Number(bookId),
            borrow_date: new Date().toISOString().split('T')[0]
        };

        console.log('ข้อมูลที่กำลังจะส่งไป Backend:', borrowData);

        const errors = validateData(borrowData);

        if (errors.length > 0) {
            throw {
                message: 'ข้อมูลไม่ครบ',
                errors: errors
            };
        }

        const response = await axios.post(`${BASE_URL}/users/borrow`, borrowData);

        messageDOM.innerText = "ยืมหนังสือสำเร็จ!";
        messageDOM.className = 'message success';

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);

    } catch (error) {
        // ส่วนจัดการ Error เหมือนเดิม...
        console.error('Submit Error:', error);
        // ... โค้ดแสดง error message ของคุณ ...
    }
};