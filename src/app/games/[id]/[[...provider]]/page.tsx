"use client";

import React from "react";
import { SocketProvider } from '@/app/api/socket/socketContext'
import GameLayout from "@/components/game/GameLayout";
import Belatra from "@/components/game/bgaming";
import Bgaming from "@/components/game/bgaming";
import Aspect from "@/components/game/aspect"
import Booming from "@/components/game/Booming";
import Popok from "@/components/game/PopOk"


const GamePage: React.FC = () => {
  return (
    <SocketProvider>
      <GameLayout>
      <div className="section-content">
          <Belatra />
          <Bgaming />
        <Aspect />         
        <Booming />
          <Popok/>
        </div>
      </GameLayout>
    </SocketProvider>
  );
};