

import ClientForm from "@/components/ClientForm";
import getSingleClient from "@/controllers/getSingleClient";
import React from "react";

export default async function EditClient({params: {id}}: {params: {id: string}}) {
  const client = await getSingleClient(id);
  return (
    <>
      <ClientForm client={client} />
      
    </>
  );
}