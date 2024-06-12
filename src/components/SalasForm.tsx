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
  const [newDescripcion, setNewDescripcion] = useState(sala.descripcion);
  const [newRuta, setNewRuta] = useState(sala.ruta);
  const [newStatus, setNewStatus] = useState(sala.status);
  const [newPais, setNewPais] = useState(sala.pais);
  const [newCiudad, setNewCiudad] = useState(sala.ciudad);
  const [newComuna, setNewComuna] = useState(sala.comuna);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [operadores, setOperadores] = useState([]);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState("");

  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");


  // GET USUARIOS
 useEffect(() => {
  async function fetchUsuarios() {
    try {
      const fetchedUsuarios = await getUsuarios("", 10); // Obtener los usuarios disponibles
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
        const fetchedOperadores = await getOperadores("", 10); // Obtener los clientes disponibles
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
        console.error("Error al obtener operadores:", error);
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
      newDescripcion,
      newRuta,
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
        // Redireccionar a la página de salas si la actualización fue exitosa
        window.location.href = "/dashboard/salas";
      } else {
        // Manejar el caso en que la actualización falla
        console.error("Hubo un error al actualizar la sala.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Editar Sala" />
          <AtrasButton href="/dashboard/salas" />
          <div className="flex flex-col gap-9">
            {/* <!-- Form --> */}
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
                        (usuario: Usuario) => usuario._id === operador.user,
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
                        (usuario: Usuario) => usuario._id === cliente.user,
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
                {/* Ruta */}
                <div className="mb-4">
                  <label
                    htmlFor="newRuta"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Ruta
                  </label>
                  <input
                    onChange={(e) => setNewRuta(e.target.value)}
                    value={newRuta}
                    id="newRuta"
                    name="newRuta"
                    type="text"
                    placeholder="Ingresa la ruta.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  />
                </div>

                {/* Pais */}
                <div className="mb-4">
                  <label
                    htmlFor="roles"
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

                {/*CIUDAD / COMUNA*/}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="comuna"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Comuna
                  </label>
                  <input
                    onChange={(e) => setNewComuna(e.target.value)}
                    value={newComuna}
                    id="comuna"
                    name="comuna"
                    type="text"
                    placeholder="Ingresa comuna"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="ciudad"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Ciudad
                  </label>
                  <input
                     onChange={(e) => setNewCiudad(e.target.value)}
                     value={newCiudad}
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    placeholder="Ingresa ciudad"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  />
                </div>
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
    </>
  );
};

export default EditarSala;
