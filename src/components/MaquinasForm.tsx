"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsuarios from "@/controllers/getUsers";
import getGames from "@/controllers/getGames";
import { FaToggleOn, FaToggleOff, FaPenToSquare } from "react-icons/fa6";

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


const EditarMaquina: React.FC<{ maquina: any }> = ({ maquina }) => {
  const [newNombre, setNewNombre] = useState(maquina.id_machine);
  const [newStatus, setNewStatus] = useState(maquina.status);
  const [newClient, setNewClient] = useState<{ _id: string; nombreCompleto: string }>({
    _id: maquina.client,
    nombreCompleto: '',
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState(maquina.operator);
  const [providers, setProviders] = useState<Games[]>(maquina.games);

  // GET USUARIOS
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const fetchedUsuarios = await getUsuarios("", 10);
        setUsuarios(fetchedUsuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    }
    fetchUsuarios();
  }, []);

  // GET GAMES
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const gamesData = await getGames("", 1); // ajusta la consulta y la página según tus necesidades

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
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedMaquina = {
      newStatus,
      newOperator: operadorSeleccionado,
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

  const usuariosOperador = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
  );

  const handleStatusChange = (e: React.MouseEvent<HTMLButtonElement>, providerId: number, newStatus: number) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del botón
    setProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider.id === providerId ? { ...provider, status: newStatus } : provider
      )
    );
  };
  

  function getStatusClass(status) {
    if (status === 0) {
      return "bg-gray-100";
    } else if (status === 1) {
      return "bg-green-100";
    } else {
      return "bg-red-700";
    }
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
                {/* Selección de Operador */}
                <h3 className="mb-4">DATOS ADMINISTRATIVOS</h3>
                <div className="mb-4">
                  <label
                    htmlFor="operadores"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccionar Operadores
                  </label>
                  <select
                    onChange={(e) => setOperadorSeleccionado(e.target.value)}
                    value={operadorSeleccionado}
                    id="operadores"
                    name="operadores"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="">Seleccionar</option>
                    {usuariosOperador.map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombreCompleto}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Selección de Cliente */}
                <div className="mb-4">
                  <label
                    htmlFor="NewClient"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Cliente
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedClient = usuarios.find((user) => user._id === e.target.value);
                      if (selectedClient) {
                        setNewClient(selectedClient);
                      }
                    }}
                    value={newClient._id}
                    id="client"
                    name="client"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="">Seleccionar</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombreCompleto}
                      </option>
                    ))}
                  </select>
                </div>
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
                            {provider.status === 0 ? (
                              <button className="text-gray-500 focus:outline-none" onClick={(e) => handleStatusChange(e, provider.id, 1)}>
                                <FaToggleOn />
                              </button>
                            ) : provider.status === 1 ? (
                              <button className="text-green-500 focus:outline-none" onClick={(e) => handleStatusChange(e, provider.id, 2)}>
                                <FaToggleOff />
                              </button>
                            ) : (
                              <button className="text-red focus:outline-none" onClick={(e) => handleStatusChange(e, provider.id, 0)}>
                                <FaToggleOff />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2">{provider.id}</td>
                          <td className="px-4 py-2">{provider.provider_name}</td>
                          <td className="px-4 py-2">{provider.quantity}</td>
                          <td className="px-4 py-2">
                          <Link href={`/dashboard/maquinas/editar/${maquina._id}/${provider.id}`}>                              
                          <div>
                                <FaPenToSquare />
                              </div>
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
