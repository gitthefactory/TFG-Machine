"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProveedoresDetalle from "@/components/Proveedores/ProveedoresDetalle";
import React from "react";

const Proveedores: React.FC = () => {
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Proveedores" />
        <ProveedoresDetalle query={""} currentPage={0} />
      </DefaultLayout>
    </>
  );
};

export default Proveedores;
