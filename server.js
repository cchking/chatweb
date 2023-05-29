const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connectedServers = new Set();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });

  socket.on('message', (message) => {
    console.log(`Mensaje recibido de ${socket.id}: ${message}`);

    // Enviar el mensaje a todos los usuarios conectados
    io.emit('message', { sender: socket.id, content: message });
  });
});

server.listen(8000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
