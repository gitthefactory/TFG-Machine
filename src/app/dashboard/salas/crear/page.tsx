"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import getOperadores from "@/controllers/getOperators";
import getClientes from "@/controllers/getClients";
import getUsuarios from "@/controllers/getUsers";
import AtrasButton from "@/components/AtrasButton";

interface Usuario {
  _id: string;
  nombreCompleto: string;
  typeProfile: {
    _id: string;
    typeProfile: string;
  };
}

interface Cliente {
  _id: string;
  user: string;
}

export default function CrearSalas() {
  const [nombre, setNombre] = useState("");
  //const [descripcion, setDescripcion] = useState("");
  // const [ruta, setRuta] = useState("");
  const [status, setStatus] = useState("Seleccionar");
  const [pais, setPais] = useState("Seleccionar");
  const [ciudad, setCiudad] = useState();
  const [comuna, setComuna] = useState();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  // GET USUARIOS
 
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsuarios = await getUsuarios("", 10);
        const fetchedClientes = await getClientes("", 10);
        setUsuarios(fetchedUsuarios);
        setClientes(fetchedClientes);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  // Filtrar usuarios por tipo de perfil cliente
  const usuariosClientes = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
  );

  const handleClienteChange = (value: string) => {
    setClienteSeleccionado(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Crear un objeto con los datos de la nueva sala
      const newSala = {
        nombre,
       // descripcion,
        // ruta,
        status,
        pais,
        comuna,
        ciudad,
        // operator: operadorSeleccionado,
        client: clienteSeleccionado,
      };
      // Realizar una solicitud POST al endpoint de creación de salas
      const response = await fetch("/api/salas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSala),
      });
      // Si la solicitud es exitosa y se crea la sala, redireccionar a la página de salas
      if (typeof window !== "undefined" && response.status === 201) {
        window.location.href = "/dashboard/salas";
      }
      console.log("Sala creada con éxito:", newSala);
    } catch (error) {
      console.error("Error al crear la sala:", error);
    }
  };

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Crear Salas" />
          <AtrasButton href="/dashboard/salas" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit} className="p-6.5">
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
                    setClienteSeleccionado(e.target.value)
                  }
                  value={clienteSeleccionado}
                  id="clientes"
                  name="clientes"
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

              {/* Nombre */}
              <div className="mb-4">
                <label
                  htmlFor="Nombre"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Nombre Sala
                </label>
                <input
                  onChange={(e) => setNombre(e.target.value)}
                  value={nombre}
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ingrese el nombre"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                />
              </div>
              {/* Descripción */}
              <div className="mb-4">
                {/* <label
                  htmlFor="descripcion"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Descripción Sala
                </label>
                <input
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                  id="descripcion"
                  name="descripcion"
                  type="text"
                  placeholder="Ingrese la descripción"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                /> */}
              </div>
              {/* Ruta
              <div className="mb-4">
                <label
                  htmlFor="ruta"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Ruta
                </label>
                <input
                  onChange={(e) => setRuta(e.target.value)}
                  value={ruta}
                  id="ruta"
                  name="ruta"
                  type="text"
                  placeholder="Ingrese la ruta"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                />
              </div> */}
              {/* Pais */}
              <div className="mb-4">
                <label
                  htmlFor="pais"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Cambiar país
                </label>
                <select
                  onChange={(e: any) => setPais(e.target.value)}
                  value={pais}
                  id="pais"
                  name="pais"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                >
                  <option value="Seleccionar" disabled>
                    Seleccionar
                  </option>
                  <option value="Brazil">Brazil</option>
                  <option value="Chile">Chile</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Perú">Perú</option>
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
                    onChange={(e) => setComuna(e.target.value)}
                    value={comuna}
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
                    onChange={(e) => setCiudad(e.target.value)}
                    value={ciudad}
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
              <div className="w-full xl:w-1/2">
              <label
                  htmlFor="newStatus"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                  Estado
                </label>
                <select
                  onChange={(e: any) => setStatus(e.target.value)}
                  value={status}
                  id="status"
                  name="status"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  >
                  <option value="Seleccionar" disabled>Seleccionar</option>
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
                  Crear Sala
                </button>
              </div>
            </form>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
