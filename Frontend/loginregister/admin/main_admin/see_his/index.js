const BASE_URL = "http://localhost:8000";

const loadHistory = async () => {
    const userId = document.getElementById("user_id").value;
    const table = document.getElementById("history-list");

    if (!userId) {
        alert("กรุณากรอก User ID");
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/admins/borrow_history/${userId}`);
        const data = response.data;

        table.innerHTML = "";

        data.forEach(item => {

            const bDate = new Date(item.borrow_date).toLocaleDateString('th-TH');
            const dDate = new Date(item.due_date).toLocaleDateString('th-TH');
            const rDate = item.return_date 
                ? new Date(item.return_date).toLocaleDateString('th-TH') 
                : '-';

            const row = `
                <tr>
                    <td>${item.user_id}</td>
                    <td>${item.book_id}</td>
                    <td>${item.book_name}</td>
                    <td>${bDate}</td>
                    <td>${dDate}</td>
                    <td>${rDate}</td>
                </tr>
            `;
            table.innerHTML += row;
        });

    } catch (error) {
        table.innerHTML = "";
        alert(" 404 ไม่พบข้อมูล หรือเกิดข้อผิดพลาด");
        console.error(error);
    }
};