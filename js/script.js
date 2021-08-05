'use strict'

var currentUser = {};
var allMessages = [];
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

    let xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(this));

    xhr.onload = function () {

        const response = JSON.parse(xhr.response);
            
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            checkAndDo(url, response);
        }

    }

    xhr.onerror = function () {
        alert('Failed to send request');
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
                    console.log('Error with input url into get function occured');
                    break;
            };

        }

    }
    
    xhr.onerror = function () {
        alert('Failed to send request');
    }

}


function checkAndDo(url, response) {

    switch (url) {
        case MESSAGEURL:
            if (response.status !== 'ok') {
                alert('Failed to send a message');
                break;
            }
            textInput.value = '';
            get(MESSAGEURL);
        break;
        case LOGINURL:
            if (!response[0]['user_id']) {
                alert('Failed to login');
                break;
            }
            login(response);
            break;
        case LOGOUTURL:
            clearInterval(renewList);
            clearInterval(renewMessages);
            loggedInSpan.textContent = '';
            loginModal.style.display = 'flex';
            break;
        case REGISTERURL:
            if (!response.id) {
                alert('Failed to register');
                break;
            }
            login(response);
            break;
        default:
            console.log('Error with input url into send function occured');
            break;
    }

}
// need to deal with it:
function printMessages(data) {

    const lastMessageUser = data[data.length - 1].username;
    const lastMessageTime = data[data.length - 1].datetime;

    console.log(lastMessageTime, lastMessageUser);

    const lastMessageIndex = data.findIndex(function (elem) {
        console.log(elem);
        return (elem.username === lastMessageUser
            && elem.datetime === lastMessageTime);
    });

    const newMessages = data.slice(lastMessageIndex);

    allMessages.concat()

    console.log(lastMessageIndex);


    allMessages = data;

// ==================================================

    // const lastMessageUser = allMessages[allMessages.length - 1].username;
    // const lastMessageTime = allMessages[allMessages.length - 1].datetime;
    
    if (allMessages.length < data.length) {
        
    }






// ==================================================

    const htmlMessages = allMessages.reduce((output, element) =>
    output + 
    `<div class="message"><span class="name-span">${element.username}: </span>${element.message}</div>`, '');
    chat.innerHTML = htmlMessages;
    // chat.insertAdjacentText('beforeend', htmlMessages);

    chat.scrollTo({
        top: chat.scrollHeight,
        left: 0,
        behaviour: 'smooth'
    });

}

function refreshUserList(data) {
    const htmlListOfUsers = data.reduce((output, element) =>
    output + 
        ((element.status !== 'active')
            ? `<li class="inactive_user">${element.username}</li>`
            : `<li>${element.username}</li>`), '');
    
    userList.innerHTML = htmlListOfUsers;

}

function login(data) {
    try {
        if (!!data[0]?.user_id || !!data.username) {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';

            loggedInSpan.innerText = currentUser.username;

            get(USERLISTURL);
            get(MESSAGEURL);

        }
    } catch(e) {
        alert('Not valid input: ' + e.message);
    }

}

let renewList = setInterval(() => get(USERLISTURL), 15000);
let renewMessages = setInterval(() => get(MESSAGEURL), 5000);


// countriesContainer.insertAdjacentText('beforeend', msg);
