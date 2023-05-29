const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Array para almacenar la información de los usuarios
const users = [];

// Configuración del directorio público
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Evento de conexión de un nuevo cliente
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Evento de registro de usuario
  socket.on('register', (username) => {
    console.log(`Usuario registrado: ${username}`);

    // Guardar información de usuario en el array
    users.push({
      id: socket.id,
      username: username,
    });

    // Emitir evento de usuarios actualizados
    io.emit('usersUpdated', users);
  });

  // Evento de envío de mensaje
  socket.on('send', (message) => {
    console.log(`Mensaje recibido: [${message.sender}]: ${message.content}`);

    // Emitir evento de nuevo mensaje a todos los clientes
    io.emit('message', message);
  });

  // Evento de desconexión de un cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');

    // Eliminar usuario del array al desconectarse
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      // Emitir evento de usuarios actualizados
      io.emit('usersUpdated', users);
    }
  });
});

// Iniciar el servidor
const server = http.listen(8000, () => {
  console.log('Servidor escuchando en el puerto 8000');
});
