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


function renewUsersList() {

    
    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', 'https://studentschat.herokuapp.com/users/');
    
    xhr.send();
    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert((`Ошибка ${xhr.status}: ${xhr.statusText}`));
        } else {
            const listOfUsers = JSON.parse(xhr.responseText);

            const htmlListOfUsers = listOfUsers.reduce((output, element) =>
                output + 
                ((element.status !== 'active') ?
                    `<li class="inactive_user" style="color: #222">${element.username}</li>` :
                    `<li>${element.username}</li>`), '');
            userList.innerHTML = htmlListOfUsers;
            console.log(listOfUsers);

        }
    }
    
    xhr.onerror = function () {
        alert('Запрос не удался');
    }
    

}

renewUsersList();
setInterval(renewUsersList, 10000);

function login(login, password) {

    let usr = {};
    usr.username = login;
    usr.password = password;

    let xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://studentschat.herokuapp.com/users/login');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(JSON.stringify(usr));

        xhr.onload = function () {
            if (xhr.status !== 200) {
                alert((`Ошибка ${xhr.status}: ${xhr.statusText}`));
            } else {
                try {
                    const userObject = JSON.parse(xhr.response);
                    console.log(userObject);
                    if (!!userObject[0].user_id) {
                        loginModal.style.display = 'none';
                    }
                } catch(e) {
                    alert('Not valid input: ' + e.message);
                }
            }
        }
    
        xhr.onerror = function () {
            alert('Запрос не удался');
        }
    
}


function addUser(login, password) {

    let usr = {};
    usr.username = login;
    usr.password = password;

    let xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://studentschat.herokuapp.com/users/register');

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(usr))

    xhr.onload = function () {
        if (!JSON.parse(xhr.response).user_id) {
            alert('Failed to register');
        }else if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        }
    }

    xhr.onerror = function () {
        alert('Запрос не удался');
    }
    
}


