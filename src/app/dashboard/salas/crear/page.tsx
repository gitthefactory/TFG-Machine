"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import getoperators from "@/controllers/getOperators";
import getClientes from "@/controllers/getClients";
import AtrasButton from "@/components/AtrasButton";

export default function CrearSalas() {
  const [nombre, setNombre] = useState("");
  const [status, setStatus] = useState(1);
  const [pais, setPais] = useState("Seleccionar");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  // GET USUARIOS
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsuarios = await getoperators("", 1);
        setUsuarios(fetchedUsuarios);

        const fetchedClientes = await getClientes("", 10);
        setClientes(fetchedClientes);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    }

    fetchData();
  }, []);

  const handleClienteChange = (value: string) => {
    setClienteSeleccionado(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    // Crear un objeto con los datos de la nueva sala
    let newSala = {
      nombre,
      status,
      pais,
      comuna,
      ciudad,
      operator: usuarioSeleccionado,
      client: clienteSeleccionado,
    };

    // Convertir el valor de usuarioSeleccionado a undefined si es null
    if (usuarioSeleccionado === null) {
      newSala = {
        ...newSala,
        operator: undefined,
      };
    }

    console.log("Nuevo Sala:", newSala); // Agregado para depurar
    // Realizar una solicitud POST al endpoint de creación de salas
    const response = await fetch("/api/salas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSala),
    });

    
    // Si la solicitud es exitosa y se crea la sala, redireccionar a la página de salas
    if (response.status === 201) {
      // Obtener los datos de la respuesta en formato JSON
      const responseData = await response.json();
      // Obtener la ID de la nueva sala creada desde la respuesta
      const nuevaSalaId = responseData.data._id; // Asegúrate de acceder a la ID según la estructura de tu respuesta

      // Redirigir a la página de edición de la sala con la nueva ID
      window.location.href = `/dashboard/salas/editar/${nuevaSalaId}`;
    } else {
      // Manejar errores si la solicitud no fue exitosa
      console.error("Error al crear la sala:", response.statusText);
    }
  } catch (error) {
    // Manejar errores de JavaScript o de red
    console.error("Error al crear la sala:", error);
  }
};

  const usuariosClientes = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
  );

  const usuariosOperador = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
  );

  console.log("Usuario Seleccionado:", usuarioSeleccionado); // Agregado para depurar

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Crear Salas" />
          <AtrasButton href="/dashboard/salas" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit} className="p-6.5">
              <h1 className="mb-6">DATOS DE LA SALA</h1>
              {/* Nombre */}
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Nombre Sala <span className="text-red">*</span>
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

              {/* Pais / Ciudad / Comuna */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <label
                    htmlFor="pais"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Cambiar país <span className="text-red">*</span>
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
                <div className="w-full xl:w-1/3">
                  <label
                    htmlFor="comuna"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Comuna <span className="text-red">*</span>
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
                <div className="w-full xl:w-1/3">
                  <label
                    htmlFor="ciudad"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Ciudad <span className="text-red">*</span>
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

              <h3 className="mb-4">DATOS ADMINISTRATIVOS</h3>
              <div className="mb-4">
                <label
                  htmlFor="clientes"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Seleccionar Cliente <span className="text-red">*</span>
                </label>
                <select
                  onChange={(e) => setClienteSeleccionado(e.target.value)}
                  value={clienteSeleccionado}
                  id="clientes"
                  name="clientes"
                  className="w-full rounded mt-2 border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                >
                  <option value="">Seleccionar</option>
                  {usuariosClientes.map((usuario) => (
                    <option key={usuario._id} value={usuario._id}>
                      {usuario.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="operadores"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Seleccionar Operadores
                </label>
                <select
                  onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                  value={usuarioSeleccionado}
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
