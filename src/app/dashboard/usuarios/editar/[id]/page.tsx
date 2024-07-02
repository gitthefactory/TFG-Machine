

import UserForm from "@/components/Clientes/UserForm";
import getSingleUser from "@/controllers/getSingleUser";
import React from "react";

export default async function EditClient({params: {id}}: {params: {id: string}}) {
  const usuario = await getSingleUser(id);
  return (
    <>
      <UserForm usuario={usuario} />
    </>
  );
}