"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsers from "@/controllers/getUsers";
import React, { useEffect, useState } from "react";
import GameCardProps from "@/components/GamesClients/GameCardProps";

interface UsuarioData {
  games: {
    id: number;
    provider_name: string;
    provider: number;
    checked: boolean;
  }[];
}

const ProviderClients: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers("", 5); // Llama a la función para obtener usuarios
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
        <Breadcrumb pageName="Mis Juegos" />
        {/* Pasa la lista de usuarios como una propiedad al componente GameCardProps */}
        {usuarios.map((usuario, index) => (
          <GameCardProps key={index} usuario={usuario} />
        ))}
      </DefaultLayout>
    </>
  );
};

export default ProviderClients;
