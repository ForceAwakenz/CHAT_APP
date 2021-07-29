'use strict'

var currentUser;
const LOGINURL = 'https://studentschat.herokuapp.com/users/login';
const USERLISTURL = 'https://studentschat.herokuapp.com/users/';
const REGISTERURL = 'https://studentschat.herokuapp.com/users/register';
const SENDMESSAGEURL = 'https://studentschat.herokuapp.com/messages';

class Message {

    constructor(currentUserName, message, chatroomId = 'MAIN') {
        this.username = currentUserName;
        this.datetime = new Date().toISOString();
        this.message = message;
    }

    send() { // может вынести сэнд из класса?
        if (!this.message) return;
    }

    parseFromInput() {

    }

}

console.log(new Message('Test User', 'Hi there'));

class User {
    constructor(username, password) {

    }
}




function renewUsersList() {

    
    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', USERLISTURL );
    
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
setInterval(renewUsersList, 15000);

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
                        currentUser = userObject[0].username;
                        // loggedInSpan.innerText = userObject[0].username;
                        loggedInSpan.innerText = currentUser;
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


function sendMessage(message, username) {

    const datetime = new Date().toISOString();

    if (message == '') return;

    const messageObject = {
        datetime: datetime,
        message: message,
        username: username
    };

    console.log(messageObject);


    let xhr = new XMLHttpRequest();

    xhr.open('POST', SENDMESSAGEURL);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(messageObject));

    xhr.onload = function () {
        console.log(JSON.parse(xhr.response));
        if (!JSON.parse(xhr.response).status) {
            alert('Failed to send message');
        }else if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            textInput.value = '';
        }
    }

    xhr.onerror = function () {
        alert('Запрос не удался');
    }


}

function getMessages() {
    
}