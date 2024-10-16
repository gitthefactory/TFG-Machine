import DeleteButtonMachine from "@/components/Maquinas/DeleteButtonMaquinas";
import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { FaPen } from "react-icons/fa";
import Link from "next/link";
import { FaMoneyBill } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
interface MaquinaData {
  _id: string;
  id_machine: string;
  status: number;
  balance?: number;
}

interface TransactionData {
  _id: string;
  user: string; // Cambiado de `id_machine` a `user`
  balance: number;
}

interface MaquinasTableProps {
  maquinas: MaquinaData[];
}

const MaquinasTable: React.FC<MaquinasTableProps> = ({ maquinas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoaded, setDataLoaded] = useState(true);
  const [transferData, setTransferData] = useState<TransactionData[]>([]);

  useEffect(() => {
    fetch('/api/v1')
      .then(response => response.json())
      .then(data => {
        // console.log('todos los balances:', data);
  
        let transferDataArray = [];
        console.log('Data:',data)
        if (Array.isArray(data)) {
          transferDataArray = data;
        
        } else if (data && Array.isArray(data.data)) {
          transferDataArray = data.data;
        } else {
          throw new Error('Los datos recibidos de la API no están en el formato esperado.');
        }
  
        setTransferData(transferDataArray);
        setDataLoaded(true);
  
      })
      .catch(error => {
        console.error('Error fetching transfer data:', error);
      });
  }, []);
  
  const getLatestBalanceByIdMachine = (id_machine: string): number | undefined => {
    const transactions = transferData.filter(item => item.user === id_machine); // Cambiado `id_machine` a `user`
    if (transactions.length > 0) {
      return transactions[transactions.length - 1].balance;
    }
    return undefined;
  };

  const filteredMaquinas = maquinas.filter((maquina) =>
    maquina.id_machine.toLowerCase().includes(searchTerm.toLowerCase())
  ).map((maquina) => ({
    ...maquina,
    balance: getLatestBalanceByIdMachine(maquina.id_machine)
  }));

  const handleStatusChange = async (id_machine: string, newStatus: number) => {
    try {
      const response = await fetch(`/api/maquinas/${id_machine}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la máquina');
      }
  
      // Opcional: actualiza el estado en el estado local si es necesario
      const data = await response.json();
      console.log('Respuesta de la actualización:', data);
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };

  const getTransferIdByMachineId = (id_machine: string): string | undefined => {
    // console.log(`Buscando transfer para id_machine: ${id_machine}`);
    const transfer = transferData.find(item => item.user === id_machine);
    // console.log('Transfer encontrado:', transfer);
    return transfer ? transfer.user : undefined;
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
      selector: (row: MaquinaData) => row.balance ? row.balance.toFixed(2) : 'No disponible',
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: MaquinaData) => (
        <div className="flex items-center space-x-3.5">
            <Link
            href={`/dashboard/salas/transferir/${getTransferIdByMachineId(row.id_machine)}`}
            className="transfer"
            title="TransferirCREDIT"
            style={{ fontSize: '20px', color: 'green'}}
          >
            <FaMoneyBillTransfer />
          </Link>
          <Link
            href={`/dashboard/maquinas/transferir/${getTransferIdByMachineId(row.id_machine)}`}
            className="transfer"
            title="TransferirDEBIT"
            style={{ fontSize: '20px',color: 'red' }}
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
          <DeleteButtonMachine id={row._id} />
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
          <input
            type="text"
            placeholder="Buscar máquinas..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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



// ahora credit funciona 