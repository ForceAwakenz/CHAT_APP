'use strict'

var currentUser = {};
var allMessages;
const SERVER = 'https://studentschat.herokuapp.com';
const LOGINURL = `${SERVER}/users/login`;
const LOGOUTURL = `${SERVER}/users/logout`;
const USERLISTURL = `${SERVER}/users`;
const REGISTERURL = `${SERVER}/users/register`;
const MESSAGEURL = `${SERVER}/messages`;

class Message {

    constructor(currentUserName, message, chatroomId = 'MAIN') {
        this.username = currentUserName;
        this.datetime = new Date().toISOString();
        this.message = message;
        this.chatroomId = chatroomId;
    }

}

Message.prototype.send = send;
currentUser.send = send;

function send(url) {

    if (url === MESSAGEURL) {
        if (!this.message) return;
    }

    let xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(this));

    xhr.onload = function () {
        console.log(JSON.parse(xhr.response));
        if (!JSON.parse(xhr.response).status) {
            alert('Failed to send request');
        }else if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {

            switch (url) {
                case MESSAGEURL:
                    textInput.value = '';
                    get(MESSAGEURL);
                    break;
                case LOGOUTURL:
                    clearInterval(renewList);
                    clearInterval(renewMessages);
                    break;
                default:
                    break;
            }
        }
    }

    xhr.onerror = function () {
        alert('Запрос не удался');
    }

}

function get(url) {

    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', url);
    
    xhr.send();
    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert((`Ошибка ${xhr.status}: ${xhr.statusText}`));
        } else {
            const data = JSON.parse(xhr.responseText);

            switch (url) {
                case MESSAGEURL:
                    printMessages(data);
                    break;
                case USERLISTURL:
                    refreshUserList(data);
                    break;
                default:
                    break;
            };


        }
    }
    
    xhr.onerror = function () {
        alert('Запрос не удался');
    }
}

function printMessages(data) {
    allMessages = data;
    const htmlMessages = data.reduce((output, element) =>
    output + 
    `<div class="message"><span class="name-span">${element.username}: </span>${element.message}</div>`, '');
    chat.innerHTML = htmlMessages;
}

function refreshUserList(data) {
    const htmlListOfUsers = data.reduce((output, element) =>
    output + 
    ((element.status !== 'active') ?
        `<li class="inactive_user" style="color: #222">${element.username}</li>` :
            `<li>${element.username}</li>`), '');
    
    userList.innerHTML = htmlListOfUsers;
    console.log(data);

}

get(USERLISTURL);
let renewList = setInterval(() => get(USERLISTURL), 15000);

get(MESSAGEURL);
let renewMessages = setInterval(() => get(MESSAGEURL), 5000);

function login(login, password) {

    let user = {};
    user.username = login;
    user.password = password;

    let xhr = new XMLHttpRequest();

        xhr.open('POST', LOGINURL);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(JSON.stringify(user));

        xhr.onload = function () {
            if (xhr.status !== 200) {
                alert((`Ошибка ${xhr.status}: ${xhr.statusText}`));
            } else {
                try {
                    const userObject = JSON.parse(xhr.response);
                    console.log(userObject);
                    if (!!userObject[0].user_id) {
                        loginModal.style.display = 'none';
                        currentUser.username = userObject[0].username;
                        // loggedInSpan.innerText = userObject[0].username;
                        loggedInSpan.innerText = currentUser.username;
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

    let user = {};
    user.username = login;
    user.password = password;

    let xhr = new XMLHttpRequest();

    xhr.open('POST', REGISTERURL);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(user));

    xhr.onload = function () {
        console.log(JSON.parse(xhr.response));
        if (!JSON.parse(xhr.response).id) {
            alert('Failed to register');
        }else if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else if (xhr.status == 200) {
            login(JSON.parse(xhr.response).username, JSON.parse(xhr.response).password);
        }

    }

    xhr.onerror = function () {
        alert('Запрос не удался');
    }
    
}


// function sendMessage(message, username) {

//     const datetime = new Date().toISOString();

//     if (message == '') return;

//     const messageObject = {
//         datetime: datetime,
//         message: message,
//         username: username
//     };

//     console.log(messageObject);


//     let xhr = new XMLHttpRequest();

//     xhr.open('POST', MESSAGEURL);

//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.send(JSON.stringify(messageObject));

//     xhr.onload = function () {
//         console.log(JSON.parse(xhr.response));
//         if (!JSON.parse(xhr.response).status) {
//             alert('Failed to send message');
//         }else if (xhr.status !== 200) {
//             alert(xhr.status + ': ' + xhr.statusText);
//         } else {
//             textInput.value = '';
//         }
//     }

//     xhr.onerror = function () {
//         alert('Запрос не удался');
//     }


// }



// class User {
//     constructor(username, password) {

//     }
// }
