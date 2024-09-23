
// AQUI ESTÁ CREDIT MACHINE


import SalasTransfer from "@/components/Maquinas/creditMachine";
import getSingleRoom from "@/controllers/getSingleRoom";
import React from "react";
import { SocketProvider } from "@/app/api/socket/socketContext";

export default async function EditRooms({params: {id}}: {params: {id: string}}) {
  const sala = await getSingleRoom(id);
  return (
    <>
    <SocketProvider>
      <SalasTransfer sala={sala} />
      </SocketProvider>
    </>
  );
}