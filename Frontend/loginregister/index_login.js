const BASE_URL = 'http://localhost:8000';

const validateLogin = (loginData) => {
    let errors = [];

    if (!loginData.username) {
        errors.push('กรุณากรอก Username');
    }

    if (!loginData.password) {
        errors.push('กรุณากรอก Password');
    }

    return errors;
};

const login = async () => {
    const usernameDOM = document.querySelector('input[name=username]');
    const passwordDOM = document.querySelector('input[name=password]');
    const messageDOM = document.getElementById('message');

    try {
        const loginData = {
            username: usernameDOM.value,
            password: passwordDOM.value
        };

        const errors = validateLogin(loginData);

        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            };
        }

        const response = await axios.post(`${BASE_URL}/both/login`, loginData);

        const user = response.data.user;

        messageDOM.innerText = 'Login success';
        messageDOM.className = 'message success';

        localStorage.setItem('user', JSON.stringify(user));
        
        setTimeout(() => {
        if (user.role === 'admin') {
            window.location.href = 'admin/main_admin/index.html';
        } else if (user.role === 'user') {
            window.location.href = 'user/main_user/index.html';
        }
        }, 1500);

    } catch (error) {
        if (error.response) {
            error.message = error.response.data;
            error.errors = [];
        }

        let htmlData = `<div>${error.message}</div>`;

        if (error.errors) {
            htmlData += '<ul>';
            for (let i = 0; i < error.errors.length; i++) {
                htmlData += `<li>${error.errors[i]}</li>`;
            }
            htmlData += '</ul>';
        }

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};