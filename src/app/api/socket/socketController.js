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
