import React, { useEffect, useState } from "react";
import Link from "next/link";
import getGames from "@/controllers/getGames";
import { FaPenToSquare, FaDeleteLeft, FaToggleOn, FaToggleOff } from "react-icons/fa6";
import { useTable } from "react-table";

interface Games {
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
  const [providers, setProviders] = useState<Games[]>([]);
  const [games, setGames] = useState<Games[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames(query, currentPage);
        const storedGames = JSON.parse(localStorage.getItem("selectedGames") || "{}");

        const updatedGames = gamesData.games.map((game: Games) => ({
          ...game,
          selected: storedGames[game.provider] || false,
        }));

        setGames(updatedGames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGames();
  }, [query, currentPage]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const gamesData = await getGames(query, currentPage);

        const providerMap: Map<number, Games> = new Map();

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
        console.error(error);
      }
    };

    fetchProviders();
  }, [query, currentPage]);

  const columns = React.useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ value }) => (value > 0 ? <FaToggleOn /> : <FaToggleOff />),
      },
      { Header: "Nombre Proveedor", accessor: "provider_name" },
      { Header: "Cantidad Juegos", accessor: "quantity" },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div>
            <Link href={`/dashboard/proveedores/ver/${row.original.id}`}>
              <button>
                <FaPenToSquare />
              </button>
            </Link>
            <button onClick={() => handleButtonToggle(row.original.id)}>
              <FaDeleteLeft />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: providers });

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/dashboard/gamesClientes">
          <button>
            Asignar proveedores
          </button>
        </Link>
      </div>

      <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
