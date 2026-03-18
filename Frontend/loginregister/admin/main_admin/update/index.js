const BASE_URL = "http://localhost:8000";

const returnBook = async () => {

    const borrow_id = document.getElementById("borrow_id").value;
    const user_id = document.getElementById("user_id").value;
    const book_id = document.getElementById("book_id").value;
    const return_date = document.getElementById("return_date").value;

    const messageDOM = document.getElementById("message");

    try {

        const data = {
            borrow_id: borrow_id,
            user_id: user_id,
            book_id: book_id,
            return_date: return_date
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