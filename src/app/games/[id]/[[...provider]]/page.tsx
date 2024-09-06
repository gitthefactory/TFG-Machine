"use client";

import React from "react";
import GameProvider from '@/components/game/GameProvider'
import { SocketProvider } from '@/app/api/socket/socketContext'


const GamePage: React.FC = () => {
  return (
    <SocketProvider>
      <GameProvider />
    </SocketProvider>
  );
};