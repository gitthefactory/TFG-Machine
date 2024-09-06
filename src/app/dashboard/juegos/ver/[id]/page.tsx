"use client";

import { SocketProvider } from "@/app/api/socket/socketContext";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProveedoresDetalle from "@/components/Proveedores/ProveedoresDetalle";
import React from "react";

const Proveedores: React.FC = () => {
  return (
    <>
    <SocketProvider>
      <DefaultLayout>
        <Breadcrumb pageName="Proveedores" />
        <ProveedoresDetalle query={""} currentPage={0} />
      </DefaultLayout>
      </SocketProvider>
    </>
  );
};

export default Proveedores;
