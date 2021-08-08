'use strict'

let currentUser = {};
let allMessages = [];

const SERVER = 'https://studentschat.herokuapp.com';
const LOGINURL = `${SERVER}/users/login`;
const LOGOUTURL = `${SERVER}/users/logout`;
const USERLISTURL = `${SERVER}/users`;
const REGISTERURL = `${SERVER}/users/register`;
const MESSAGEURL = `${SERVER}/messages`;

let renewList;
let renewMessages;

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
                    formReplyMessage();
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

function prepareAndSendMessage() {
    if (!textInput.value.trim()) return;
    const styledText = produceStyledText();
    new Message(currentUser.username, styledText).send(MESSAGEURL);
    replyToDiv.style.visibility = 'hidden';
}

function formReplyMessage() {

    let messagesToReply = document.querySelectorAll('.name-span:not(.currentUser)');

    messagesToReply.forEach(msg => {
        msg.addEventListener('click', () => {

            replyToDiv.style.visibility = 'visible';
            replyToUser.innerHTML = msg.textContent;

            replyToMessage.innerHTML =
                msg
                    .closest('div')
                    .textContent
                    .replace(msg.textContent, '')
                    .slice(0, 10)
                    .trim();

            replyToMessage.innerHTML +=
                (replyToMessage.innerHTML.length < 10)
                    ? ''
                    : '...';
            
        })
    });

    // console.log(`<span style="color:gray; font-style:italic;"> ${replyToUser.innerHTML} ${replyToMessage.innerHTML} </span>  ↩️ `);

    if (replyToMessage.innerHTML) {
        return `<span style="color:gray; font-style:italic;"> ${replyToUser.textContent}  ${replyToMessage.textContent} </span>  ↩️ `;
    }

        return '';

}

function produceStyledText() {

    let styledText = '';
    var replyMessage = '';

    if (replyToUser) {
        replyMessage = formReplyMessage();
    }

    styledText += (colorPicker.value != '#000000')
        ? `<span style="color:${colorPicker.value}";>`
        : '';
    
    styledText += textInput.value;

    styledText += (colorPicker.value !== '#000000')
    ? `</span>`
        : '';
    
    console.log(replyMessage);
    console.log(styledText);

    return replyMessage + styledText;
    
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
    } else if (allMessages.length === 0 || allMessages.length > data.length) {
        // I check for (allMessages.length > data.length) just to fix server reloads

        chat.innerHTML = constructHtmlMessages(data, false);
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
        
        chat.innerHTML += constructHtmlMessages(newMessages,true);
        allMessages = data;

        audioClick.play();

        const freshMessages = document.querySelectorAll('.new-message');
        freshMessages.forEach(message => {
            setTimeout(() => {
                message.classList.remove('new-message');
            }, 3000)
        });

    }

    chat.scrollTo({
        top: chat.scrollHeight,
        left: 0,
        behaviour: 'smooth'
    });

}

function constructHtmlMessages(inputData, ifNew) {

    let classNewMessage = '';
    if (ifNew) {
        classNewMessage = 'new-message';
    }
    
    const htmlMessages = inputData.reduce(function (output, element) {
        const htmlMessage = (String(element.username) == String(currentUser.username))
            ? `<div class="message ${classNewMessage}"><span class="name-span currentUser">${element.username}: </span>${element.message}</div>`
            : `<div class="message ${classNewMessage}"><span class="name-span" title="respond">${element.username}: </span>${element.message}</div>`;
        
        return output + htmlMessage;

    }, '');

    return htmlMessages;
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
            renewList = setInterval(() => get(USERLISTURL), 15000);
            renewMessages = setInterval(() => get(MESSAGEURL), 5000);

            chat.scrollTo({
                top: chat.scrollHeight,
                left: 0,
                behaviour: 'smooth'
            });

        }
    } catch(e) {
        alert('Not valid input: ' + e.message);
    }

}

