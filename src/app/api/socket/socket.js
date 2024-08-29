const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('UpdateSala', (data) => {
    // Aquí deberías actualizar el usuario en la base de datos
    // Por simplicidad, simplemente emitiremos el evento de actualización

    // Luego emite el evento para todos los clientes
    io.emit('SalaUpdated', data); // Asegúrate de que 'data' contenga el usuario actualizado
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    socket.emit('response', 'Message received');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  getIO() {
    return io;
  }
};
