// server.js (o index.js si prefieres)

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
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (data) => {
        console.log('Message received:', data);
    socket.emit('response', 'Message received');

  });
  
  socket.on('UpdateSala', (data) =>{
    console.log('Sala updated:', data);
    io.emit('SalaUpdated', data);
  });
  
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
