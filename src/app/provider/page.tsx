"use client";

import React from 'react';
import GameLayout from '@/components/game/GameLayout';
import Providers from '@/components/game/providers';
import { SocketProvider } from '@/app/api/socket/socketContext';
import { SessionProvider } from 'next-auth/react';

const GamePage: React.FC = () => {
  return (
    <SessionProvider>
    <SocketProvider>
      <GameLayout>
        <Providers/>
      </GameLayout>
    </SocketProvider>
    </SessionProvider>
  );
};

export default GamePage;
