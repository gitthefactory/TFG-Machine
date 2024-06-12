import React, { useEffect, useState } from "react";
import Link from "next/link";
import getGames from "@/controllers/getGames";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import socket from "@/app/api/socket";

interface Game {
  id: number;
  name: string;
  provider: number;
  category: string;
  selected: boolean;
}

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

// Lista de proveedores con sus nombres correspondientes
const providers = {
  29: "Belatra Gaming",
  68: "Bgaming",
  // Añade más proveedores según sea necesario
};

export default function DetalleProveedores({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.Loading
  );
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames(query, currentPage);
        const storedGames = JSON.parse(
          localStorage.getItem("selectedGames") || "{}"
        );
        const updatedGames = gamesData.games.map((game: Game) => ({
          ...game,
          selected: storedGames[game.id] || false,
        }));
        setGames(updatedGames);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };

    fetchGames();
  }, [query, currentPage]);

  // Manejar el cambio de un checkbox
  const handleCheckboxChange = (gameId: number) => {
    const updatedGames = games.map((game) => {
      if (game.id === gameId) {
        const updatedGame = { ...game, selected: !game.selected };
        localStorage.setItem(
          "selectedGames",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("selectedGames") || "{}"),
            [gameId]: updatedGame.selected,
          })
        );
        return updatedGame;
      }
      return game;
    });
    setGames(updatedGames);
    socket.emit("checkboxChange", {
      id: gameId,
      isChecked: updatedGames.find((game) => game.id === gameId)?.selected,
    });
  };

  // Escuchar cambios de checkbox desde el servidor
  useEffect(() => {
    socket.on(
      "checkboxChange",
      ({ id, isChecked }: { id: number; isChecked: boolean }) => {
        const updatedGames = games.map((game) => {
          if (game.id === id) {
            return { ...game, selected: isChecked }; // Actualizar el estado del juego
          }
          return game;
        });
        setGames(updatedGames);
      }
    );

    return () => {
      socket.off("checkboxChange");
    };
  }, [games]);

  // Modificar las columnas para usar con DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "N°", flex: 1 },
    { field: "name", headerName: "Nombre Juego", flex: 1 },
    { field: "category", headerName: "Categoría", flex: 1 },
    { field: "provider_name", headerName: "Proveedor", flex: 1 },
    {
      field: "selected",
      headerName: "Seleccionar",
      width: 150,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  // Filtrar juegos basados en el proveedor seleccionado
  const filteredGames = selectedProviderId
    ? games.filter((game) => game.provider === selectedProviderId)
    : games;

  return (
    <div>
      <div className="mb-4">
        {/* Agregar un select para seleccionar el proveedor */}
        <select
          value={selectedProviderId || ""}
          onChange={(e) =>
            setSelectedProviderId(Number(e.target.value) || null)
          }
          className="border border-gray-300 rounded-md px-3 py-1"
        >
          <option value="">Todos los Proveedores</option>
          {/* Opciones de proveedores basados en los juegos obtenidos */}
          {Array.from(new Set(games.map((game) => game.provider))).map(
            (providerId) => (
              <option key={providerId} value={providerId}>
                {providers[providerId] || `Proveedor ${providerId}`}
              </option>
            )
          )}
        </select>
      </div>
      
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredGames}
          columns={columns}
          loading={loadingState === LoadingState.Loading}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/proveedores"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Atrás
        </Link>
      </div>
    </div>
  );
}
