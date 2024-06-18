"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsuarios from "@/controllers/getUsers";
import getRooms from "@/controllers/getRooms"
import getGames from "@/controllers/getGames";
import { FaToggleOn, FaToggleOff} from "react-icons/fa6";

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

// interface GameCardProps {
//   usuario: {
//     games: Game[];
//   };
// }



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


 // GET USUARIOS
 useEffect(() => {
  async function fetchUsuarios() {
    try {
      const fetchedUsuarios  = await getUsuarios("", 10);
      setUsuarios(fetchedUsuarios );
      const usuario = fetchedUsuarios .find(usuario => usuario._id === maquina.client);
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
    const fetchProviders = async () => {
      try {
        const gamesData = await getGames("", 1);

        const providerMap: Map<number, Games> = new Map();

        gamesData.games.forEach((game: any) => {
          if (!providerMap.has(game.id)) {
            providerMap.set(game.id, {
              id: game.id,
              provider_name: game.provider_name,
              quantity: 1,
              provider: game.provider,
              status: game.status,
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
        });

        const uniqueProviders = Array.from(providerMap.values());
        setProviders(uniqueProviders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedMaquina = {
      newStatus,
      newRoom,
      newClient: newClient._id,
      games: providers,
    };

    // Enviar los datos actualizados al servidor
    try {
      const response = await fetch(`/api/maquinas/${maquina._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaquina),
      });

      if (response.ok) {
        // Redireccionar a la página de máquinas si la actualización fue exitosa
        window.location.href = "/dashboard/maquinas";
      } else {
        // Manejar el caso en que la actualización falla
        console.error("Hubo un error al actualizar la máquina.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  // Suponiendo que tienes acceso al URL actual
const urlParams = new URLSearchParams(window.location.search);
const providerId = urlParams.get('providerId');

// Ahora puedes usar providerId donde lo necesites en tu vista
console.log(providerId); // Esto mostrará '29' en la consola


  const handleStatusChange = (e: React.MouseEvent<HTMLButtonElement>, providerId: number, newStatus: number) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del botón
    setProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider.id === providerId ? { ...provider, status: newStatus } : provider
      )
    );
  };
  

  function getStatusClass(status) {
  }
  
  

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Máquina con Juegos"/>
          <AtrasButton href="/dashboard/maquinas" />
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form onSubmit={handleSubmit} className="p-6.5">
                
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
                    
                        {/* Añade más columnas según sea necesario */}
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((game) => (
                        <tr key={game.id} className={getStatusClass(game.status)}>
                          <td className={`px-4 py-2 ${getStatusClass(game.status)}`}>
                            {game.status === 0 ? (
                              <button className="text-red focus:outline-none" onClick={(e) => handleStatusChange(e, game.id, 1)}>
                                <FaToggleOn />
                              </button>
                            ) : (
                              <button className="text-green-500 focus:outline-none" onClick={(e) => handleStatusChange(e, game.id, 0)}>
                                <FaToggleOff />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2">{game.id}</td>
                          <td className="px-4 py-2">{game.category}</td>
                          <td className="px-4 py-2">
                            <img src={game.image} alt={game.name} width="50" height="50" />
                          </td>
                          <td className="px-4 py-2">{game.provider_name}</td>
                          <td className="px-4 py-2">{game.name}</td>
                         
                        </tr>
                      ))}
                    </tbody>
                  </table>

                {/* Botones */}
                <div className="mt-6 flex justify-end gap-4">
                  <Link
                    href="/dashboard/maquinas"
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
    </>
  );
};

export default EditarMaquina;
