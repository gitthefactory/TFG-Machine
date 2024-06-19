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
import { FaCheckSquare, FaTimes } from 'react-icons/fa';

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
    _id: maquina.games,
    provider_name: '',
  });

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

  const handleStatusChange = async (e: React.MouseEvent<HTMLButtonElement>, gameId: number, newStatus: number) => {
    e.preventDefault();
    const updatedProviders = providers.map((provider) =>
      provider.id === gameId ? { ...provider, status: newStatus } : provider
    );
    setProviders(updatedProviders);

    const updatedMaquina = {
      newStatus,
      newRoom,
      newClient: newClient._id,
      games: updatedProviders,
    };

    try {
      const response = await fetch(`/api/maquinas/${maquina._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaquina),
      });

      if (response.ok) {
        if (newStatus === 0) {
          toast.success("Juego enviado exitosamente");
        } else if (newStatus === 1) {
          toast.error("Juego quitado exitosamente");
        }
      } else {
        console.error("Hubo un error al actualizar la máquina.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  function getStatusClass(status) {
    // Implementar lógica de clases si es necesario
  }

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

                  {/* PROVEEDOR */}
                  <div className="flex-1">
                    <div className="flex-1 mr-4">
                      <label
                        htmlFor="newProvider"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Proveedor
                      </label>
                      <input
                        value={providerId}
                        className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <h3 className="mb-4">SELECCION DE JUEGOS</h3>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">ID Juegos</th>
                      <th className="px-4 py-2 text-left">Categoría</th>
                      <th className="px-4 py-2 text-left">Imagen</th>
                      <th className="px-4 py-2 text-left">Proveedor</th>
                      <th className="px-4 py-2 text-left">Nombre Juegos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers
                      .filter(game => game.status === 0 || game.status === 1)
                      .map(game => (
                        <tr key={game.id} className={getStatusClass(game.status)}>
                                                   <td className={`px-4 py-2`}>
                            {game.status === 1 ? (
                              <button
                                onClick={(e) => handleStatusChange(e, game.id, 0)}
                                className="text-red-500"
                              >
                                <FaTimes />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => handleStatusChange(e, game.id, 1)}
                                className="text-green-500"
                              >
                                <FaCheckSquare />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2">{game.id}</td>
                          <td className="px-4 py-2">{game.category}</td>
                          <td className="px-4 py-2">
                            <img src={game.image} alt={game.name} className="w-16 h-16 object-cover" />
                          </td>
                          <td className="px-4 py-2">{game.provider_name}</td>
                          <td className="px-4 py-2">{game.name}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </DefaultLayout>
      <ToastContainer />
    </>
  );
};

export default EditarMaquina;
