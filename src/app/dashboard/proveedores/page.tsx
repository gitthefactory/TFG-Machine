"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import ProveedoresDetalle from "@/components/ProveedoresDetalle";
import ProveedoresTable from "@/components/ProveedoresTable";
import React from "react";
// import AddButton from "@/components/AddButton";

const Proveedores: React.FC = () => {
  return (
    <>
      <DefaultLayout>
        
        <Breadcrumb pageName="Proveedores" />
        {/* <AddButton href="/dashboard/providersClients/page" /> */}

        <ProveedoresTable query={""} currentPage={0} />
        {/* <ProveedoresDetalle query={""} currentPage={0} /> */}
      </DefaultLayout>
    </>
  );
};

export default Proveedores;
