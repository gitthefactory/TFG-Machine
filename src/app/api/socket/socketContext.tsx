// socketContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvent, SOCKET_EVENTS } from '@/app/api/socket/event'; // Ajusta la ruta según tu estructura

interface SocketContextProps {
    socket: Socket | null;
    emit: (event: SocketEvent, ...args: any[]) => void;
}

const SocketContext = createContext<SocketContextProps>({ socket: null, emit: () => {} });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketConnection = io('http://localhost:3001');

        socketConnection.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('Socket.IO client connected');
        });

        socketConnection.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log('Socket.IO client disconnected');
        });

        setSocket(socketConnection);

        return () => {
            socketConnection.disconnect();
            console.log('Socket.IO client disconnected from provider');
        };

    }, []);

    const emit = (event: SocketEvent, ...args: any[]) => {
        socket?.emit(event, ...args);
    };

    return (
        <SocketContext.Provider value={{ socket, emit }}>
            {children}
        </SocketContext.Provider>
    );
};
