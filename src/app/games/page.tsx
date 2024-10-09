"use client";

import React from 'react';
import GameComponent from '@/components/game/GameComponent';
import GameLayout from '@/components/game/GameLayout';
import Providers from '@/components/game/providers'
import { SocketProvider } from '@/app/api/socket/socketContext';

const GamePage: React.FC = () => {
  return (
    <SocketProvider>
      <GameLayout>
        <Providers/>
      </GameLayout>
    </SocketProvider>
  );
};

export default GamePage;
