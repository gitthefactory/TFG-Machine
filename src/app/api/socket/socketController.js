const { io } = require("socket.io-client");

const handleSocketEvents = (socket, io) => {
  socket.on('UpdateSala', (data) => {
    try {
      io.emit('SalaUpdated', data);
    } catch (error) {
      console.error('Error en UpdateSala:', error);
    }
  });

  socket.on('updateMachine', (data) => {
    try {
      io.emit('MachineUpdated', data);
    } catch (error) {
      console.error('Error en updateMachine:', error);
    }
  });

  socket.on('UpdateBalance', (data) => {
    try {
      const updatedBalance = updateBalanceInDatabase(data); // Implementa esta función
      io.emit('balanceUpdated', { idMachine: data.idMachine, updatedBalance });
    } catch (error) {
      console.error('Error en UpdateBalance:', error);
    }
  });
  
  socket.on('gameStatusUpdated', (gameStatus) => {
    console.log('Game status updated:', gameStatus);
    socket.broadcast.emit('gameStatusUpdated', gameStatus); // Emitir el evento a otros clientes
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    socket.emit('response', 'Message received');
  });
};

module.exports = { handleSocketEvents };
