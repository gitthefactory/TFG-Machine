

import ConfirmarJuegos from "@/components/Juegos/ConfirmarJuegos";
import getSingleMachine from "@/controllers/getSingleMachine";
import React from "react";

export default async function EditMachines({params: {id}}: {params: {id: string}}) {
  const maquina = await getSingleMachine(id);
  return (
    <>
      <ConfirmarJuegos maquina={maquina} />
    </>
  );
}