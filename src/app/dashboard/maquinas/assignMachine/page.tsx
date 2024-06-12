"use client";

import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AssignMachines from "@/components/GamesClients/AssignMachines";

interface UsuarioData {
  games: {
    id: number;
    provider_name: string;
    provider: number;
    checked: boolean;
  }[];
}

const AssignMachine: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers("", 5);
        setUsuarios(data);
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
        <Breadcrumb pageName="Asignar Juegos por Maquinas" />
        <div>
          {usuarios.map((usuario, index) => (
            <AssignMachines key={index} usuario={usuario} />
          ))}
        </div>
      </DefaultLayout>
    </>
  );
};

export default AssignMachine;
