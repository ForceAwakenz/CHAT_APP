'use strict'

const userList = document.getElementById('userlist');
const registerLink = document.getElementById('register_link');
const loginLink = document.getElementById('login_link');
const loginModal = document.getElementById('login_box');
const registerModal = document.getElementById('register_box');
const submitBtn = document.getElementById('submit_btn');
const submitBtnReg = document.getElementById('submit_btn_reg');
const usernameTxt = document.getElementById('username');
const passwordTxt = document.getElementById('password');
const usernameRegTxt = document.getElementById('username_reg');
const passwordRegTxt = document.getElementById('password_reg');
const loggedInSpan = document.getElementById('loggedin');
const textInput = document.getElementById('inputtxt');
const sendBtn = document.getElementById('send_btn');
const logoutBtn = document.getElementById('logout_btn');
const chatWindow = document.getElementById('chat');

sendBtn.addEventListener('click', () => {
    if (!textInput.value) return;
    new Message(currentUser.username, textInput.value).send(MESSAGEURL);
});

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!textInput.value) return;
        new Message(currentUser.username, textInput.value).send(MESSAGEURL);
    }
});


submitBtn.addEventListener('click', () => {

    currentUser.username = usernameTxt.value;
    currentUser.password = passwordTxt.value;

    currentUser.send(LOGINURL);

});

submitBtnReg.addEventListener('click', () =>{
    
    currentUser.username = usernameRegTxt.value;
    currentUser.password = passwordRegTxt.value;
    
    currentUser.send(REGISTERURL);
});

logoutBtn.addEventListener('click', () => {
    currentUser.send(LOGOUTURL)
});

if (!!registerLink) {
    registerLink.addEventListener('click', (e) => {
        switchModals(e)
    });
}

if (!!loginLink) {
    loginLink.addEventListener('click', (e) => {
        switchModals(e)
    });
}

// countriesContainer.insertAdjacentText('beforeend', msg);