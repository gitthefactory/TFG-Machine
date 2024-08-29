"use client";  // Asegúrate de que esta línea esté al principio del archivo

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define la interfaz para el contexto
interface SocketContextInterface {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3001");
     console.log('Cliente conectado')// Conectar al servidor de Socket.IO
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect(); // Desconectar al desmontar
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket debe usarse dentro de un SocketProvider");
  }
  return context;
};
