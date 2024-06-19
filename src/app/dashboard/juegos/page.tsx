"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AssignClients from "@/components/Juegos/AssignClients";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getMachines from "@/controllers/getMachines";
import React, { useEffect, useState } from "react";

interface MaquinaData {
  _id: string; // Añade la propiedad id a UsuarioData
  nombre: string;
  descripcion: string;
  status: number;
  acciones: JSX.Element; // Cambio de string a JSX.Element
}

const Maquinas: React.FC = () => {
  const [maquinas, setMaquinas] = useState<MaquinaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMachines("",5); // Llama a la función para obtener salas
        // Añade un id único a cada usuario
        const maquinasConIds = data.map((maquina: any, index: { toString: () => any; }) => ({
          ...maquina,
          id: index.toString(),
        }));
        setMaquinas(maquinasConIds);
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
        <Breadcrumb pageName="Control de Juegos" />
        <AssignClients maquinas={maquinas} />
      </DefaultLayout>
    </>
  );
};

export default Maquinas;
