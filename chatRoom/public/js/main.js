// Using DOM select elements
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get userName and Room from URL
const { userName, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatRoom -> send to server
socket.emit('joinRoom', { userName, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// receive message sent from server
socket.on('message', (message) => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// Message submit
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get message text
    const msg = event.target.elements.msg;

    // Emit message to server
    socket.emit('chatMessage', msg.value);

    // Clear message
    msg.value = '';
    msg.focus();
})

// output Message to DOM
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =
        `<p class="meta">${message.userName}  <span>${message.time}</span></p>
            <p class="text">${message.text}</p>`;

    chatMessages.appendChild(div);
}

// output room to DOM
const outputRoomName = (room) => {
    roomName.innerText = room;
}

// output USERS to DOM
const outputUsers = (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.userName;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    }
});