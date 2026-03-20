const BASE_URL = "http://localhost:8000";

const checkBooks = async () => {
    const bookListDOM = document.getElementById("book-list");
    try{
        const response = await axios.get(`${BASE_URL}/admins/books_admin`);
        const books = response.data;

        let html = "";
        bookListDOM.innerHTML = "";

        books.forEach(book => {
            const statusText = book.available_quantity > 0 
                ? "พร้อมยืม" 
                : "ไม่พร้อมยืม";

            const row = `
                <tr>
                    <td>${book.book_id}</td>
                    <td>${book.book_name}</td>
                    <td>${book.available_quantity}</td>
                    <td>${statusText}</td>
                </tr>
            `;

            bookListDOM.innerHTML += row;
        });

    } catch (error) {
        bookListDOM.innerHTML = "";
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลหนังสือ");
        console.error(error);
    }
};
