import React, { useEffect, useState } from "react";
import getJuegos from "@/controllers/juegos/getJuegos"; // Cambiar la importación a getJuegos
import DataTable from 'react-data-table-component';

export default function DetalleProveedores({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [games, setGames] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchGames();
  }, [query, currentPage]);

  const fetchGames = async () => {
    try {
      const gamesData = await getJuegos(query, currentPage);
      console.log("Games Data:", gamesData); // Verifica los datos que recibes
      
      if (gamesData && gamesData.length > 0) {
        const storedGames = JSON.parse(localStorage.getItem("selectedGames") || "{}");
        // Crear un array vacío para almacenar todos los juegos
        let updatedGames = [];
  
        // Iterar sobre cada elemento de gamesData
        gamesData.forEach((gameData) => {
          gameData.games.forEach((game) => {
            updatedGames.push({
              id: game.id,
              name: game.name,
              provider: game.provider_name,
              category: game.category,
              image: game.image,
              selected: storedGames[game.id] || false,
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

  const handleCheckboxChange = (id: string) => {
    // Aquí puedes implementar la lógica para cambiar el estado seleccionado del juego
    // Puedes usar setGames para actualizar el estado de los juegos
  };

  const columns = [
    {
      name: 'Seleccionar',
      cell: (row: any) => (
        <input
          type="checkbox"
          checked={row.selected}
          className="form-checkbox h-5 w-5 text-green-500"
          onChange={() => handleCheckboxChange(row.id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'ID Juegos',
      selector: (row: any) => row.id,
      sortable: true,
    },
    {
      name: 'Categoría',
      selector: (row: any) => row.category,
      sortable: true,
    },
    {
      name: 'Imagen',
      cell: (row: any) => <img src={row.image} alt={row.name} className="w-16 h-16 object-cover" />,
    },
    {
      name: 'Proveedor',
      cell: (row: any) => row.provider,
      sortable: true,
    },
    {
      name: 'Nombre Juegos',
      selector: (row: any) => row.name,
      sortable: true,
    },
  ];

  return (
    <div className="mx-auto max-w-270">
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
            data={games}  
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
}
