

import MaquinasForm from "@/components/Maquinas/MaquinasForm";
import getSingleMachine from "@/controllers/getSingleMachine";
import React from "react";
import { SocketProvider } from "@/app/api/socket/socketContext";

export default async function EditMachines({params: {id}}: {params: {id: string}}) {
  const maquina = await getSingleMachine(id);
  return (
    <>
    <SocketProvider>
      <MaquinasForm maquina={maquina} />
      </SocketProvider>
    </>
  );
}