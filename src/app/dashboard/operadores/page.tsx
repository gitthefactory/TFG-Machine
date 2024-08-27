"use client";

import Link from "next/link";
import AddButton from "@/components/AddButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OperadoresTable from "@/components/Operadores/OperadoresTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getOperators from "@/controllers/getOperators";
import React, { useEffect, useState } from "react";
import { SocketProvider } from "@/app/socket.io/socketContext";

interface RowData {
  id: number;
  nombreCompleto: string;
  empresa: string;
  pais: string;
  ciudad: string;
  acciones: JSX.Element; // Cambio de string a JSX.Element
}

const Operadores: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getOperators("", 1); // Llama a la función getClients con la búsqueda vacía y la página 1
        setRows(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  
  return (
    <>
    <SocketProvider>
      <DefaultLayout>
        <Breadcrumb pageName="Operadores" />
        <div className="flex justify-between items-center mb-4">

        {/* Botón de agregar */}
        {/* <AddButton href="/dashboard/operadores/crear" /> */}
          {/* Botón de crear operador*/}
        <Link href="/dashboard/operadores/createOperator">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
             Crear Operador +
            </button>
          </Link>
          </div>
        <OperadoresTable rows={rows}  />
      </DefaultLayout>
      </SocketProvider>
    </>
  );
};

export default Operadores;
