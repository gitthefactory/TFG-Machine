"use client";
import SessionMaquinas from "@/components/Loading/SessionMaquinas"
import { SessionProvider } from "next-auth/react"
import { SocketProvider } from '@/app/api/socket/socketContext';
const Maquinas: React.FC = () => {
  return (
    <SessionProvider>
    <SocketProvider>
     <SessionMaquinas/>
    </SocketProvider>
    </SessionProvider>
  );
};

export default Maquinas;
