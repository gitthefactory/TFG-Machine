"use client";
import React, { useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface EditarSalaProps {
  sala: any;
}

const EditarSala: React.FC<EditarSalaProps> = ({ sala }) => {
  const [newNombre, setNewNombre] = useState(sala.nombre);
  const [newCurrency, setNewCurrency] = useState(sala.currency);
  const [selectedMachines, setSelectedMachines] = useState<string | undefined>(undefined); // Estado inicial

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedSala = {
      newNombre,
      id_machine: selectedMachines ? [selectedMachines] : [], // Convertimos a array si hay máquina seleccionada
      newCurrency,
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

  const handleMachineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSelectedMachines(selectedOption === "" ? undefined : selectedOption); // Actualizamos el estado
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Transferencias" />
        <AtrasButton href="/dashboard/salas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA SALA</h1>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
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
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label
                  htmlFor="currency"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Moneda
                </label>
                <input
                  onChange={(e) => setNewCurrency(e.target.value)}
                  value={newCurrency}
                  id="currency"
                  name="currency"
                  type="text"
                  placeholder="Moneda"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <h1 className="mb-6">SELECCIONAR MAQUINA</h1>

            <div className="mb-4">
              <label
                htmlFor="id_machine"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Seleccionar Máquina <span className="text-red">*</span>
              </label>
              <select
                onChange={handleMachineChange}
                value={selectedMachines || ""} // Valor del select dependiendo del estado
                id="id_machine"
                name="id_machine"
                className="w-full rounded mt-2 border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                required
              >
                <option value="">Seleccionar</option> {/* Opción predeterminada */}
                {sala.id_machine &&
                  sala.id_machine.map((id: string, index: number) => (
                    <option key={index} value={id}>
                      {id}
                    </option>
                  ))}
              </select>
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
