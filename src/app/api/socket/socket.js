const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { handleSocketEvents } = require('./socketController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Delegar el manejo de eventos al controlador centralizado
  handleSocketEvents(socket, io);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  getIO() {
    return io;
  },
};
