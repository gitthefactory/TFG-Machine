const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');
const { handleSocketEvents } = require('./socketController');

// Configuración de Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Inicializar Next.js
app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);

  // Inicializar Socket.IO
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Manejo de eventos de socket
  io.on('connection', (socket) => {
    console.log('A user connected');
    handleSocketEvents(socket, io);
  });

  // Middleware para que Next.js maneje todas las rutas no específicas de API
  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  // Iniciar el servidor
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
