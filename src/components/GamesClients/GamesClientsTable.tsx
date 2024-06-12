import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import getJuegos from "@/controllers/juegos/getJuegos";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FaToggleOn, FaToggleOff } from "react-icons/fa6";

interface User {
  _id: string;
  nombreCompleto: string;
  typeProfile: {
    _id: string;
  };
  games: { provider: string }[];
}

interface Juego {
  id: number;
  provider_name: string;
  category: string;
  image: string;
  provider: string;
  checked: boolean;
}

const GamesClientsTable: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [gamesColumns, setGamesColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    const fetchUsuariosClientes = async () => {
      try {
        setLoading(true);
        const usuarios = await getUsers();
        const usuariosClientesFiltrados = usuarios.filter(
          (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
        );
        setUsuariosClientes(usuariosClientesFiltrados);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        // Manejo de errores
      }
    };

    fetchUsuariosClientes();
  }, []);

  useEffect(() => {
    const fetchJuegosData = async () => {
      try {
        setLoading(true);
        const fetchedJuegos = await getJuegos("", 1);
        // Encontrar el usuario seleccionado
        const selectedUserObject = usuariosClientes.find(user => user._id === selectedUser);
        if (!selectedUserObject) {
          // Manejar el caso en que no se encuentre el usuario seleccionado
          console.error("Usuario no encontrado");
          setLoading(false);
          return;
        }
        // Obtener los proveedores seleccionados del usuario
        const selectedProviders = selectedUserObject.games.map((game: any) => game.provider);
        const juegosWithStatus = fetchedJuegos.map((juego, index) => ({
          id: index,
          provider_name: juego.provider_name,
          category: juego.category,
          image: juego.image,
          provider: juego.provider,
          checked: selectedProviders.includes(juego.provider),
        }));
        setJuegos(juegosWithStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener juegos:", error);
        setLoading(false);
      }
    };
    fetchJuegosData();
  }, [selectedUser]);
  

  useEffect(() => {
    // Definir las columnas de la tabla de juegos
    const columns: GridColDef[] = [
      { field: "id", headerName: "ID", width: 100 },
      { field: "provider_name", headerName: "Nombre", width: 200 },
      { field: "provider", headerName: "ID Proveedor", flex: 1 },
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
              onClick={(e) =>
                handleToggleChange(params.row.id, !params.row.checked)
              }
              style={{
                cursor: "pointer",
                color: params.row.checked ? "green" : "black",
              }}
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

    setGamesColumns(columns);
  }, []);

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUser(userId);
  
    try {
      setLoading(true);
      // Obtener los juegos asociados al usuario seleccionado
      const response = await fetch(`/api/usuarios/${userId}`);
      const userData = await response.json();
  
      // Verificar si el usuario tiene algún proveedor asociado en sus juegos
      const tieneProveedor = userData.games.length > 0;
  
      // Marcar todos los juegos con el proveedor como seleccionados
      const juegosWithStatus = juegos.map((juego) => ({
        ...juego,
        checked: tieneProveedor,
      }));
      setJuegos(juegosWithStatus);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los juegos del usuario:", error);
      setLoading(false);
      // Manejo de errores
    }
  };

  const handleToggleChange = (id: number, checked: boolean) => {
    setJuegos((prevJuegos) =>
      prevJuegos.map((juego) =>
        juego.id === id ? { ...juego, checked } : juego
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      console.error("No se ha seleccionado ningún usuario");
      return;
    }

    try {
      setLoading(true);
      await updateUserGames(
        selectedUser,
        juegos.filter((juego) => juego.checked)
      );
      setLoading(false);
      console.log("Juegos enviados exitosamente al usuario");
    } catch (error) {
      console.error("Error al enviar los juegos:", error);
      setLoading(false);
      // Manejo de errores
    }
  };

  const updateUserGames = async (userId: string, games: Juego[]) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newId_games: games }),
    };

    const response = await fetch(`/api/usuarios/${userId}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al enviar juegos al usuario"
      );
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white flex items-center">
          Seleccionar Usuario Cliente
        </h4>
        <select
          value={selectedUser}
          onChange={handleUserChange}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
        >
          <option value="">Seleccionar</option>
          {usuariosClientes.map((usuario) => (
            <option key={usuario._id} value={usuario._id}>
              {usuario.nombreCompleto}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            {/* Tabla de Juegos */}
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={juegos}
                columns={gamesColumns}
                pageSize={5}
                loading={loading}
              />
            </div>
            {/* Botones */}
            <div className="mt-6 flex justify-end gap-4">
              <a
                href="/dashboard/juegos"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
              >
                Cancelar
              </a>
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
  );
};

export default GamesClientsTable;
