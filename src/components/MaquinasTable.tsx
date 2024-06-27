
import DeleteButtonMachine from "@/components/DeleteButtonMaquinas";
import React, { useState } from "react";
import DataTable from 'react-data-table-component';
import { FaPen } from "react-icons/fa";
import Link from "next/link";
// import DeleteButtonMachine from "@/components/DeleteButtonMachine";

interface MaquinaData {
  _id: string;
  id_machine: string;
  status: number;
}

interface MaquinasTableProps {
  maquinas: MaquinaData[];
}

const MaquinasTable: React.FC<MaquinasTableProps> = ({ maquinas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredMaquinas = maquinas.filter((maquina) => {
    return (
      maquina.id_machine.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleStatusChange = (id: string, newStatus: number) => {
    // Implementa la lógica para cambiar el estado
    console.log(`Cambiando estado de máquina ${id} a ${newStatus}`);
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: MaquinaData) => (
        <input
          type="checkbox"
          checked={row.status === 1}
          className="form-checkbox h-5 w-5 text-green-500"
          onChange={() => handleStatusChange(row._id, row.status === 1 ? 0 : 1)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'ID Máquina',
      selector: (row: MaquinaData) => row.id_machine,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: MaquinaData) => (
        <div className="flex items-center space-x-3.5">
          <DeleteButtonMachine id={row._id} />
          <Link
            href={`/dashboard/maquinas/editar/${row._id}`}
            className="edit"
            title="Editar"
            style={{ fontSize: '20px' }}
          >
            <FaPen />
          </Link>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="mx-auto max-w-270">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                <h2 className="font-medium text-black dark:text-white">
            Listado de Máquinas
          </h2>
        </header>
        <div className="p-6">
          {/* Agrega el campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar máquinas..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Renderiza la DataTable con los datos filtrados */}
          <DataTable
            columns={columns}
            data={filteredMaquinas}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default MaquinasTable;
