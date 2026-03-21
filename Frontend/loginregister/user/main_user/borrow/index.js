const BASE_URL = 'http://localhost:8000';

let bookId = '';
let userId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    bookId = urlParams.get('book_id');

    console.log('bookId', bookId);

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('กรุณา login ก่อน');
        window.location.href = '../../loginregister/index_login.html';
        return;
    }

    userId = user.id; 
};

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

const submitData = async () => {
    let messageDOM = document.getElementById('message');

    try {
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;

        const currentUserId = user?.id || user?.user_id || user?.userId;

        const borrowData = {
            user_id: currentUserId,
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
        console.error('Submit Error:', error);
    }
};