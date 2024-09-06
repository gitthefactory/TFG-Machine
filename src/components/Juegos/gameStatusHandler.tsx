import React, { useEffect, useState } from "react";
import getJuegos from "@/controllers/juegos/getJuegos";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useSocket } from "@/app/api/socket/socketContext"; // Usa el contexto de socket

export default function DetalleProveedores() {
  const [games, setGames] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const { socket } = useSocket(); // Obtener el socket del contexto

  useEffect(() => {
    fetchGames();

    // Escuchar actualizaciones de estado de juegos desde el servidor
    if (socket) {
      socket.on('gameStatusUpdated', (updatedGame: any) => {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === updatedGame.id ? { ...game, status: updatedGame.status } : game
          )
        );
        toast.info(`El estado del juego ${updatedGame.name} ha sido actualizado.`);
      });
    }

    return () => {
      if (socket) {
        socket.off('gameStatusUpdated');
      }
    };
  }, [socket]);

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

  // Actualizar el estado de un juego individual
  const handleRowSelect = async (gameId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      const response = await fetch(`/api/juegosApi/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Cambiar el estado
      });

      if (!response.ok) {
        throw new Error(`Error updating game ${gameId}: ${response.statusText}`);
      }

      // Emitir evento de estado de juego actualizado
      if (socket) {
        socket.emit('gameStatusUpdated', { id: gameId, status: newStatus });
      }

      const updatedGames = games.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      );
      setGames(updatedGames);

      if (newStatus === 1) {
        toast.success(`Juego activado exitosamente`);
      } else {
        toast.error(`Juego desactivado exitosamente`);
      }
    } catch (error) {
      console.error(`Hubo un error al actualizar el estado del juego ${gameId}:`, error);
      toast.error(`Error al actualizar el estado del juego ${gameId}`);
    }
  };

  // Actualizar el estado de todos los juegos
  const handleSelectAll = async () => {
    try {
      const newStatus = !selectAll ? 1 : 0;
      const promises = games.map(async (game) => {
        try {
          const response = await fetch(`/api/juegosApi/${game.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });

          if (!response.ok) {
            throw new Error(`Error updating game ${game.id}: ${response.statusText}`);
          }

          // Emitir evento de estado de juego actualizado para todos
          if (socket) {
            socket.emit('gameStatusUpdated', { id: game.id, status: newStatus });
          }

          return { ...game, status: newStatus };
        } catch (error) {
          console.error(`Hubo un error al actualizar el estado del juego ${game.id}:`, error);
          toast.error(`Error al actualizar el estado del juego ${game.name}`);
        }
      });

      const updatedGames = await Promise.all(promises);
      setGames(updatedGames);
      setSelectAll(!selectAll);

      if (newStatus === 1) {
        toast.success(`Todos los juegos activados`);
      } else {
        toast.error(`Todos los juegos desactivados`);
      }
    } catch (error) {
      console.error("Hubo un error al actualizar el estado global:", error);
      toast.error("Error al actualizar el estado global");
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
        <Image src={row.image} alt={row.name} className="w-16 h-16 object-cover" width={500} height={500} />
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
