"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GameStatusHandler from "@/components/Juegos/gameStatusHandler"; 
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SocketProvider } from "@/app/api/socket/socketContext";


const Juegos: React.FC = () => {

  return (
    <>
    <SocketProvider>
      <DefaultLayout>
        <Breadcrumb pageName="Control de Juegos" />
        <GameStatusHandler />
      </DefaultLayout>
      </SocketProvider>
    </>
  );
};

export default Juegos;
