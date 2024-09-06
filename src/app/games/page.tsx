"use client";

import React from 'react';
import GameComponent from '@/components/game/GameComponent';
import { SocketProvider } from '@/app/api/socket/socketContext';
import Belatra from '@/components/game/bgaming';

const GamePage: React.FC = () => {
  return (
    <SocketProvider>
      <GameComponent />
    </SocketProvider>
  );
};

export default GamePage;
