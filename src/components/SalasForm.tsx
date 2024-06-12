"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getOperadores from "@/controllers/getOperators";
import getClientes from "@/controllers/getClients";
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

const EditarSala: React.FC<{ sala: any }> = ({ sala }) => {
  const [newNombre, setNewNombre] = useState(sala.nombre);
  const [newStatus, setNewStatus] = useState(sala.status);
  const [newPais, setNewPais] = useState(sala.pais);
  // const [newCiudad, setNewCiudad] = useState(sala.ciudad);
  // const [newComuna, setNewComuna] = useState(sala.comuna);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

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

  // GET OPERADORES
  useEffect(() => {
    async function fetchOperadores() {
      try {
        const fetchedOperadores = await getOperadores("", 10);
        setOperadores(fetchedOperadores);
      } catch (error) {
        console.error("Error al obtener operadores:", error);
      }
    }
    fetchOperadores();
  }, []);

  // GET CLIENTES
  useEffect(() => {
    async function fetchClientes() {
      try {
        const fetchedClientes = await getClientes("", 10);
        setClientes(fetchedClientes);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    }
    fetchClientes();
  }, []);

  // Función para manejar cambios en la selección de usuario
  const handleOperadorChange = (value: string) => {
    setOperadorSeleccionado(value);
  };

  const handleClienteChange = (value: string) => {
    setClienteSeleccionado(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedSala = {
      newNombre,
      newStatus,
      operator: operadorSeleccionado,
      client: clienteSeleccionado,
    };

    // Enviar los datos actualizados al servidor
    try {
      const response = await fetch(`/api/salas/${sala._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSala),
      });

      if (response.ok) {
        window.location.href = "/dashboard/salas";
      } else {
        console.error("Hubo un error al actualizar la sala.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleCreateMachine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/maquinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (response.status === 201) {
        console.log("Máquina creada con éxito");
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard/maquinas";
        }
      } else {
        console.error("Error al crear la máquina:", responseData);
      }
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Editar Sala" />
        <AtrasButton href="/dashboard/salas" />
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit} className="p-6.5">
              {/* Formulario de edición de sala */}
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
              <div className="mb-4">
                <label
                  htmlFor="pais"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Cambiar país
                </label>
                <select
                  onChange={(e) => setNewPais(e.target.value)}
                  value={newPais}
                  id="pais"
                  name="pais"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value={"Brazil"}>Brazil</option>
                  <option value={"Chile"}>Chile</option>
                  <option value={"Estados Unidos"}>Estados Unidos</option>
                  <option value={"Mexico"}>Mexico</option>
                  <option value={"Perú"}>Perú</option>
                </select>
              </div>
              {/* Otras campos de edición */}
              {/* ... */}
              <div className="mb-4">
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
              <div className="mx-auto max-w-270">
                <form onSubmit={handleCreateMachine} className="p-6.5">
                  <button
                    className="mt-5 w-auto rounded bg-gray p-2 font-medium float-left"
                    type="submit"
                  >
                    Crear máquina +
                  </button>
                </form>
              </div>
              {/* Botones */}
              <div className="mt-6 flex justify-end gap-4">
                <Link
                  href="/dashboard/salas"
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

export default EditarSala;
