"use client";

// import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SalasTable from "@/components/SalasTable";
import React, { useEffect, useState } from "react";
import getRooms from "@/controllers/getRooms";
import AddButton from "@/components/AddButton";

const Salas: React.FC = () => {
  const [salas, setSalas] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRooms("", 5);
        const salasConIds = data.map((sala: any, index: { toString: () => any; }) => ({
          ...sala,
          id: index.toString(),
        }));
        setSalas(salasConIds);
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
      </DefaultLayout>
    </>
  );
};

export default Salas;
