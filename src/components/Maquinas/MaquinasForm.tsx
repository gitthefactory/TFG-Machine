"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsuarios from "@/controllers/getUsers";
import getRooms from "@/controllers/getRooms"
import getGames from "@/controllers/getGames";
import { FaPenToSquare } from "react-icons/fa6";

interface Usuario {
  _id: string;
  nombreCompleto: string;
}

interface Games {
  id: number;
  provider_name: string;
  quantity: number;
  provider: number;
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
  const [providers, setProviders] = useState<Games[]>(maquina.games);

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
    const fetchProviders = async () => {
      try {
        const gamesData = await getGames("", 1);

        const providerMap: Map<number, Games> = new Map();

        gamesData.games.forEach((game: any) => {
          if (!providerMap.has(game.provider)) {
            const providersStatus = maquina.providers.find((g) => g.provider === game.provider)?.status || 0;
            providerMap.set(game.provider, {
              id: game.provider,
              provider_name: game.provider_name,
              quantity: 1,
              provider: game.provider,
              status: providersStatus === 1 ? 1 : 0,
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
    
  }, [maquina.providers]);






  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedMaquina = {
      newStatus,
      newRoom,
      newClient: newClient._id,
      providers,
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

  // const usuariosOperador = usuarios.filter(
  //   (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
  // );

  const handleStatusChange = (e: React.MouseEvent<HTMLButtonElement>, providerId: number, newStatus: number) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del botón
    setProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider.id === providerId ? { ...provider, status: newStatus } : provider
      )
    );
  };

  function getStatusClass(status) {
    return status === 0 ? "bg-red-100" : "bg-green";
  }


  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Editar Máquina" />
          <AtrasButton href="/dashboard/maquinas" />
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form onSubmit={handleSubmit} className="p-6.5">

                <h1 className="mb-6">DATOS MÁQUINA</h1>
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
                  {/* Estado */}
                  <div className="flex-1">
                    <label
                      htmlFor="newStatus"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Estado
                    </label>
                    <select
                      onChange={(e: any) => setNewStatus(e.target.value)}
                      value={newStatus}
                      id="newStatus"
                      name="newStatus"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>
                </div>
                {/* Selección de Maquina */}
                <h3 className="mb-4">DATOS ADMINISTRATIVOS</h3>
                <div className="flex">
                  {/* Selección de Maquina */}
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

                  {/* Selección de Cliente */}
                  <div className="flex-1">
                    <div className="flex-1 mr-4">
                      <label
                        htmlFor="newClient"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Nombre Cliente
                      </label>
                      <input
                        value={newClient.nombreCompleto}
                        className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>


                </div>
                <br />
                <h3 className="mb-4">PROVEEDORES</h3>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">ID Proveedor</th>
                      <th className="px-4 py-2 text-left">Nombre Proveedor</th>
                      <th className="px-4 py-2 text-left">Cantidad Juegos</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((provider, index) => (
                      <tr key={provider.id} className={getStatusClass(provider.status)}>
                        <td className={`px-4 py-2 ${getStatusClass(provider.status)}`}>
                          <input
                            type="checkbox"
                            checked={provider.status === 1}
                            onChange={(e) => handleStatusChange(e, provider.id, e.target.checked ? 1 : 0)}
                            className="form-checkbox h-5 w-5 text-green-500"
                          />
                        </td>
                        <td className="px-4 py-2">{provider.id}</td>
                        <td className="px-4 py-2">{provider.provider_name}</td>
                        <td className="px-4 py-2">{provider.quantity}</td>
                        <td className="px-4 py-2">
                          <Link href={`/dashboard/maquinas/assignMachine/${maquina._id}?providerId=${provider.id}`}>

                            <FaPenToSquare />

                          </Link>
                        </td>
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
