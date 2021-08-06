'use strict'

let currentUser = {};
let allMessages = [];
let currentMessageHtml = '';
const SERVER = 'https://studentschat.herokuapp.com';
const LOGINURL = `${SERVER}/users/login`;
const LOGOUTURL = `${SERVER}/users/logout`;
const USERLISTURL = `${SERVER}/users`;
const REGISTERURL = `${SERVER}/users/register`;
const MESSAGEURL = `${SERVER}/messages`;

class Message {

    constructor(username, message, chatroomId = 'MAIN') {
        this.username = username;
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
            audioClick.play();
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

function printMessages(data) {

    if (allMessages.length == data.length) {
        return;
    } else if (allMessages.length === 0) {

        const htmlMessages = data.reduce(function (output, element) {
            const htmlMessage = (String(element.username) == String(currentUser.username))
                ? `<div class="message"><span class="name-span currentUser">${element.username}: </span>${element.message}</div>`
                : `<div class="message"><span class="name-span" title="respond">${element.username}: </span>${element.message}</div>`;
            
            return output + htmlMessage;

        }, '');

        
        chat.innerHTML = htmlMessages;
        allMessages = data;

    } else {

        // Checking by last message instead of just comparing lengths
        // Is more secure way though little more complicated
        const lastMessageUser = allMessages[allMessages.length - 1].username;
        const lastMessageTime = allMessages[allMessages.length - 1].datetime;
    
        const lastMessageIndex = data.findIndex(function (elem) {
            return (elem.username === lastMessageUser
                && elem.datetime === lastMessageTime);
        });
    
        const newMessages = data.slice(lastMessageIndex+1);
        
        const htmlMessages = newMessages.reduce(function (output, element) {
            const htmlMessage = (String(element.username) == String(currentUser.username))
                ? `<div class="message new-message"><span class="name-span currentUser">${element.username}: </span>${element.message}</div>`
                : `<div class="message new-message"><span class="name-span" title="respond">${element.username}: </span>${element.message}</div>`;
            
            return output + htmlMessage;

        }, '');
        
        chat.innerHTML += htmlMessages;
        allMessages = data;

        audioClick.play();

        const freshMessages = document.querySelectorAll('.new-message');
        freshMessages.forEach(message => {
            message.addEventListener('transitionend', () =>
            {
                // транзишин энд не происходит
                console.log('this');
                message.classList.remove('new-message')
                
                }
            );
        });

    }

    chat.scrollTo({
        top: chat.scrollHeight,
        left: 0,
        behaviour: 'smooth'
    });

}

function refreshUserList(data) {
    const htmlListOfUsers = data
        .filter(element => currentUser.username != element.username)
        .reduce((output, element) =>
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

            beautifulTransition(0);
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

