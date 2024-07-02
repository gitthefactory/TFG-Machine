"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import getUsers from "@/controllers/getUsers";
import getClientes from "@/controllers/getClients";
import AtrasButton from "@/components/AtrasButton";
import getMachines from "@/controllers/getMachines";

export default function CrearOperadores() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [maquinas, setMaquinas] = useState([]);
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsuarios = await getUsers("", 1);
        setUsuarios(fetchedUsuarios);

        const fetchedClientes = await getClientes("", 10);
        setClientes(fetchedClientes);

        const fetchedMaquinas = await getMachines("", "", 1);
        setMaquinas(fetchedMaquinas);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newOperator = {
        status: 1,
        user: usuarioSeleccionado,
        client: clienteSeleccionado,
        maquina: maquinaSeleccionada,
      };
  
      const response = await fetch('/api/operadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOperator)
      });
  
      if (response.ok) {
        console.log("Operador creado con éxito:", newOperator);
        // Redireccionar a /dashboard/operadores si es necesario
        // router.push('/dashboard/operadores');
      } else {
        console.error("Error al crear el operador:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear el operador:", error);
    }
  };
  

  const usuariosClientes = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
  );

  const usuariosOperador = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
  );

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Asignar Operadores" />
        <AtrasButton href="/dashboard/operadores" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="mb-4">
              <label
                htmlFor="clientes"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Seleccionar Cliente
              </label>
              <select
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                value={clienteSeleccionado}
                id="clientes"
                name="clientes"
                className="w-full rounded mt-2 border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
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
            <div className="mb-4">
              <label
                htmlFor="maquinas"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Seleccionar Máquina
              </label>
              <select
                onChange={(e) => setMaquinaSeleccionada(e.target.value)}
                value={maquinaSeleccionada}
                id="maquinas"
                name="maquinas"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Seleccionar</option>
                {maquinas.map((maquina) => (
                  <option key={maquina._id} value={maquina._id}>
                    {maquina.nombre} - {maquina.id_machine}
                  </option>
                ))}
              </select>
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
                Crear Operador
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}
