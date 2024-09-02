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
      // Actualiza el balance en la base de datos o en la lógica del servidor
      // Por ejemplo, podrías tener una función que actualice el balance en la base de datos
      const updatedBalance = updateBalanceInDatabase(data);

      // Emite el evento de balance actualizado a todos los clientes
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

module.exports = { handleSocketEvents };
