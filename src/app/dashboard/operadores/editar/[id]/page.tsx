

import OperatorForm from "@/components/OperatorForm";
import getSingleOperator from "@/controllers/getSingleOperator";
import React from "react";

export default async function EditOperator({params: {id}}: {params: {id: string}}) {
  const operator = await getSingleOperator(id);
  return (
    <>
      <OperatorForm operator={operator} />
    </>
  );
}