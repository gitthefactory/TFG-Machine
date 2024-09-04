const { io } = require("socket.io-client");

const handleSocketEvents = (socket, io) => {
  socket.on('UpdateSala', (data) => {
    try {
      // Lógica de actualización de sala
      io.emit('SalaUpdated', data);
    } catch (error) {
      console.error('Error en UpdateSala:', error);
    }
  }); 

  socket.on('updateMachine', (data) => {
    try {
      // Lógica de actualización de máquina
      io.emit('MachineUpdated', data);
    } catch (error) {
      console.error('Error en updateMachine:', error);
    }
  });

  // Evento para actualizar el balance
  socket.on('UpdateBalance', (data) => {
    try {
      const updatedBalance = updateBalanceInDatabase(data); // Implementa esta función
      io.emit('balanceUpdated', { idMachine: data.idMachine, updatedBalance });
    } catch (error) {
      console.error('Error en UpdateBalance:', error);
    }
  });

  // Otros eventos pueden ser manejados aquí de manera similar...

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    socket.emit('response', 'Message received');
  });

};
socket.on('gameStatusChange', (data) => {
  try {
    // Retransmite el evento a todos los clientes conectados
    io.emit('gameStatusUpdated', data);
  } catch (error) {
    console.error('Error en gameStatusChange:', error);
  }
});

module.exports = { handleSocketEvents };
