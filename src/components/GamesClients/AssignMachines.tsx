"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsuarios from "@/controllers/getUsers";
import getRooms from "@/controllers/getRooms";
import getGames from "@/controllers/getGames";
import DataTable from 'react-data-table-component';

interface Usuario {
  _id: string;
  nombreCompleto: string;
}

interface Game {
  id: number;
  name: string;
  category: string;
  provider_name: string;
  image: string;
  status: number;
}

interface Room {
  _id: string;
  nombre: string;
}

const EditarMaquina: React.FC<{ maquina: any }> = ({ maquina }) => {
  const [newNombre, setNewNombre] = useState(maquina.id_machine);
  const [newStatus, setNewStatus] = useState(maquina.status);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [newClient, setNewClient] = useState<{ _id: string; nombreCompleto: string }>({
    _id: maquina.client,
    nombreCompleto: '',
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<{ _id: string; nombre: string }>({
    _id: maquina.room,
    nombre: '',
  });

  const [providers, setProviders] = useState<Game[]>(maquina.games);
  const [newProvider, setNewProvider] = useState<{ _id: string; provider_name: string }>({
    _id: "",
    provider_name: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  // Obtener providerId desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('providerId');

  // GET USUARIOS
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const fetchedUsuarios = await getUsuarios("", 10);
        setUsuarios(fetchedUsuarios);
        const usuario = fetchedUsuarios.find(usuario => usuario._id === maquina.client);
        if (usuario) {
          setNewClient(usuario);
        }
      } catch (error) {
        console.error("Error al obtener Cliente:", error);
      }
    }
    fetchUsuarios();
  }, [maquina.client]);

  // GET ROOMS
  useEffect(() => {
    async function fetchRooms() {
      try {
        const fetchedRooms = await getRooms("", 10);
        setRooms(fetchedRooms);
        const room = fetchedRooms.find(room => room._id === maquina.room);
        if (room) {
          setNewRoom(room);
        }
      } catch (error) {
        console.error("Error al obtener salas:", error);
      }
    }
    fetchRooms();
  }, [maquina.room]);

  // GET GAMES
  useEffect(() => {
    if (providerId) {
      const fetchProviders = async () => {
        try {
          const gamesData = await getGames("", 1);

          const providerMap = new Map();
          gamesData.games.forEach((game: any) => {
            if (game.provider === parseInt(providerId)) {
              if (!providerMap.has(game.id)) {
                const gameStatus = maquina.games.find((maqGame: any) => maqGame.id === game.id)?.status || 0;
                providerMap.set(game.id, {
                  id: game.id,
                  provider_name: game.provider_name,
                  quantity: 1,
                  provider: game.provider,
                  status: gameStatus,
                  name: game.name,
                  maker: game.maker,
                  category: game.category,
                  image: game.image,
                  cdn_image: game.cdn_image,
                  image_name: game.image_name,
                });
              } else {
                const existingProvider = providerMap.get(game.id);
                if (existingProvider) {
                  existingProvider.quantity++;
                  providerMap.set(game.id, existingProvider);
                }
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
    }
  }, [providerId, maquina.games]);

  const handleStatusChange = async (gameId: number, newStatus: number) => {
    try {
      // Encontrar el juego específico dentro de los proveedores
      const updatedProvider = providers.find((provider) => provider.id === gameId);
  
      if (!updatedProvider) {
        console.error(`No se encontró el juego con id ${gameId}`);
        return;
      }
  
      // Clonar el juego específico y actualizar su estado
      const updatedGame = { ...updatedProvider, status: newStatus };
  
      // Enviar la solicitud PUT solo para actualizar este juego específico
      const response = await fetch(`/api/maquinas/${maquina._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...maquina,
          games: updatedGame, // Enviar solo el juego actualizado como un arreglo
        }),
      });
  
      if (response.ok) {
        // Mostrar un mensaje de éxito según el nuevo estado
        if (newStatus === 1) {
          toast.success("Juego activado exitosamente");
        } else if (newStatus === 0) {
          toast.error("Juego desactivado exitosamente");
        }
      } else {
        console.error("Hubo un error al actualizar la máquina.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };
  
  
  

  const handleSelectAll = async () => {
    const newStatus = !selectAll ? 1 : 0;
    setSelectAll(!selectAll);
  
    const updatedGamesPromises = providers.map(async (provider) => {
      try {
        // Clonar el juego específico y actualizar su estado
        const updatedGame = { ...provider, status: newStatus };
  
        // Enviar la solicitud PUT solo para actualizar este juego específico
        const response = await fetch(`/api/maquinas/${maquina._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...maquina,
            games: updatedGame, // Enviar el juego actualizado como objeto, no como parte de un array
          }),
        });
  
        if (response.ok) {
          // Mostrar un mensaje de éxito según el nuevo estado
          if (newStatus === 1) {
            toast.success(`Juego ${provider.name} activado exitosamente`);
          } else if (newStatus === 0) {
            toast.error(`Juego ${provider.name} desactivado exitosamente`);
          }
        } else {
          console.error("Hubo un error al actualizar la máquina.");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    });
  
    // Esperar a que se completen todas las solicitudes de actualización de juegos
    await Promise.all(updatedGamesPromises);
  };
  
  

  const columns = [
    {
      name: (
        <>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />{" "}
          Estado
        </>
      ),
      cell: (row: Game) => (
        <input
          type="checkbox"
          checked={row.status === 1}
          onChange={() => handleStatusChange(row.id, row.status === 1 ? 0 : 1)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'ID Juegos',
      selector: (row: Game) => row.id,
      sortable: true,
    },
    {
      name: 'Categoría',
      selector: (row: Game) => row.category,
      sortable: true,
    },
    {
      name: 'Imagen',
      cell: (row: Game) => <img src={row.image} alt={row.name} className="w-16 h-16 object-cover" />,
    },
    {
      name: 'Proveedor',
      selector: (row: Game) => row.provider_name,
      sortable: true,
    },
    {
      name: 'Nombre Juegos',
      selector: (row: Game) => row.name,
      sortable: true,
    },
  ];

  const filteredProviders = providers.filter((provider) => {
    return (
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.provider_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Máquina con Juegos" />
          <AtrasButton href="/dashboard/maquinas" />
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form className="p-6.5">
                <h1 className="mb-6">DATOS MÁQUINA SELECCIONADA</h1>
                <div className="flex mb-4 gap-4">
                  {/* MAQUINA */}
                  <div className="flex-1">
                    <label
                      htmlFor="newNombre"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      ID Máquina
                    </label>
                    <input
                      onChange={(e) => setNewNombre(e.target.value)}
                      value={newNombre}
                      className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                      readOnly
                      disabled
                    />
                  </div>
                  {/* SALA */}
                  <div className="flex-1">
                    <div className="flex-1 mr-4">
                      <label
                        htmlFor="newRoom"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Nombre Sala
                      </label>
                      <input
                        value={newRoom.nombre}
                        className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  {/* CLIENTE */}
                  <div className="flex-1">
                    <label
                      htmlFor="newClient"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Cliente
                    </label>
                    <input
                      value={newClient.nombreCompleto}
                      className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                <h2 className="font-medium text-black dark:text-white">
                  Listado de Juegos Disponibles en {newRoom.nombre}
                </h2>
              </header>
              <div className="p-6.5">
                {/* Agrega el campo de búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar juegos..."
                  className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Renderiza la DataTable con los datos filtrados */}
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
          <ToastContainer />
        </div>
      </DefaultLayout>
    </>
  );
};

export default EditarMaquina;
