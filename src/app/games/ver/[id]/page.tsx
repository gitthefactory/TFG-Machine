"use client";

import React from "react";
import GamesData from "@/components/game/GamesData";
import { SocketProvider } from "@/app/api/socket/socketContext";


const GamesPage: React.FC = () => {
  return (
    <SocketProvider>
      <GamesData />
    </SocketProvider>
  );
}
export default GamesPage;