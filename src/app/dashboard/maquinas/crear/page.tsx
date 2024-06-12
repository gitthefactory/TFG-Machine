"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import getSalas from "@/controllers/getRooms";
import getUsuarios from "@/controllers/getUsers";
import AtrasButton from "@/components/AtrasButton";

interface Usuario {
  _id: string;
  nombreCompleto: string;
  typeProfile: {
    _id: string;
  };
}

interface Cliente {
  _id: string;
  user: string;
}

interface Sala {
  _id: string;
  nombre: string;
}

export default function CrearMaquinas() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [status, setStatus] = useState("Seleccionar");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  const [salas, setSalas] = useState<Sala[]>([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState("");

  const [pais, setPais] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");

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

  // GET SALAS
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

  // Función para manejar cambios en la selección de sala
  const handleRoomChange = (value: string) => {
    setSalaSeleccionada(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Crear un objeto con los datos de la nueva máquina
      const newMaquina = {
        nombre,
        descripcion,
        status,
        client: clienteSeleccionado,
        room: salaSeleccionada !== "" ? salaSeleccionada : undefined,
        pais,
        comuna,
        direccion,
      };

      // Realizar una solicitud POST al endpoint de creación de máquinas
      const response = await fetch("/api/maquinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMaquina),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      // Asegúrate de que la respuesta contiene el id_machine correcto
      if (response.status === 201 && responseData._id) {
        const { _id } = responseData;
        console.log("ID Machine:", _id);

        // Realizar una solicitud PUT para actualizar el usuario cliente seleccionado
        const updateResponse = await fetch(`/api/usuarios/${clienteSeleccionado}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_machine: [_id] }), // Enviar el ID de la máquina como array
        });

        if (updateResponse.ok) {
          console.log("Usuario actualizado con éxito");
          // Redireccionar a la página de máquinas
          if (typeof window !== "undefined") {
            window.location.href = "/dashboard/maquinas";
          }
        } else {
          console.error("Error al actualizar el usuario");
        }
      } else {
        console.error("Error al crear la máquina:", responseData);
      }
    } catch (error) {
      console.error("Error en el proceso de creación o actualización:", error);
    }
  };

  // Filtrar usuarios por tipo de perfil cliente
  const usuariosClientes = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
  );

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Crear Máquinas" />
          <AtrasButton href="/dashboard/maquinas" />
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
                  <option value="">Seleccionar</option>
                  {salas.map((sala: Sala) => (
                    <option key={sala._id} value={sala._id}>
                      {sala.nombre}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-red">*Solo si tiene sala</p>
              </div>

              {/* País */}
              <div className="mb-4">
                <label
                  htmlFor="pais"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  País
                </label>
                <input
                  onChange={(e) => setPais(e.target.value)}
                  value={pais}
                  id="pais"
                  name="pais"
                  type="text"
                  placeholder="Ingrese el país.."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Comuna */}
              <div className="mb-4">
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
                  placeholder="Ingrese la comuna."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Dirección */}
              <div className="mb-4">
                <label
                  htmlFor="direccion"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Dirección
                </label>
                <input
                  onChange={(e) => setDireccion(e.target.value)}
                  value={direccion}
                  id="direccion"
                  name="direccion"
                  type="text"
                  placeholder="Ingrese la dirección."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Nombre */}
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Nombre
                </label>
                <input
                  onChange={(e) => setNombre(e.target.value)}
                  value={nombre}
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ingrese el nombre."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <label
                  htmlFor="descripcion"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Descripción
                </label>
                <textarea
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ingrese la descripción."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Estado
                </label>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  id="status"
                  name="status"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="Seleccionar">Seleccionar</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>

              <button
                className="mt-5 w-full rounded bg-primary p-3 font-medium text-gray"
                type="submit"
              >
                Crear máquina
              </button>
            </form>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
