
import AssignMachines from "@/components/GamesClients/AssignMachines";
import getSingleMachine from "@/controllers/getSingleMachine";
import React from "react";

export default async function EditMachine({params: {id}}: {params: {id: string}}) {
  const maquina = await getSingleMachine(id);
  return (
    <>
      <AssignMachines maquina={maquina} />
    </>
  );
}