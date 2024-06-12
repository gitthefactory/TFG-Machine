import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import getJuegos from "@/controllers/juegos/getJuegos";
import { FaToggleOn, FaToggleOff } from "react-icons/fa6";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Definir la interfaz del juego
interface Juego {
  id: number;
  name: string;
  maker: string;
  category: string;
  image: string;
  cdn_image: string;
  provider: number;
  provider_name: string;
  image_name: string;
  checked: boolean;
}

const AssignClients: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [newGames, setNewGames] = useState<Juego[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allGamesAssigned, setAllGamesAssigned] = useState(false);

  const gamesPerPage = 6;

  useEffect(() => {
    const fetchUsuariosClientes = async () => {
      try {
        const usuarios = await getUsers();
        const usuariosClientesFiltrados = usuarios.filter(
          (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
        );
        setUsuariosClientes(usuariosClientesFiltrados);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuariosClientes();
  }, []);

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        setLoading(true);
        const fetchedJuegos = await getJuegos("", 1);
        setNewGames(fetchedJuegos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener juegos:", error);
        setLoading(false);
      }
    };

    fetchJuegos();
  }, []);

  const handleUsuarioChange = (event) => {
    setUsuarioSeleccionado(event.target.value);
  };

  const handleToggleChange = (id: number, checked: boolean) => {
    setNewGames((prevJuegos) =>
      prevJuegos.map((juego) =>
        juego.games.some((game) => game.id === id)
          ? {
              ...juego,
              games: juego.games.map((game) =>
                game.id === id ? { ...game, checked } : game
              ),
            }
          : juego
      )
    );
  };

  const isGameChecked = (userId: string, gameId: number): boolean => {
    // Buscar el usuario por su ID
    const usuario = usuariosClientes.find((usuario) => usuario._id === userId);
  
    // Verificar si el usuario existe y tiene juegos asignados
    if (usuario && usuario.games && usuario.games.length > 0) {
      // Buscar el juego por su ID en los juegos del usuario
      const juego = usuario.games.find((juego) => juego.id === gameId);
      
      // Si el juego existe y está marcado como verdadero, devolver true
      return juego ? juego.checked : false;
    }
  
    // Si el usuario no tiene juegos asignados o el juego no existe, devolver false
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedGames = newGames.flatMap((juego) =>
      juego.games.filter((game) => game.checked)
    );

    const updatedMaquina = {
      games: selectedGames.map((game) => ({
        id: game.id,
        name: game.name,
        maker: game.maker,
        category: game.category,
        image: game.image,
        cdn_image: game.cdn_image,
        provider: game.provider,
        provider_name: game.provider_name,
        image_name: game.image_name,
        checked: game.checked,
      })),
    };

    console.log("Submitting data:", JSON.stringify(updatedMaquina));

    try {
      const response = await fetch(`/api/usuarios/${usuarioSeleccionado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaquina),
      });

      if (response.ok) {
        console.log("Juegos asignados correctamente");
        window.location.href = "/dashboard/juegos";
      } else {
        console.error(
          "Hubo un error al asignar juegos al cliente seleccionado"
        );
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = newGames.flatMap((juego) => juego.games).slice(indexOfFirstGame, indexOfLastGame);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nombre", width: 200 },
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
      field: "checked",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
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
            onClick={() =>
              handleToggleChange(params.row.id, !params.row.checked)
            }
            style={{ cursor: "pointer" }}
          >
            {params.row.checked ? (
              <FaToggleOn className="text-green-500 text-2xl" />
            ) : (
              <FaToggleOff className="text-red-400 text-2xl" />
            )}
          </div>
        </div>
      ),
    },
  ];

  const handleAssignAll = () => {
    if (allGamesAssigned) {
      const updatedGames = newGames.map((juego) => ({
        ...juego,
        games: juego.games.map((game) => ({
          ...game,
          checked: false,
        })),
      }));
      setNewGames(updatedGames);
      setAllGamesAssigned(false);
    } else {
      const updatedGames = newGames.map((juego) => ({
        ...juego,
        games: juego.games.map((game) => ({
          ...game,
          checked: true,
        })),
      }));
      setNewGames(updatedGames);
      setAllGamesAssigned(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="usuarios">Seleccionar usuario:</label>
        <select
          id="usuarios"
          value={usuarioSeleccionado}
          onChange={handleUsuarioChange}
        >
          <option value="">Seleccionar usuario</option>
          {usuariosClientes.map((usuario) => (
            <option key={usuario._id} value={usuario._id}>
              {usuario.nombreCompleto}
            </option>
          ))}
        </select>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAssignAll}
            className={`flex items-center rounded-lg px-4 text-sm font-medium transition-colors ${
              allGamesAssigned
                ? "bg-red-600 text-black border border-black hover:bg-red-700"
                : "bg-green-500 text-white hover:bg-red-700"
            }`}
          >
            <span>
              {allGamesAssigned ? "Desasignar Todos" : "Asignar Todos"}
            </span>
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentGames.map((game) => (
                  <TableRow key={game.id}>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.renderCell
                          ? column.renderCell({ row: game })
                          : game[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={indexOfLastGame >= newGames.flatMap((juego) => juego.games.length)}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          >
            Siguiente
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignClients;
