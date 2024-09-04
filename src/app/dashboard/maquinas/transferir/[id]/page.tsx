

import MaquinasTransfer from "@/components/Maquinas/MaquinaTransfer";
// import getSingleMachine from "@/controllers/getSingleMachine";
import getSingleTransaction from "@/controllers/getSingleTransaction";
import React from "react";
import { SocketProvider } from "@/app/api/socket/socketContext";

export default async function EditTransaction({params: {id}}: {params: {id: string}}) {
  const transaction = await getSingleTransaction(id);
  return (
    <>
    <SocketProvider>
      <MaquinasTransfer transaction={transaction} />
      </SocketProvider>
    </>
  );
}
