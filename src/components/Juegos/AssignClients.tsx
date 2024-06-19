import React, { useEffect, useState } from "react";
import getGames from "@/controllers/getGames";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Select from "react-select";

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

  const handleCheckboxChange = (params) => {
    const updatedGames = games.map((game) => {
      if (game.id === params.row.id) {
        const newSelectedStatus = game.selected ? 0 : 1;
        const updatedGame = { ...game, selected: newSelectedStatus };
        localStorage.setItem(
          "selectedGames",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("selectedGames") || "{}"),
            [game.id]: newSelectedStatus,
          })
        );

        // Make a PUT request to update the status in your backend
        // Example:
        // fetch(`http://localhost:3000/api/maquinas/${game.id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ selected: newSelectedStatus }),
        // })
        //   .then(response => response.json())
        //   .then(data => console.log('Success:', data))
        //   .catch((error) => console.error('Error:', error));

        return updatedGame;
      }
      return game;
    });
    setGames(updatedGames);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "N°", flex: 1 },
    { field: "name", headerName: "Nombre Juego", flex: 1 },
    { field: "category", headerName: "Categoría", flex: 1 },
    {
      field: "image",
      headerName: "Imagen",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt="imagen"
          style={{ width: "50px", height: "auto" }}
        />
      ),
    },
    { field: "provider_name", headerName: "Proveedor", flex: 1 },
    {
      field: "selected",
      headerName: "Seleccionar",
      width: 150,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.value === 1}
          onChange={() => handleCheckboxChange(params)}
        />
      ),
    },
  ];

  const filteredGames = selectedProviderId
    ? games.filter((game) => game.provider === selectedProviderId)
    : games;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mx-auto max-w-screen-lg p-4 bg-white">
      <div className="mb-4">
        <Select
          value={
            selectedProviderId
              ? {
                  value: selectedProviderId,
                  label:
                    providers[selectedProviderId] ||
                    `Proveedor ${selectedProviderId}`,
                }
              : null
          }
          onChange={(selectedOption) =>
            setSelectedProviderId(selectedOption ? selectedOption.value : null)
          }
          options={[
            ...Array.from(new Set(games.map((game) => game.provider))).map(
              (providerId) => ({
                value: providerId,
                label: providers[providerId] || `Proveedor ${providerId}`,
              })
            ),
          ]}
        />
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
    </div>
  );
}
