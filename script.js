'use strict'

// const sendBtn = document.getElementById('send_btn');

// sendBtn.addEventListener('click', () => alert('Success!!'))

// const submitBtn = document.getElementById('submitBtn');

// submitBtn.addEventListener('click', () => alert('more success!!!!'));


const userList = document.getElementById('userlist');

const registerBtn = document.getElementById('register_btn');

if (!!registerBtn) {
    registerBtn.addEventListener('click', hidenshow);
}


const loginModal = document.getElementById('login_box');
const registerModal = document.getElementById('register_box');


// function hideAndShowElement(elementToHide, elementToShow) {
//     elementToShow.classlist.add('modal_visible');
//     elementToHide.classlist.add('modal_hidden');
// }

function hidenshow() {
    registerModal.classList.add('modal_visible');
    loginModal.classList.add('modal_hidden');
}








function renewUsersList() {

    
    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', 'https://studentschat.herokuapp.com/users/');
    
    xhr.send();
    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            console.log((`Ошибка ${xhr.status}: ${xhr.statusText}`));
        } else {
            // console.log((`Готово, получили ${xhr.response.length} байт`));
            console.log(JSON.parse(xhr.responseText));

            const listOfUsers = JSON.parse(xhr.responseText);

            const htmlListOfUsers = listOfUsers.reduce((output, element) =>
                output + `<li>${element.username}</li>`, '');
               
            userList.innerHTML = htmlListOfUsers;

        }
    }
    
    xhr.onerror = function () {
        alert('Запрос не удался');
    }
    

}

renewUsersList();
setInterval(renewUsersList, 10000);






// var serverResponse;

// function addUser() {

//     let xhr = new XMLHttpRequest();

//     xhr.open('POST', 'https://studentschat.herokuapp.com/users/register');

//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.send(JSON.stringify(
//         {
//             username: 'NewDogInTown3',
//             password: 'dogslife'
//         }
//     ))

//     xhr.onreadystatechange = function () {
//         // if (xhr.readyState !== 4) return;
//         // if (xhr.status !== 200) {
//         //     alert(xhr.status + ': ' + xhr.statusText);
//         // } else {
//             try {
//                 serverResponse = JSON.parse(xhr.responseText);
//             } catch(e) {
//                 alert('Not valid input: ' + e.message);
//             }
//         // }
//     }

//     // return serverResponse;
    
// }

// addUser();

// console.log(serverResponse);


// function login() {

//     let xhr = new XMLHttpRequest();

//     xhr.open('POST', 'https://studentschat.herokuapp.com/users/login');

//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.send(JSON.stringify(
//         {
//             username: 'NewDogInTown3',
//             password: 'dogslife'
//         }
//     ))

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState !== 4) return;
//         if (xhr.status !== 200) {
//             alert(xhr.status + ': ' + xhr.statusText);
//         } else {
//             try {
//                 serverResponse = JSON.parse(xhr.responseText);
//             } catch(e) {
//                 alert('Not valid input: ' + e.message);
//             }
//         }
//     }

//     return serverResponse;
    
// }

// login();

// console.log(serverResponse);


