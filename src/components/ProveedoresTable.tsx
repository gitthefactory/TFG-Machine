import React, { useEffect, useState } from "react";
import Link from "next/link";
import getGames from "@/controllers/getGames";
import { FaPenToSquare, FaToggleOn, FaToggleOff } from "react-icons/fa6";
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

  const handleToggleStatus = (providerId: number) => {
    setProviders(prevProviders =>
      prevProviders.map(provider =>
        provider.id === providerId
          ? { ...provider, status: provider.status === 0 ? 1 : 0 }
          : provider
      )
    );
  };

  const columns = React.useMemo(
    () => [
      { Header: "N°", accessor: "id", align: 'left' },
      {
        Header: "Estado",
        align: 'left',
        accessor: "status",
        Cell: ({ value, row }) => (
          value === 1 ? (
            <FaToggleOn style={{ color: 'green', cursor: 'pointer' }} onClick={() => handleToggleStatus(row.original.id)} />
          ) : (
            <FaToggleOff style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleToggleStatus(row.original.id)} />
          )
        ),
      },
      { Header: "Nombre Proveedor", accessor: "provider_name", align: 'left' },
      { Header: "Cantidad Juegos", accessor: "quantity", align: 'left' },
      // {
      //   Header: "Acciones",
      //   align: 'left',
      //   Cell: ({ row }) => (
      //     <div>
      //       <Link href={`/dashboard/proveedores/ver/${row.original.id}`}>
      //         <button>
      //           <FaPenToSquare />
      //         </button>
      //       </Link>
      //       {/* <button onClick={() => handleButtonToggle(row.original.id)}>
      //         <FaDeleteLeft />
      //       </button> */}
      //     </div>
      //   ),
      // },
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
    <div className="mx-auto max-w-270">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div>
            <table {...getTableProps()} style={{ borderSpacing: 0, width: '100%' }}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        {...column.getHeaderProps()}
                        className={`border-b border-[#eee] px-4 py-2 bg-gray-200 dark:bg-gray-900 ${column.align === 'left' ? 'text-left' : 'text-center'}`}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      style={{ backgroundColor: index % 2 === 0 ? '#E8EDED' : 'transparent' }}
                    >
                      {row.cells.map(cell => (
                        <td
                          {...cell.getCellProps()}
                          className="border-b border-[#eee] px-4 py-2 text-left"
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
