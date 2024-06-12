"use client";

import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import DefaultLayout from "./Layouts/DefaultLayout";
import Breadcrumb from "./Breadcrumbs/Breadcrumb";
import AtrasButton from "./AtrasButton";
import getUsers from "@/controllers/getUsers";
import getClientes from "@/controllers/getClients";

interface Cliente {
  _id: string;
  user: string;
}

interface Usuario {
  _id: string;
  nombreCompleto: string;
}


export default function OperatorForm({ operator }) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  const [newTelefono, setNewTelefono] = useState(operator.telefono || "");
  const [newEmpresa, setNewEmpresa] = useState(operator.empresa || "");
  const [newPais, setNewPais] = useState(operator.pais || "");
  const [newIdioma, setNewIdioma] = useState(operator.idioma || "");
  const [newDireccion, setNewDireccion] = useState(operator.direccion || "");
  const [newComuna, setNewComuna] = useState(operator.comuna || "");
  const [newCiudad, setNewCiudad] = useState(operator.ciudad || "");
  const [newStatus, setNewStatus] = useState(operator.status || "");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const fetchedUsuarios = await getUsers("", 1); // Obtener usuarios sin filtro y en la primera página
        setUsuarios(fetchedUsuarios);
        //console.log(fetchedUsuarios)
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    }

    fetchUsuarios();
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

  const handleUsuarioChange = (value: SetStateAction<string>) => {
    setUsuarioSeleccionado(value);
  };

  const handleClienteChange = (value: string) => {
    setClienteSeleccionado(value);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();

    const newOperator = {
     newTelefono,
      newEmpresa,
      newPais,
      newIdioma,
      newDireccion,
      newComuna,
      newCiudad,
      newStatus,
      user: usuarioSeleccionado,
      client: clienteSeleccionado,
    };

    const response = await fetch(`/api/operadores/${operator._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOperator),
    });

    if (typeof window !== "undefined" && response.status === 200) {
      window.location.href = "/dashboard/operadores/";
    }
    console.log(newOperator);
  }

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Editar Operador" />
          <AtrasButton href="/dashboard/operadores" />
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form onSubmit={handleSubmit} className="p-6.5">
                {/* Selección de Usuario */}
                <div className="mb-4">
                  <label
                    htmlFor="usuarios"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccionar Usuario
                  </label>
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleUsuarioChange(e.target.value)
                    }
                    value={usuarioSeleccionado}
                    id="usuarios"
                    name="usuarios"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                    {usuarios.map((usuario: any) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombreCompleto}
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

                {/* Teléfono */}
                <div className="mb-4">
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Teléfono
                  </label>
                  <input
                    onChange={(e) => setNewTelefono(e.target.value)}
                    value={newTelefono}
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="Ingresa número de teléfono.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    />
                </div>

                {/* Empresa */}
                <div className="mb-4">
                  <label
                    htmlFor="empresa"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Empresa
                  </label>
                  <input
                    onChange={(e) => setNewEmpresa(e.target.value)}
                    value={newEmpresa}
                    id="empresa"
                    name="empresa"
                    type="text"
                    placeholder="Ingresa nombre de la empresa.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    />
                </div>

                {/* Pais */}
                <div className="mb-4">
                  <label
                    htmlFor="roles"
                    className="mb-2 block text-sm font-medium text-white"
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

                {/* Idioma */}
                <div className="mb-4">
                  <label
                    htmlFor="roles"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Cambiar idioma
                  </label>
                  <select
                    onChange={(e) => setNewIdioma(e.target.value)}
                    value={newIdioma}
                    id="idioma"
                    name="idioma"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                    <option value={"Chino"}>Chino</option>
                    <option value={"Portugués"}>Portugués</option>
                    <option value={"Español/MX"}>Español/MX</option>
                    <option value={"Español/CL"}>Español/CL</option>
                  </select>
                </div>

                {/* Dirección */}
                <div className="mb-4">
                  <label
                    htmlFor="direccion"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Direccion
                  </label>
                  <input
                    onChange={(e) => setNewDireccion(e.target.value)}
                    value={newDireccion}
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Ingresa nombre de la empresa.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    />
                </div>

                {/* Comuna */}
                <div className="mb-4">
                  <label
                    htmlFor="comuna"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Comuna
                  </label>
                  <input
                    onChange={(e) => setNewComuna(e.target.value)}
                    value={newComuna}
                    id="comuna"
                    name="comuna"
                    type="text"
                    placeholder="Ingresa nombre de la comuna.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    />
                </div>

                {/* Ciudad */}
                <div className="mb-4">
                  <label
                    htmlFor="ciudad"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Ciudad
                  </label>
                  <input
                    onChange={(e) => setNewCiudad(e.target.value)}
                    value={newCiudad}
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    placeholder="Ingresa nombre de la ciudad.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    />
                </div>

                {/* Cambiar estado */}
                <div className="mb-4">
                  <label
                    htmlFor="estados"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Cambiar estado
                  </label>
                  {/* Dropdown para cambiar estado */}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <Link
                    href="/dashboard/operadores"
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                  >
                    Editar Operador
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
