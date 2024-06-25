import React, { useEffect, useState } from "react";
import getGames from "@/controllers/getGames";
import Select from "react-select";
import DataTable from 'react-data-table-component';

interface Game {
  id: number;
  name: string;
  provider: number;
  category: string;
  image: string;
  selected: boolean;
}

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

const providers: { [key: number]: string } = {
  29: "Belatra Gaming",
  68: "Bgaming",
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
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  useEffect(() => {
    const pathArray = window.location.pathname.split("/");
    const providerId = parseInt(pathArray[pathArray.length - 1]);
    setSelectedProviderId(providerId);
  }, [window.location.pathname]);

  const handleCheckboxChange = (gameId: number) => {
    const updatedGames = games.map((game) => {
      if (game.id === gameId) {
        const newSelectedStatus = !game.selected;
        const updatedGame = { ...game, selected: newSelectedStatus };
        localStorage.setItem(
          "selectedGames",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("selectedGames") || "{}"),
            [game.id]: newSelectedStatus ? 1 : 0,
          })
        );

        // Aquí deberías hacer una solicitud PUT al backend para actualizar el estado del juego

        return updatedGame;
      }
      return game;
    });
    setGames(updatedGames);
  };

  const columns = [
    {
      name: 'Seleccionar',
      cell: (row: Game) => (
        <input
          type="checkbox"
          checked={row.selected}
          onChange={() => handleCheckboxChange(row.id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'ID Juegos',
      selector: (row: Game) => row.id,
      sortable: true,
    },
    {
      name: 'Categoría',
      selector: (row: Game) => row.category,
      sortable: true,
    },
    {
      name: 'Imagen',
      cell: (row: Game) => <img src={row.image} alt={row.name} className="w-16 h-16 object-cover" />,
    },
    {
      name: 'Proveedor',
      cell: (row: Game) => providers[row.provider],
      sortable: true,
    },
    {
      name: 'Nombre Juegos',
      selector: (row: Game) => row.name,
      sortable: true,
    },
  ];

  const filteredGames = selectedProviderId
    ? games.filter((game) => game.provider === selectedProviderId)
    : games;

  const filteredProviders = filteredGames.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-270">

    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
        <h2 className="font-medium text-black dark:text-white">
          Control de juegos / panel Administrador 
        </h2>
      </header>
      <div className="p-6">
        {/* Agrega el campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar juegos..."
          className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Renderiza la DataTable con los datos filtrados */}
        <DataTable
          columns={columns}
          data={filteredProviders}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
    </div>
  );
}
