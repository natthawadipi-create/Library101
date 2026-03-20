const BASE_URL = 'http://localhost:8000';

const validateRegister = (registerData) => {
    let errors = [];

    if (!registerData.username) errors.push('กรุณากรอก Username');
    if (!registerData.password) errors.push('กรุณากรอก Password');
    if (!registerData.email) errors.push('กรุณากรอก Email');
    if (!registerData.role) errors.push('กรุณาเลือก Role');

    return errors;
};

const register = async () => {
    const usernameDOM = document.querySelector('input[name=username]');
    const passwordDOM = document.querySelector('input[name=password]');
    const emailDOM = document.querySelector('input[name=email]');
    const roleDOM = document.querySelector('select[name=role]');
    const messageDOM = document.getElementById('message');

    try {
        const registerData = {
            username: usernameDOM.value,
            password: passwordDOM.value,
            email: emailDOM.value,
            role: roleDOM.value
        };

        const errors = validateRegister(registerData);

        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            };
        }

        const response = await axios.post(`${BASE_URL}/both/register`, registerData);

        messageDOM.innerText = 'Register success';
        messageDOM.className = 'message success';

        setTimeout(() => {
            window.location.href = 'index_login.html';
        }, 1500);

    } catch (error) {
        let msg = error.message || 'เกิดข้อผิดพลาด';

        if (error.errors) {
            msg += '\n' + error.errors.join('\n');
        }

        messageDOM.innerText = msg;
        messageDOM.className = 'message error';
    }
};