const BASE_URL = "http://localhost:8000";

const validateData = (returnData) => {
    let errors = [];
    if (!returnData.borrow_id) {
        errors.push('กรุณากรอก borrow_id');
    }
    if (!returnData.user_id) {
        errors.push('กรุณากรอก user_id');
    }
    if (!returnData.book_id) {
        errors.push('กรุณากรอก book_id');
    }
    if (!returnData.return_date) {
        errors.push('กรุณากรอก return_date');
    }
    return errors;
};

const returnBook = async () => {
    const borrow_id = document.getElementById("borrow_id");
    const user_id = document.getElementById("user_id");
    const book_id = document.getElementById("book_id");
    const return_date = document.getElementById("return_date");

    const messageDOM = document.getElementById("message");

    const errors = validateData({ borrow_id, user_id, book_id, return_date });
    if (errors.length > 0) {
        messageDOM.innerText = errors.join(", ");
        messageDOM.style.color = "red";
        return;
    }

    try {
        const data = {
            borrow_id: borrow_id.value,
            user_id: user_id.value,
            book_id: book_id.value,
            return_date: return_date.value
        };

        const response = await axios.put(`${BASE_URL}/admins/return`, data);

        messageDOM.innerText = response.data;
        messageDOM.style.color = "green";

    } catch (error) {
        console.error(error);
        messageDOM.innerText = "เกิดข้อผิดพลาดในการคืนหนังสือ";
        messageDOM.style.color = "red";

    }
};