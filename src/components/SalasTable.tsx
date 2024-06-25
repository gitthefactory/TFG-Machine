import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { FaPen } from "react-icons/fa";
import Link from "next/link";

interface SalaData {
  _id: string;
  nombre: string;
  comuna: string;
  pais: string;
  status: number;
}

interface SalasTableProps {
  salas: SalaData[];
}

const SalasTable: React.FC<SalasTableProps> = ({ salas }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSalas, setFilteredSalas] = useState<SalaData[]>(salas);

  useEffect(() => {
    setFilteredSalas(salas);
  }, [salas]);

  const handleStatusChange = (id: string, newStatus: number) => {
    // Aquí deberías implementar la lógica para cambiar el estado de la sala (row) con el ID proporcionado.
    // No está claro cómo gestionar el estado de `salas` en tu implementación actual.
    console.log(`Cambiar estado de ${id} a ${newStatus}`);
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: SalaData) => (
        <input
          type="checkbox"
          checked={row.status === 1}
          onChange={() => handleStatusChange(row._id, row.status === 1 ? 0 : 1)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Nombre Salas',
      selector: (row: SalaData) => row.nombre,
      sortable: true,
    },
    {
      name: 'Pais',
      selector: (row: SalaData) => row.pais,
      sortable: true,
    },
    {
      name: 'Comuna',
      selector: (row: SalaData) => row.comuna,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: SalaData) => (
      
        <Link href={`/dashboard/salas/editar/${row._id}`}
            className="edit"
            title="Editar"
            style={{ fontSize: '20px' }}
          >
            <FaPen />
          </Link>
      ),
      sortable: true,
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filteredData = salas.filter((sala) =>
      sala.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredSalas(filteredData);
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Listado de Salas
          </h2>
        </header>
        <div className="p-6">
          <input
            type="text"
            placeholder="Buscar salas..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={handleSearch}
          />
          <DataTable
            columns={columns}
            data={filteredSalas}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default SalasTable;
