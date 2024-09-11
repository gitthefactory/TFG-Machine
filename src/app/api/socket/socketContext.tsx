"use client";  // Asegúrate de que esta línea esté al principio del archivo

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define la interfaz para el contexto
interface SocketContextInterface {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const SocketContext = createContext<SocketContextInterface | null>(null);

const getSocketUrl = () => {
  // Verifica el entorno y retorna la URL adecuada
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'; // URL del servidor en desarrollo
  } else {
    return ['https://panel.casinoenruta.com/','https://casinoenruta.com/']; // URL del servidor en producción
  }
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(getSocketUrl(), {
      reconnectionAttempts: 5, // Número de intentos de reconexión
      timeout: 10000, // Tiempo máximo para establecer la conexión
    });
    
    console.log('Cliente conectado');
    setSocket(socketInstance);
  
    // Manejo de eventos de conexión y desconexión
    socketInstance.on('connect', () => {
      console.log('Conectado al servidor');
    });
  
    socketInstance.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });
  
    return () => {
      socketInstance.disconnect();
      console.log('Cliente desconectado');
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
