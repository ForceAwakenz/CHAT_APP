'use strict'

const userList = document.getElementById('userlist');
const registerLink = document.getElementById('register_link');
const loginLink = document.getElementById('login_link');
const loginModal = document.getElementById('login_box');
const registerModal = document.getElementById('register_box');
const submitBtn = document.getElementById('submit_btn');
const submitBtnReg = document.getElementById('submit_btn_reg');
const nicknameTxt = document.getElementById('nickname');
const passwordTxt = document.getElementById('password');
const nicknameRegTxt = document.getElementById('nickname_reg');
const passwordRegTxt = document.getElementById('password_reg');
const loggedInSpan = document.getElementById('loggedin');
const textInput = document.getElementById('inputtxt');
const sendBtn = document.getElementById('send_btn');

sendBtn.addEventListener('click', () => sendMessage(textInput.value, loggedInSpan.textContent));

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage(textInput.value, currentUser);
    }
});

if (!!registerLink) {
    registerLink.addEventListener('click', () => {
        // registerModal.classList.add('modal_visible');
        // loginModal.classList.add('modal_hidden');
        registerModal.style.display = 'flex';
        loginModal.style.display = 'none';

    });
}

if (!!loginLink) {
    loginLink.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        registerModal.style.display = 'none';

    });
}

submitBtn.addEventListener('click', () =>
    login(nicknameTxt.value, passwordTxt.value)
);

submitBtnReg.addEventListener('click', () =>
    addUser(nicknameRegTxt.value, passwordRegTxt.value)
);


// countriesContainer.insertAdjacentText('beforeend', msg);