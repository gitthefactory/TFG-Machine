import DeleteButtonMachine from "@/components/Maquinas/DeleteButtonMaquinas";
import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { FaPen } from "react-icons/fa";
import Link from "next/link";

import { FaMoneyBill } from "react-icons/fa6";

interface MaquinaData {
  _id: string;
  id_machine: string;
  status: number;
  balance?: number; 
}

interface TransferData {
  _id: string;
  id_machine: string;
  balance: number;
}

interface MaquinasTableProps {
  maquinas: MaquinaData[];
}

const MaquinasTable: React.FC<MaquinasTableProps> = ({ maquinas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para verificar si los datos de transfer se cargaron
  const [transferData, setTransferData] = useState<TransferData[]>([]); // Estado para almacenar los datos de transferencia

  useEffect(() => {
    // Llamar a la API para obtener los datos de transferencia
    fetch('/api/transfer')
      .then(response => response.json())
      .then(data => {
        // Aseguramos que data sea un array de TransferData
        if (Array.isArray(data)) {
          setTransferData(data); // Asignamos directamente si los datos son un array
        } else if (data && Array.isArray(data.data)) {
          setTransferData(data.data); // Si los datos están encapsulados en un objeto con .data
        } else {
          throw new Error('Los datos recibidos de la API no están en el formato esperado.');
        }
        setDataLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching transfer data:', error);
      });
  }, []);
  

  // Función para obtener el _id de transferencia según id_machine
  const getTransferIdByMachineId = (id_machine: string): string | undefined => {
    const transfer = transferData.find(item => item.id_machine === id_machine);
    return transfer ? transfer._id : undefined;
  };

  // Función para obtener el balance según id_machine
  const getBalanceByIdMachine = (id_machine: string): number | undefined => {
    const transfer = transferData.find(item => item.id_machine === id_machine);
    return transfer ? transfer.balance : undefined;
  };

  const filteredMaquinas = maquinas.filter((maquina) =>
    maquina.id_machine.toLowerCase().includes(searchTerm.toLowerCase())
  ).map((maquina) => ({
    ...maquina,
    balance: getBalanceByIdMachine(maquina.id_machine) // Agregar el balance desde transferData
  }));

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
      name: 'Balance',
      selector: (row: MaquinaData) => row.balance ? row.balance.toFixed(2) : 'No disponible', // Mostrar el balance si está disponible
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: MaquinaData) => (
        <div className="flex items-center space-x-3.5">
          <DeleteButtonMachine id={row._id} />
          <Link
            href={`/dashboard/maquinas/transferir/${getTransferIdByMachineId(row.id_machine)}`}
            className="transfer"
            title="Transferir"
            style={{ fontSize: '20px' }}
          >
            <FaMoneyBill />
          </Link>
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
