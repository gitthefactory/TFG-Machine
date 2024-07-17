import React, { useEffect, useState } from "react";
import getJuegos from "@/controllers/juegos/getJuegos";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DetalleProveedores() {
  const [games, setGames] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    fetchGames();
  }, []); // Se ejecuta solo al montar el componente

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

  const handleSelectAll = async () => {
    try {
      const updatedSelectAll = !selectAll; // Invertir el estado de selectAll
      setSelectAll(updatedSelectAll); // Actualizar el estado local de selectAll

      const promises = games.map(async (game) => {
        try {
          const response = await fetch(`/api/juegosApi/${game.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: updatedSelectAll ? 1 : 0 }),
          });

          if (!response.ok) {
            throw new Error(`Error updating game ${game.id}: ${response.statusText}`);
          }

          const responseData = await response.json();
          console.log(`Update response for game ${game.id}:`, responseData);

          if (updatedSelectAll) {
            toast.success(`Juego ${game.name} activado globalmente exitosamente`);
          } else {
            toast.error(`Juego ${game.name} desactivado globalmente exitosamente`);
          }
        } catch (error) {
          console.error(`Hubo un error al actualizar estado para el juego ${game.id}:`, error);
          toast.error(`Error al actualizar estado para el juego ${game.name}`);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error("Hubo un error al actualizar estado global:", error);
      toast.error("Error al actualizar estado global");
    }
  };

  const handleRowSelect = async (id: string) => {
    const updatedGames = games.map(game =>
      game.id === id ? { ...game, status: !game.status } : game
    );
    setGames(updatedGames);

    const gameToUpdate = updatedGames.find(game => game.id === id);
    if (gameToUpdate) {
      try {
        const response = await fetch(`/api/juegosApi/${gameToUpdate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: gameToUpdate.status ? 1 : 0 }),
        });

        if (!response.ok) {
          throw new Error(`Error updating game ${gameToUpdate.id}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log(`Update response for game ${gameToUpdate.id}:`, responseData);

        if (gameToUpdate.status) {
          toast.success(`Juego ${gameToUpdate.name} activado exitosamente`);
        } else {
          toast.error(`Juego ${gameToUpdate.name} desactivado exitosamente`);
        }
      } catch (error) {
        console.error(`Hubo un error al actualizar estado para el juego ${gameToUpdate.id}:`, error);
        toast.error(`Error al actualizar estado para el juego ${gameToUpdate.name}`);
      }
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
          Estados
        </>
      ),
      selector: (row: any) => (
        <input
          type="checkbox"
          checked={row.status}
          onChange={() => handleRowSelect(row.id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "ID Juegos",
      selector: (row: any) => row.id,
      sortable: true,
    },
    {
      name: "Categoría",
      selector: (row: any) => row.category,
      sortable: true,
    },
    {
      name: "Imagen",
      cell: (row: any) => (
        <img src={row.image} alt={row.name} className="w-16 h-16 object-cover" />
      ),
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
