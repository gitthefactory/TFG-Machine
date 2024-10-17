"use client";

import React, { Suspense } from 'react';
import GameLayout from '@/components/game/GameLayout';
import Providers from '@/components/game/providers';
import { SocketProvider } from '@/app/api/socket/socketContext';
import { SessionProvider } from 'next-auth/react';
import ProviderLayout from '@/components/game/ProviderLayout'

const GamePage: React.FC = () => {
  return (
    <SessionProvider>
      <SocketProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <ProviderLayout>
            <Providers />
          </ProviderLayout>
        </Suspense>
      </SocketProvider>
    </SessionProvider>
  );
};

export default GamePage;
