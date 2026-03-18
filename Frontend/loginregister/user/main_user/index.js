const BASE_URL = "http://localhost:8000";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert('กรุณา login ก่อน');
    window.location.href = '../loginregister/index_login.html';
}

const loadBooks = async () => {

    const bookListDOM = document.getElementById("book-list");

    try {

        const response = await axios.get(`${BASE_URL}/users/books_user`);
        const books = response.data;

        let html = "";

        for (let i = 0; i < books.length; i++) {

            const book = books[i];

            const status = book.available_quantity > 0 
                ? "พร้อมยืม"
                : "ไม่พร้อมยืม";

            html += `
            <tr>
                <td>${book.book_id}</td>
                <td>${book.book_name}</td>
                <td>${book.available_quantity}</td>
                <td>${status}</td>
                <td>
                    <button onclick="borrowBook(${book.book_id})">
                        ยืม
                    </button>
                </td>
            </tr>
            `;
        }

        bookListDOM.innerHTML = html;

    } catch (error) {
        console.error(error);
    }
};

const borrowBook = (book_id) => {

    window.location.href = `borrow/index.html?book_id=${book_id}`;

};

loadBooks();

const loadHistory = async () => {

    const historyDOM = document.getElementById("history-list");
    const messageDOM = document.getElementById("message");
    const user = JSON.parse(localStorage.getItem("user"));

    try {

        const response = await axios.get(
            `${BASE_URL}/users/borrow_history/${user.user_id}`
        );

        const history = response.data;

        let html = "";
        let alerts = [];

        for (let i = 0; i < history.length; i++) {

            const record = history[i];

            // --- เช็ก Status ที่มาจาก Backend เพื่อสร้าง Alert ---
            if (record.status === 'Overdue') {
                alerts.push(`❌ หนังสือ "${record.book_name}" **เกินกำหนดคืนแล้ว!**`);
            } else if (record.status === 'Due Soon') {
                alerts.push(`⚠️ หนังสือ "${record.book_name}" **ใกล้ครบกำหนดคืน (ภายใน 3 วัน)**`);
            }

            // จัดฟอร์แมตวันที่ให้สวยงาม
            const bDate = new Date(record.borrow_date).toLocaleDateString('th-TH');
            const dDate = new Date(record.due_date).toLocaleDateString('th-TH');
            const rDate = record.return_date ? new Date(record.return_date).toLocaleDateString('th-TH') : "-";

            // กำหนดสี Class ตามสถานะ
            let statusClass = "";
            if (record.status === 'Overdue') statusClass = 'text-danger fw-bold';
            if (record.status === 'Due Soon') statusClass = 'text-warning fw-bold';
            if (record.status === 'Returned') statusClass = 'text-success';

            const status = record.return_date
                ? "คืนแล้ว"
                : "กำลังยืม";

            html += `
            <tr class="${record.status === 'Overdue' || record.status === 'Due Soon' ? 'table-warning' : ''}">
                <td>${record.borrow_id}</td>
                <td>${record.book_name}</td>
                <td>${bDate}</td>
                <td>${dDate}</td>
                <td>${rDate}</td>
                <td class="${statusClass}">${record.status}</td>
            </tr>
            `;
        }

        if (alerts.length > 0) {
            messageDOM.innerHTML = alerts.map(msg => `<div class="alert-item">${msg}</div>`).join('');
            messageDOM.className = "message danger"; // ใช้ Class สีแดง/เหลืองที่เราแต่งไว้
            messageDOM.style.display = "block";
        } else {
            messageDOM.style.display = "none";
        }

        historyDOM.innerHTML = html;

    } catch (error) {
        console.error(error);
    }
};

loadHistory();