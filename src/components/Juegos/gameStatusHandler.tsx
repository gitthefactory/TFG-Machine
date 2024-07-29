import React, { useEffect, useState } from "react";
import getJuegos from "@/controllers/juegos/getJuegos";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

interface GameData {
  id: number;
  name: string;
  provider: string;
  category: string;
  image: string;
  status: boolean;
}

export default function DetalleProveedores() {
  const [games, setGames] = useState<GameData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getJuegos("", 1);
        if (gamesData && gamesData.length > 0) {
          const updatedGames: GameData[] = [];
          gamesData.forEach((gameData: any) => {
            gameData.games.forEach((game: any) => {
              updatedGames.push({
                id: game.id,
                name: game.name,
                provider: game.provider_name,
                category: game.category,
                image: game.image,
                status: game.status === 1, // Convertir a booleano
              });
            });
          });
          setGames(updatedGames);
        } else {
          setGames([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al recuperar juegos");
      }
    };

    fetchGames();
  }, []);

  const handleRowSelect = async (gameId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/juegosApi/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: currentStatus ? 0 : 1 }), // Cambiar el estado opuesto al actual
      });
      if (!response.ok) {
        throw new Error(`Error updating game ${gameId}: ${response.statusText}`);
      }
      const updatedGames = games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            status: !currentStatus,
          };
        }
        return game;
      });
      setGames(updatedGames);
      toast.success(`Juego ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error(`Hubo un error al actualizar estado para el juego ${gameId}:`, error);
      toast.error(`Error al actualizar estado para el juego ${gameId}`);
    }
  };

  const handleSelectAll = async () => {
    try {
      const promises = games.map(async (game) => {
        try {
          const response = await fetch(`/api/juegosApi/${game.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: !selectAll ? 1 : 0 }),
          });
          if (!response.ok) {
            throw new Error(`Error updating game ${game.id}: ${response.statusText}`);
          }
          return {
            ...game,
            status: !selectAll,
          };
        } catch (error) {
          console.error(`Hubo un error al actualizar estado para el juego ${game.id}:`, error);
          toast.error(`Error al actualizar estado para el juego ${game.name}`);
        }
      });
      const updatedGames = await Promise.all(promises);
      setGames(updatedGames);
      setSelectAll(!selectAll);
      toast.success(`Juegos ${!selectAll ? 'activados' : 'desactivados'} globalmente exitosamente`);
    } catch (error) {
      console.error("Hubo un error al actualizar estado global:", error);
      toast.error("Error al actualizar estado global");
    }
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: (
        <>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />{" "}
          Estado
        </>
      ),
      cell: (row: GameData) => (
        <input
          type="checkbox"
          checked={row.status}
          onChange={() => handleRowSelect(row.id, row.status)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
      width: '100px',
    },
    {
      name: "ID Juegos",
      selector: (row: GameData) => row.id,
      sortable: true,
      width: '100px',
    },
    {
      name: "Categoría",
      selector: (row: GameData) => row.category,
      sortable: true,
    },
    {
      name: "Imagen",
      cell: (row: GameData) => (
        <Image src={row.image} alt={row.name} className="w-16 h-16 object-cover" width={500} height={500} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: '100px',
    },
    {
      name: "Proveedor",
      selector: (row: GameData) => row.provider,
      sortable: true,
    },
    {
      name: "Nombre Juegos",
      selector: (row: GameData) => row.name,
      sortable: true,
    },
  ];

  return (
    <div className="mx-auto max-w-270">
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Control de juegos / panel Administrador
          </h2>
        </header>
        <div className="p-6">
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DataTable
            columns={columns}
            data={filteredGames}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
}
