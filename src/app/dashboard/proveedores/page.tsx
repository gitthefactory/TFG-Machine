"use client";

import { SocketProvider } from "@/app/api/socket/socketContext";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import ProveedoresDetalle from "@/components/ProveedoresDetalle";
import ProveedoresTable from "@/components/Proveedores/ProveedoresTable";
import React from "react";
// import AddButton from "@/components/AddButton";

const Proveedores: React.FC = () => {
  return (
    <>
    <SocketProvider>
      <DefaultLayout>
        
        <Breadcrumb pageName="Proveedores" />
        {/* <AddButton href="/dashboard/providersClients/page" /> */}

        <ProveedoresTable query={""} currentPage={0} />
        {/* <ProveedoresDetalle query={""} currentPage={0} /> */}
      </DefaultLayout>
      </SocketProvider>
    </>
  );
};

export default Proveedores;
