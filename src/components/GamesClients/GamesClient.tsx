"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getJuegos from "@/controllers/juegos/getJuegos";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FaToggleOn, FaToggleOff } from "react-icons/fa6";

// Definir la interfaz del juego
interface Juego {
  games: { id: number; name: string; checked: boolean }[];
  _id: string;
  nombre: string;
  provider: number;
}

const ConfirmarJuegos: React.FC<{ maquina: any }> = ({ maquina }) => {
  const [newNombre, setNewNombre] = useState(maquina.nombre);
  const [newGames, setNewJuegos] = useState<Juego[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar juegos
  useEffect(() => {
    async function fetchJuegos() {
      try {
        setLoading(true);

        // Obtener todos los juegos
        const fetchedJuegos = await getJuegos("", 1);

        // Obtener los juegos seleccionados de la máquina
        const selectedGames = maquina.games.flatMap((juego: any) => juego.games);

        // Marcar los juegos como checked si están en los juegos seleccionados
        const juegosConChecked = fetchedJuegos.map((juego: Juego) => ({
          ...juego,
          games: juego.games.map(game => ({
            ...game,
            checked: selectedGames.some((selectedGame: any) => selectedGame.id === game.id && selectedGame.provider === game.provider)
          })),
        }));

        setNewJuegos(juegosConChecked);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener juegos:", error);
        setLoading(false);
      }
    }

    fetchJuegos();
  }, [maquina.games]); // Ejecutar el efecto solo una vez al montar el componente

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedMaquina = {
      newGames: newGames.map(juego => ({
        ...juego,
        games: juego.games.filter(game => game.checked)
      }))
    };

    // Enviar los datos actualizados al servidor
    try {
      const response = await fetch(`/api/juegosApi/${maquina._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaquina),
      });

      if (response.ok) {
        // Redireccionar a la página de máquinas si la actualización fue exitosa
        window.location.href = "/dashboard/juegos";
      } else {
        // Manejar el caso en que la actualización falla
        console.error("Hubo un error al actualizar la máquina.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleToggleChange = (id: number, checked: boolean) => {
    setNewJuegos(prevJuegos =>
      prevJuegos.map(juego => ({
        ...juego,
        games: juego.games.map(game =>
          game.id === id ? { ...game, checked } : game
        ),
      }))
    );
    console.log(`Juego con ID ${id} ha sido ${checked ? "seleccionado" : "deseleccionado"}`);
  };

  // Definir las columnas de la tabla
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "category", headerName: "Categoría", flex: 1 },
    {
      field: "image",
      headerName: "Imagen",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={params.row.image}
          alt="imagen"
          style={{ width: "50px", height: "auto" }}
        />
      ),
    },
    { field: "provider_name", headerName: "Proveedor", flex: 1 },
    {
      field: "checked",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
         <div
            className="h-8 w-8 flex items-center justify-center rounded dark:bg-transparent"
            onClick={(e) => handleToggleChange(params.row.id, !params.row.checked)}
            style={{ cursor: "pointer" }}
          >
            {params.row.checked ? <FaToggleOn className="text-green-500 text-2xl" /> : <FaToggleOff className="text-red-400 text-2xl" />}
          </div>

                  </div>
                ),
              },
            ];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Confirmar Juegos" />
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white flex items-center">
            Máquina Seleccionada
          </h4>
        </div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit} className="p-6.5">
              {/* Nombre */}
              <div className="mb-4">
                <input
                  onChange={(e) => setNewNombre(e.target.value)}
                  value={newNombre}
                  id="newNombre"
                  name="newNombre"
                  type="text"
                  placeholder="Ingresa el nombre."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                />
              </div>

              {/* Tabla de Juegos */}
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={newGames.flatMap(juego => juego.games)}
                  columns={columns}
                  pageSize={5}
                />
              </div>

              {/* Botones */}
              <div className="mt-6 flex justify-end gap-4">
                <Link
                  href="/dashboard/juegos"
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ConfirmarJuegos;
