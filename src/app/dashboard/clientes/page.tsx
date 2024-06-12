"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DataTable from "@/components/DataTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import getClients from "@/controllers/getClients";
import AddButton from "@/components/AddButton";

interface RowData {
  id: number;
  nombreCompleto: string;
  empresa: string;
  pais: string;
  ciudad: string;
  acciones: JSX.Element; // Cambio de string a JSX.Element
}

const Clientes: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [session, setSession] = useState();
  const [setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getClients("", 1); // Llama a la función getClients con la búsqueda vacía y la página 1
        setRows(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Clientes" />
        {/* Botón de agregar */}
        <AddButton href="/dashboard/clientes/crear" />
       <DataTable rows={rows} />
      </DefaultLayout>
    </>
  );
};

export default Clientes;
