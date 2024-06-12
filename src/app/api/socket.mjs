import { createServer } from 'http';
import { Server } from 'socket.io';

let count = 0;
let gameStates = {}; // Objeto para almacenar el estado de cada juego

let httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    count++;
    console.log("connected: ", count);
    socket.on('disconnect', () => {
        count--;
        console.log("disconnected: ", count);
        socket.emit("count", count);
        socket.broadcast.emit("count", count);
    });
    socket.emit("count", count);
    socket.broadcast.emit("count", count);

    socket.on("checkboxChange", ({ id, isChecked }) => {
        console.log(`Received checkboxChange event for game ${id} with isChecked: ${isChecked}`);
        // Actualizar el estado del juego con el nuevo valor del checkbox
        gameStates[id] = isChecked;
        console.log("isChecked: ", gameStates);
        socket.broadcast.emit("checkboxChange", { id, isChecked });
    });

    // Manejar el evento de cambio de checkbox específicamente para el proveedor 68
    socket.on("checkboxChange68", ({ id, isChecked }) => {
        console.log(`Received checkboxChange event for game ${id} with isChecked: ${isChecked}`);
        if (id === 68) {
          // Actualizar el estado del juego 68 con el nuevo valor del checkbox
          gameStates[id] = isChecked;
          console.log("isChecked:", gameStates);
          socket.broadcast.emit("checkboxChange", { id, isChecked });
        }
    });

    // Enviar el estado actual de todos los juegos cuando un nuevo cliente se conecta
    socket.emit("initialGameStates", gameStates);
});

httpServer.listen(3001);
console.log("listening port 3001");
