

import MaquinasTransfer from "@/components/Maquinas/MaquinaTransfer";
// import getSingleMachine from "@/controllers/getSingleMachine";
import getSingleTransaction from "@/controllers/getSingleTransaction";
import React from "react";

export default async function EditTransaction({params: {id}}: {params: {id: string}}) {
  const transaction = await getSingleTransaction(id);
  return (
    <>
      <MaquinasTransfer transaction={transaction} />
    </>
  );
}
