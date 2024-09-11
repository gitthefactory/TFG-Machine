
import AssignMachines from "@/components/GamesClients/AssignMachines";
import getSingleMachine from "@/controllers/getSingleMachine";
import React from "react";
import { SocketProvider } from "@/app/api/socket/socketContext";

interface Params {
  params: {
    id: string;
    providerId: string;
  };
}

export default async function EditMachine({ params: { id, providerId } }: Params) {
  const maquina = await getSingleMachine(id);
  return (
    <>
    <SocketProvider>
      <AssignMachines maquina={maquina} providerId={providerId} />
      </SocketProvider>
    </>
  );
}
