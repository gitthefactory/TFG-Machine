

import OperatorForm from "@/components/Operadores/OperatorForm";
import getSingleUser from "@/controllers/getSingleUser";
import React from "react";

export default async function EditOperator({params: {id}}: {params: {id: string}}) {
  const usuario = await getSingleUser(id);
  return (
    <>
      <OperatorForm usuario={usuario} />
    </>
  );
}