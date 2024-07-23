"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getUsuarios from "@/controllers/getUsers";
import DeleteButtonMachine from "@/components/Maquinas/DeleteButtonMaquinas";

interface Usuario {
  _id: string;
  nombreCompleto: string;
}

interface MaquinaData {
  _id: string;
  id_machine: string;
  status: number;
}

// interface MaquinasTableProps {
//   maquinas: MaquinaData[];
// }



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
  const [newCurrency, setNewCurrency] = useState(sala.currency);
  const [newAddress, setNewAddress] = useState(sala.address);
  const [newPhone, setNewPhone] = useState(sala.phone);
  const [newComuna, setNewComuna] = useState(sala.comuna);



  // Función para cargar los usuarios
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
  

// Función para manejar la creación de máquinas
const handleCreateMachine = async () => {
  try {
    const requestData = {
      room: sala._id,
      client: newClient._id,
    };

    console.log("Datos enviados en la solicitud POST:", requestData);

    const response = await fetch("/api/maquinas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.status === 201) {
      const responseData = await response.json();
      console.log("Máquina creada con éxito", responseData);

      setMaquinasCreadas(prevMaquinas => [...prevMaquinas, responseData]);
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

  // Función para manejar la presentación del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const updatedSala = {
      newNombre,
      newPais,
      newStatus,
      newOperator: operadorSeleccionado,
      newClient: newClient._id,
      id_machine: [...maquinasCreadas.map((maquina) => maquina.data.id_machine), ...id_machine],
      newCurrency,
      newAddress,
      newPhone,
      newComuna,
    };
  
    try {
      const response = await fetch(`/api/salas/${sala._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSala),
      });
       // Actualizar el usuario con las nuevas máquinas asignadas
       const updatedUser = {
        id_machine: [...maquinasCreadas.map((maquina) => maquina.data.id_machine), ...id_machine],
      };

      const updateUserResponse = await fetch(`/api/usuarios/${operadorSeleccionado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const updateUserResponses = await fetch(`/api/usuarios/${newClient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
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

  // Filtrar usuarios por tipo de operador
  const usuariosOperador = usuarios.filter(
    (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
  );

  const handleDeleteMachine = (idMachineToDelete) => {
    setMaquinasCreadas(prevMaquinas =>
      prevMaquinas.filter(maquina => maquina.data.id_machine!== idMachineToDelete)
    );
    setid_machine(prevIds =>
      prevIds.filter(id => id !== idMachineToDelete)
    );
  };
  

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Editar Sala" />
        <AtrasButton href="/dashboard/salas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA SALA</h1>
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
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                <label
                  htmlFor="pais"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  País
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
                  <option value={"República Dominicana"}>República Dominicana</option>
                  <option value={"Mexico"}>Mexico</option>
                  <option value={"Perú"}>Perú</option>
                </select>
              </div>
              <div className="w-full xl:w-1/3">
              <label
                  htmlFor="newComuna"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Comuna
                </label>
                <input
                onChange={(e) => setNewComuna(e.target.value)}
                value={newComuna}
                id="newComuna"
                name="newComuna"
                type="text"
                placeholder="Ingresa el nombre.."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
              </div>

              <div className="w-full xl:w-1/3">
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

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
              <label
                htmlFor="newAddress"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
               Dirección
              </label>
              <input
                onChange={(e) => setNewAddress(e.target.value)}
                value={newAddress}
                id="newAddress"
                name="newAddress"
                type="text"
                placeholder="Ingresa el nombre.."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>
            <div className="w-full xl:w-1/3">
              <label
                  htmlFor="newPhone"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Teléfono
                </label>
                <input
                onChange={(e) => setNewPhone(e.target.value)}
                value={newPhone}
                id="newPhone"
                name="newPhone"
                type="text"
                placeholder="Ingresa el nombre.."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
              </div>
              <div className="w-full xl:w-1/3">
              <label
                  htmlFor="currency"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Moneda
                </label>
                <select
                  onChange={(e) => setNewCurrency(e.target.value)}
                  value={newCurrency}
                  id="currency"
                  name="currency"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value={"CLP"}>CLP</option>
                  <option value={"PEN"}>PEN</option>
                  <option value={"MXN"}>MXN</option>
                  <option value={"RBL"}>RBL</option>
                  <option value={"USD"}>USD</option>
                  <option value={"DOP"}>DOP</option>
                </select>
              </div>
            </div>
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
            <h3 className="mb-4">CLIENTE ASOCIADO</h3>
            <div className="mb-4">
              <label
                htmlFor="client"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Seleccionar Cliente
              </label>
              <select
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    _id: e.target.value,
                  })
                }
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
            <h3 className="mb-4">ID MAQUINAS</h3>

<div className="mb-4">
  <label
    // htmlFor="id_machine"
    className="mb-3 block text-sm font-medium text-black dark:text-white"
  >
    Maquinas asignadas
  </label>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    {id_machine.map((id, index) => (
  <div key={index} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2">
  {id}
  <button
    onClick={() => handleDeleteMachine(id) }
    type="button"
    className="focus:outline-none"
  >
   <DeleteButtonMachine />
  </button>
</div>


    ))}
  </div>
</div>
<div className="mt-6">
  <button
    type="button"
    className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
    onClick={handleCreateMachine}
  >
    Crear máquina +
  </button>
  {maquinasCreadas.length > 0 && (
    <div className="mt-4">
      <div className="flex mt-2">
        {maquinasCreadas.map((maquina, index) => (
          <div key={index} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2">
            {maquina.data.id_machine}
            <DeleteButtonMachine
              onClick={() => handleDeleteMachine(maquina.data.id_machine)}
            />
          </div>
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
