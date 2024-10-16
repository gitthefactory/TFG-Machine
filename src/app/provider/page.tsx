"use client";

import React, { Suspense } from 'react';
import GameLayout from '@/components/game/GameLayout';
import Providers from '@/components/game/providers';
import { SocketProvider } from '@/app/api/socket/socketContext';
import { SessionProvider } from 'next-auth/react';

const GamePage: React.FC = () => {
  return (
    <SessionProvider>
      <SocketProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <GameLayout>
            <Providers />
          </GameLayout>
        </Suspense>
      </SocketProvider>
    </SessionProvider>
  );
};

export default GamePage;
