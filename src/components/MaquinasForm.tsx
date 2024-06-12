"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getOperadores from "@/controllers/getOperators";
import getClientes from "@/controllers/getClients";
import getSalas from "@/controllers/getRooms";
import getUsuarios from "@/controllers/getUsers";

interface Usuario {
  _id: string;
  nombreCompleto: string;
}

interface Operador {
  _id: string;
  user: string;
}

interface Cliente {
  _id: string;
  user: string;
}

interface Sala {
  _id: string;
  nombre: string;
}

const EditarMaquina: React.FC<{ maquina: any }> = ({ maquina }) => {
  const [newNombre, setNewNombre] = useState(maquina.nombre);
  const [newDescripcion, setNewDescripcion] = useState(maquina.descripcion);
  const [newStatus, setNewStatus] = useState(maquina.status);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const [operadorSeleccionado, setOperadorSeleccionado] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [salaSeleccionada, setSalaSeleccionada] = useState("");

  // Cargar usuarios
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const fetchedUsuarios = await getUsuarios("", 10); // Obtener todos los usuarios
        setUsuarios(fetchedUsuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    }

    fetchUsuarios();
  }, []);

  //GET OPERADORES
  useEffect(() => {
    async function fetchOperadores() {
      try {
        const fetchedOperadores = await getOperadores("", 10); // Obtener los operadores disponibles
        setOperadores(fetchedOperadores);
      } catch (error) {
        console.error("Error al obtener operadores:", error);
      }
    }

    fetchOperadores();
  }, []);

  //GET CLIENTES
  useEffect(() => {
    async function fetchClientes() {
      try {
        const fetchedClientes = await getClientes("", 10); // Obtener los clientes disponibles
        setClientes(fetchedClientes);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    }

    fetchClientes();
  }, []);

  //GET SALAS
  useEffect(() => {
    async function fetchSalas() {
      try {
        const fetchedSalas = await getSalas("", 10); // Obtener las salas disponibles
        setSalas(fetchedSalas);
      } catch (error) {
        console.error("Error al obtener Salas:", error);
      }
    }

    fetchSalas();
  }, []);

  // Función para manejar cambios en la selección de usuario
  const handleOperadorChange = (value: string) => {
    setOperadorSeleccionado(value);
  };

  const handleClienteChange = (value: string) => {
    setClienteSeleccionado(value);
  };

  const handleRoomChange = (value: string) => {
    setSalaSeleccionada(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedMaquina = {
      newNombre,
      newDescripcion,
      newStatus,
      operator: operadorSeleccionado,
      client: clienteSeleccionado,
      room: salaSeleccionada,
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

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Editar Máquina" />
          <AtrasButton href="/dashboard/maquinas" />
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form onSubmit={handleSubmit} className="p-6.5">
                {/* Selección de Operador */}
                <div className="mb-4">
                  <label
                    htmlFor="operadores"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccionar Operador
                  </label>
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleOperadorChange(e.target.value)
                    }
                    value={operadorSeleccionado}
                    id="operadores"
                    name="operadores"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                    {operadores.map((operador: Operador) => (
                      <option key={operador._id} value={operador._id}>
                        {/* Busca el usuario correspondiente y muestra su nombreCompleto */}
                        {usuarios.find(
                          (usuario: Usuario) => usuario._id === operador.user
                        )?.nombreCompleto || "Usuario no encontrado"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selección de Salas */}
                <div className="mb-4">
                  <label
                    htmlFor="salas"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccionar Sala
                  </label>
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleRoomChange(e.target.value)
                    }
                    value={salaSeleccionada}
                    id="salas"
                    name="salas"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                    {salas.map((sala: Sala) => (
                      <option key={sala._id} value={sala._id}>
                        {sala.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selección de Cliente */}
                <div className="mb-4">
                  <label
                    htmlFor="clientes"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccionar Cliente
                  </label>
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleClienteChange(e.target.value)
                    }
                    value={clienteSeleccionado}
                    id="clientes"
                    name="clientes"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                    {clientes.map((cliente: Cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {/* Muestra el nombre completo del cliente */}
                        {usuarios.find(
                          (usuario: Usuario) => usuario._id === cliente.user
                        )?.nombreCompleto || "Usuario no encontrado"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre */}
                <div className="mb-4">
                  <label
                    htmlFor="newNombre"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Nombre
                  </label>
                  <input
                    onChange={(e) => setNewNombre(e.target.value)}
                    value={newNombre}
                    id="newNombre"
                    name="newNombre"
                    type="text"
                    placeholder="Ingresa el nombre.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  />
                </div>
                {/* Descripción */}
                <div className="mb-4">
                  <label
                    htmlFor="newDescripcion"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Descripción
                  </label>
                  <input
                    onChange={(e) => setNewDescripcion(e.target.value)}
                    value={newDescripcion}
                    id="newDescripcion"
                    name="newDescripcion"
                    type="text"
                    placeholder="Ingresa la descripción.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  />
                </div>
                {/* Estado */}
                <div className="mb-4">
                  <label
                    htmlFor="newStatus"
                    className="mb-2 block text-sm font-medium text-white"
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
