"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsuarios from "@/controllers/getUsers";

interface Usuario {
  _id: string;
  nombreCompleto: string;
}

const EditarSala: React.FC<{ sala: any }> = ({ sala }) => {
  const [newNombre, setNewNombre] = useState(sala.nombre);
  const [newStatus, setNewStatus] = useState(sala.status);
  const [newPais, setNewPais] = useState(sala.pais);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState(sala.operator);
  const [newClient, setNewClient] = useState<{ _id: string; nombreCompleto: string }>({ _id: sala.client, nombreCompleto: '' });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [id_machine, setid_machine] = useState<string[]>(sala.id_machine || []);
  const [machineCreationError, setMachineCreationError] = useState<string | null>(null);
  const [maquinasCreadas, setMaquinasCreadas] = useState<any[]>([]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const updatedSala = {
      newNombre,
      newPais,
      newStatus,
      newOperator: operadorSeleccionado,
      newClient: newClient._id,
      id_machine: [...maquinasCreadas.map((maquina) => maquina.data.id_machine), ...id_machine],
    };

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

  const handleCreateMachine = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/maquinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: sala._id, // Pasar el ID de la sala seleccionada
          client: newClient._id, // Pasar el ID del cliente seleccionado
        }),
      });
  
      if (response.status === 201) {
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        console.log("Máquina creada con éxito");
        setMaquinasCreadas((prevMaquinas) => [...prevMaquinas, responseData]);
        setMachineCreationError(null);
      } else {
        const responseData = await response.json();
        setMachineCreationError(responseData.error || "Error desconocido al crear la máquina");
      }
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
      setMachineCreationError("Error de red al crear la máquina");
    }
  };

  const handleDeleteMachine = (id: string) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta máquina?');
    if (isConfirmed) {
      // Realizar la eliminación de la máquina
      setMaquinasCreadas(prevMaquinas => prevMaquinas.filter(maquina => maquina.data.id_machine !== id));
      setid_machine(prevIds => prevIds.filter(machineId => machineId !== id));
    }
    // No es necesario un else aquí, porque si cancela, no hacemos cambios
  };

  const usuariosOperador = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
  );

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Editar Sala" />
        <AtrasButton href="/dashboard/salas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA SALA</h1>
            {/* Formulario de edición de sala */}
            <div className="mb-4">
              <label
                htmlFor="newNombre"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Nombre Sala
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
            <div className="mb-4 flex flex-row">
              <div className="flex-grow mr-4">
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
              <div className="flex-grow">
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
            {/* Otras campos de edición */}
            {/* ... */}
            <div className="mb-4 flex flex-row">
              {/* Otros elementos en la misma línea */}
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
                  const selectedClient = usuarios.find(user => user._id === e.target.value);
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
            {/* Botón de creación de máquina */}
            <h3 className="mb-4">ID MÁQUINAS</h3>
        
            <div className="mb-4">
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Máquinas asignadas
  </label>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    {id_machine.map((id, index) => (
      <a
        key={index}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta máquina?');
          if (isConfirmed) {
            setMaquinasCreadas(prevMaquinas => prevMaquinas.filter(maquina => maquina.data.id_machine !== id));
            setid_machine(prevIds => prevIds.filter(machineId => machineId !== id));
          }
        }}
        className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2 cursor-pointer transition-colors relative overflow-hidden"
        style={{
          transition: 'background-color 0.3s',
          // Aquí puedes agregar otros estilos personalizados si lo deseas
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }}
      >
        {id}
      </a>
    ))}
  </div>
</div>


            <div className="mt-6">
              <button
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                onClick={handleCreateMachine}
              >
                Crear máquina +
              </button>
              {maquinasCreadas.length > 0 && (
                <div className="mt-4">
                  <div className="flex mt-2">
                    {maquinasCreadas.map((maquina, index) => (
                      <button
                        key={index}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2"
                        onClick={() => {
                          // Lógica opcional al hacer clic en una máquina
                        }}
                      >
                        {maquina.data.id_machine}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {machineCreationError && (
                <div className="mt-4">
                  <p className="block text-sm font-medium text-red">
                    Error al crear la máquina: {machineCreationError}
                  </p>
                </div>
              )}
            </div>
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
    </DefaultLayout>
  );
};

export default EditarSala;
