"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SalasTable from "@/components/Salas/SalasTable";
import React, { useEffect, useState } from "react";
import getRooms from "@/controllers/getRooms";
import AddButton from "@/components/AddButton";
import { SocketProvider} from "@/app/api/socket/socketContext";

// Define el tipo para la sala
interface Sala {
  id: string;
  // Agrega otros campos según sea necesario
}

// Componente para el contenido de Salas
const SalasContent: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRooms("", 5);
        const salasConIds = data.map((sala: any, index: { toString: () => any; }) => ({
          ...sala,
          id: index.toString(),
        }));
        setSalas(salasConIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

  
  }, []);

  return (
    <>
    <SocketProvider>
      <Breadcrumb pageName="Salas" />
      <div className="flex justify-between items-center mb-4">
        {/* Botón de agregar */}
        <AddButton href="/dashboard/salas/crear" />
        {/* Botón para asignar juegos */}
        {/* <Link href="/dashboard/salas/assign">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Asignar Juegos
          </button>
        </Link> */}
      </div>
      <SalasTable salas={salas} />
      </SocketProvider>
    </>
  );
};

// Componente principal de Salas
const Salas: React.FC = () => {
  return (
    <SocketProvider>
      <DefaultLayout>
        <SalasContent />
      </DefaultLayout>
    </SocketProvider>
  );
};

export default Salas;
