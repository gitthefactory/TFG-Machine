import React, { useEffect, useState } from "react";
import getGames from "@/controllers/getGames";
import DataTable from 'react-data-table-component';

interface Game {
  id: number;
  provider_name: string;
  quantity: number;
  provider: number;
  status: number;
}

export default function ProveedoresTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [games, setGames] = useState<Game[]>([]);
  const [providers, setProviders] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames(query, currentPage);
        const storedGames = JSON.parse(localStorage.getItem("selectedGames") || "{}");

        const updatedGames = gamesData.games.map((game: Game) => ({
          ...game,
          selected: storedGames[game.provider] || false,
        }));

        setGames(updatedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [query, currentPage]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const gamesData = await getGames(query, currentPage);

        const providerMap: Map<number, Game> = new Map();

        gamesData.games.forEach((game: any) => {
          if (!providerMap.has(game.provider)) {
            providerMap.set(game.provider, {
              id: game.provider,
              provider_name: game.provider_name,
              quantity: 1,
              provider: game.provider,
              status: game.status,
            });
          } else {
            const existingProvider = providerMap.get(game.provider);
            if (existingProvider) {
              existingProvider.quantity++;
              providerMap.set(game.provider, existingProvider);
            }
          }
        });

        const uniqueProviders = Array.from(providerMap.values());
        setProviders(uniqueProviders);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    fetchProviders();
  }, [query, currentPage]);

  const handleToggleStatus = async (providerId: number) => {
    const updatedProviders = providers.map(provider =>
      provider.id === providerId
        ? { ...provider, status: provider.status === 0 ? 1 : 0 }
        : provider
    );

    setProviders(updatedProviders);

    const updatedProvider = updatedProviders.find(provider => provider.id === providerId);
    if (updatedProvider) {
      try {
        const response = await fetch(`/api/updateProviderStatus`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: updatedProvider.id, status: updatedProvider.status }),
        });

        if (!response.ok) {
          throw new Error('Error updating provider status');
        }
      } catch (error) {
        console.error("Error updating provider status:", error);
      }
    }
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: Game) => (
        <input
          type="checkbox"
          checked={row.status === 1}
          onChange={() => handleToggleStatus(row.id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'N°',
      selector: (row: Game) => row.id,
      sortable: true,
    },
    {
      name: 'Nombre Proveedor',
      selector: (row: Game) => row.provider_name,
      sortable: true,
    },
    {
      name: 'Cantidad Juegos',
      selector: (row: Game) => row.quantity,
      sortable: true,
    },
  ];

  const filteredProviders = providers.filter((provider) => (
    provider.provider_name.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="mx-auto max-w-270">
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark">
      <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
        <h2 className="font-medium text-black dark:text-white">
          Listado de proveedores
        </h2>
      </header>
      <div className="p-6.5">
        {/* Agregar campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar proveedor..."
          className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Renderizar DataTable con los datos filtrados */}
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
