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
const logoutBtn = document.getElementById('logout_btn')
const chatWindow = document.getElementById('chat');

sendBtn.addEventListener('click', () => {
    new Message(currentUser.username, textInput.value).send(MESSAGEURL);
});

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        new Message(currentUser.username, textInput.value).send(MESSAGEURL);
    }
});


submitBtn.addEventListener('click', () => {
    login(nicknameTxt.value, passwordTxt.value);

    currentUser.nickname = nicknameTxt.value;
    currentUser.password = passwordTxt.value;
    

});

submitBtnReg.addEventListener('click', () =>
    addUser(nicknameRegTxt.value, passwordRegTxt.value)
);

logoutBtn.addEventListener('click', () => {
    currentUser.send(LOGOUTURL);
    loggedInSpan.textContent = '';
    loginModal.style.display = 'flex';
}
);

if (!!registerLink) {
    registerLink.addEventListener('click', () => {
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

// countriesContainer.insertAdjacentText('beforeend', msg);