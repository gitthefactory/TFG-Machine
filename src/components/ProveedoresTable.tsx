import React, { useEffect, useState } from "react";
import Link from "next/link";
import getGames from "@/controllers/getGames";
import Swal from "sweetalert2";
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
          <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <Link href={`/dashboard/proveedores/ver/${row.original.id}`}>
                <button>
                  <FaPenToSquare/>
                </button>
              </Link>
              <button
                className="hover:text-primary"
                onClick={() => {
                  Swal.fire({
                    text: `¿Estás seguro que deseas ${
                      row.original.status === 0 ? "activar" : "deshabilitar"
                    } al proveedor?`,
                    showCancelButton: true,
                    confirmButtonColor: "green",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Sí, ${
                      row.original.status === 0 ? "activar" : "deshabilitar"
                    }`,
                    cancelButtonText: "No, me equivoqué",
                    imageUrl: row.original.image,
                    imageWidth: 200,
                    imageHeight: 200,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleButtonToggle(row.original.id); 
                      disableProvider(row.original.id); 
                      Swal.fire(
                        `${row.original.status === 0 ? "Activado" : "Deshabilitado"}!`,
                        `El proveedor ha sido ${
                          row.original.status === 0 ? "activado" : "deshabilitado"
                        }.`,
                        "success",
                      );
                    }
                  });
                }}
              >
                <FaDeleteLeft/>
              </button>
            </div>
          </>
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
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 focus:outline-none flex items-center gap-1"     
          >
            Asignar proveedores
          </button>
        </Link>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <table {...getTableProps()} style={{ borderSpacing: "0", width: "100%" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      borderBottom: "1px solid black",
                      background: "aliceblue",
                      color: "black",
                      fontWeight: "bold",
                      padding: "8px",
                    }}
                  >
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
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: "8px",
                          border: "1px solid gray",
                          background: "",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
