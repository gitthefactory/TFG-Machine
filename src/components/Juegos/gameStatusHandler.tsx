import React, { useEffect, useState } from "react";
import getJuegos from "@/controllers/juegos/getJuegos";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function DetalleProveedores() {
  const [games, setGames] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const gamesData = await getJuegos("", 1);
      if (gamesData && gamesData.length > 0) {
        let updatedGames: any[] = [];
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
    }
  };

  const handleRowSelect = async (gameId: number, currentStatus: number) => {
    try {
      const response = await fetch(`/api/juegosApi/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: currentStatus === 0 ? 1 : 0 }), // Cambiar el estado opuesto al actual
      });
      if (!response.ok) {
        throw new Error(`Error updating game ${gameId}: ${response.statusText}`);
      }
      const responseData = await response.json();
      console.log(`Update response for game ${gameId}:`, responseData);
      if (currentStatus === 0) {
        toast.success(`Juego activado exitosamente`);
      } else {
        toast.error(`Juego desactivado exitosamente`);
      }
      const updatedGames = games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            status: currentStatus === 0 ? 1 : 0,
          };
        }
        return game;
      });
      setGames(updatedGames);
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
          const responseData = await response.json();
          console.log(`Update response for game ${game.id}:`, responseData);
          if (!selectAll) {
            toast.success(`Juego activado globalmente exitosamente`);
          } else {
            toast.error(`Juego desactivado globalmente exitosamente`);
          }
          const updatedGames = games.map((gameItem) => {
            if (gameItem.id === game.id) {
              return {
                ...gameItem,
                status: !selectAll ? 1 : 0,
              };
            }
            return gameItem;
          });
          setGames(updatedGames);
        } catch (error) {
          console.error(`Hubo un error al actualizar estado para el juego ${game.id}:`, error);
          toast.error(`Error al actualizar estado para el juego ${game.name}`);
        }
      });
      await Promise.all(promises);
      setSelectAll(!selectAll);
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
      selector: (row: any) => (
        <input
          type="checkbox"
          checked={row.status}
          onChange={() => handleRowSelect(row.id, row.status ? 1 : 0)}
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
      selector: (row: any) => row.id,
      sortable: true,
      width: '100px',
    },
    {
      name: "Categoría",
      selector: (row: any) => row.category,
      sortable: true,
    },
    {
      name: "Imagen",
      cell: (row: any) => (
        <Image src={row.image} alt={row.name} className="w-16 h-16 object-cover"width={500} height={500} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: '100px',
    },
    {
      name: "Proveedor",
      cell: (row: any) => row.provider,
      sortable: true,
    },
    {
      name: "Nombre Juegos",
      selector: (row: any) => row.name,
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
