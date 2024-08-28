import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO server');
});

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('SE CONECTO UN USER');

  socket.on('updateSala', (data) => {
    console.log('Actualización de sala recibida:', data);
    // Emitir el evento a todos los clientes conectados
    io.emit('salaActualizada', data);
  });

  socket.on('disconnect', () => {
    console.log('SE DESCONECTO UN USER');
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server listening on port 3001');
});
