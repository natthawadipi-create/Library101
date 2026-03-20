const BASE_URL = "http://localhost:8000";

const addBook = async () => {
    const bookIdDOM = document.getElementById("book_id");
    const bookNameDOM = document.getElementById("book_name");
    const quantityDOM = document.getElementById("available_quantity");
    const messageDOM = document.getElementById("message");

    const bookData = {
        book_id: bookIdDOM.value,
        book_name: bookNameDOM.value,
        available_quantity: quantityDOM.value
    };

    try {
        await axios.post(`${BASE_URL}/admins/books_admin`, bookData);

        messageDOM.innerText = "เพิ่มหนังสือสำเร็จ";
        messageDOM.style.color = "green";

        bookIdDOM.value = "";
        bookNameDOM.value = "";
        quantityDOM.value = "";

    } catch (error) {
        console.error(error);

        messageDOM.innerText = "เกิดข้อผิดพลาดในการเพิ่มหนังสือ";
        messageDOM.style.color = "red";
    }
};
const goToReturn = () => {
    window.location.href = "update/index.html";
};

const goToHistory = () => {
    window.location.href = "see_his/index.html";
};

const booklist = () => {
    window.location.href = "check_book/index.html";
}
