"use client";

import React from 'react';
import GameComponent from '@/components/game/GameComponent';
import { SocketProvider } from '@/app/api/socket/socketContext';

const GamePage: React.FC = () => {
  return (
    <SocketProvider>
      <GameComponent />
    </SocketProvider>
  );
};

export default GamePage;
