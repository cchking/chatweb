const socket = io();

// Registro de usuario
const username = prompt('Ingrese su nombre de usuario:');
socket.emit('register', username);

// Envío de mensajes
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();

  if (content !== '') {
    const message = {
      sender: username,
      content: content
    };

    socket.emit('send', message);
    messageInput.value = '';
  }
});

// Recepción de mensajes
const messagesDiv = document.getElementById('messages');

socket.on('message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `[${message.sender}]: ${message.content}`;
  messagesDiv.appendChild(messageElement);
});
