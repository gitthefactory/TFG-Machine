

import { SocketProvider } from "@/app/api/socket/socketContext";
import ConfirmarJuegos from "@/components/GamesClients/GamesClient";
import getSingleMachine from "@/controllers/getSingleMachine";
import React from "react";

export default async function EditMachines({params: {id}}: {params: {id: string}}) {
  const maquina = await getSingleMachine(id);
  return (
    <>
    <SocketProvider>
    <ConfirmarJuegos maquina={maquina} />
    </SocketProvider>

      
    </>
  );
}