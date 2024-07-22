

import SalasTransfer from "@/components/Salas/SalasTransfer";
import getSingleRoom from "@/controllers/getSingleRoom";
import React from "react";

export default async function EditRooms({params: {id}}: {params: {id: string}}) {
  const sala = await getSingleRoom(id);
  return (
    <>
      <SalasTransfer sala={sala} />
    </>
  );
}