import React, { useEffect, useState } from "react";
import Link from "next/link";
import getGames from "@/controllers/getGames";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Select from "react-select";
import Image from 'next/image';

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

const providers = {
  // 29: "Belatra Gaming",
  // 68: "Bgaming",
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

  const columns: GridColDef[] = [
    { field: "id", headerName: "N°", flex: 1 },
    { field: "name", headerName: "Nombre Juego", flex: 1 },
    { field: "category", headerName: "Categoría", flex: 1 },
    {
      field: "image",
      headerName: "Imagen",
      flex: 1,
      renderCell: (params) => (
        <Image
          src={params.row.image}
          alt="imagen"
          style={{ width: "50px", height: "auto" }}
          width={500} 
          height={500}
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
          checked={params.value}
          // onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  const filteredGames = selectedProviderId
    ? games.filter((game) => game.provider === selectedProviderId)
    : games;

  return (
    <div>
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
      <div className="mt-6 flex justify-between gap-4">
        
        <Link
          href="/dashboard/proveedores"
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
        >
          Atrás
        </Link>
      </div>
    </div>
  );
}
