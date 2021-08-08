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
const audioClick = document.getElementById('audio_click');

const boldStyler = document.getElementById('bold');
const underlineStyler = document.getElementById('underline');
const italicStyler = document.getElementById('italic');
const paintBrush = document.getElementById('paintbrush');
const colorPicker = document.getElementById('color-picker');
const replyToDiv = document.getElementById('reply-to');
const replyToUser = document.getElementById('reply-to-user');
const replyToMessage = document.getElementById('reply-to-message');
const removeReply = document.getElementById('remove-reply');

const keyElements = document.querySelectorAll('div.key-element, nav.key-element');
const smiles = document.querySelectorAll('.smile');


audioClick.volume = 0.4;

sendBtn.addEventListener('click', () =>
    prepareAndSendMessage()
);

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        prepareAndSendMessage();
    }
});

chatWindow.addEventListener('dblclick', () => {
    chat.scrollTo({
        top: chat.scrollHeight,
        left: 0,
        behaviour: 'smooth'
    });
})

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
    currentUser.send(LOGOUTURL);
    keyElements.forEach(element => {
        element.style.opacity = 0.1;
    });
});

if (!!registerLink) {
    registerLink.addEventListener('click', (e) => {
        switchModals(e);
    });
}

if (!!loginLink) {
    loginLink.addEventListener('click', (e) => {
        switchModals(e);
    });
}

paintBrush.addEventListener('click', () => colorPicker.click());

colorPicker.addEventListener('change', () => {
    textInput.style.color = colorPicker.value;
    textInput.focus();
});

smiles.forEach(smile => smile.addEventListener('click', (e) => {
    textInput.value += e.path[0].innerText;
    textInput.focus();
}));

removeReply.addEventListener('click', () => {
    replyToUser.textContent = '';
    replyToMessage.textContent = '';
    replyToDiv.style.visibility = 'hidden';
})


boldStyler.addEventListener('click', () =>
    styleButtonToCheckbox(boldStyler));
underlineStyler.addEventListener('click', () =>
    styleButtonToCheckbox(underlineStyler));
italicStyler.addEventListener('click', () =>
    styleButtonToCheckbox(italicStyler));



function styleButtonToCheckbox(button) {
    if (button.classList.contains('checked')) {
        button.classList.remove('checked');
    } else {
        button.classList.add('checked');
    }
}

function switchModals(e) {
    if (e.target.id == 'register_link') {
        registerModal.style.display = 'flex';
        loginModal.style.display = 'none';
    } else if (e.target.id == 'login_link') {
        loginModal.style.display = 'flex';
        registerModal.style.display = 'none';
    }
}

function beautifulTransition (i) {

    return new Promise((resolve) => {
        setTimeout(() => {
            if (i >= keyElements.length - 1) {
                return resolve();
            } else {
                resolve(beautifulTransition(i + 1));
            }
        }, 400);
        keyElements[i].style.opacity = 1;
    });

}
