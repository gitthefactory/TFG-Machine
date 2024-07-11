"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GameStatusHandler from "@/components/Juegos/gameStatusHandler"; 
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const Juegos: React.FC = () => {

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Control de Juegos" />
        <GameStatusHandler />
      </DefaultLayout>
    </>
  );
};

export default Juegos;
