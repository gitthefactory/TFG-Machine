import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import DataTable from 'react-data-table-component';
import DeleteButton from '@/components/Clientes/DeleteButton'
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { useSocket } from "@/app/api/socket/socketContext";
import { FaMoneyBillTransfer } from "react-icons/fa6";

interface User {
  _id: string;
  nombreCompleto: string;
  email: string;
  typeProfile: {
    _id: string;
  };
  games: { provider: string }[];
  id_machine: string;
  status: number;
}

const UserDataTable: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {socket} = useSocket();


  useEffect(() => {
    const fetchUsuariosClientes = async () => {
      try {
        const usuarios = await getUsers();
        const usuariosClientesFiltrados = usuarios.filter(
          (usuario: User) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
        );
        setUsuariosClientes(usuariosClientesFiltrados);
      } catch (error) {
        console.error(error);
        // Error handling logic
      }
    };

    fetchUsuariosClientes();

    if (socket) {
      socket.on("")
    }
  }, [socket]);

  const handleStatusChange = async (id: string, newStatus: number) => {
    try {
      console.log(`Changing status of ${id} to ${newStatus}`);

      // Realiza una solicitud PUT para actualizar el estado del usuario
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el estado del usuario: ${response.statusText}`);
      }

      const result = await response.json();

      // Actualiza el estado local
      setUsuariosClientes((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario._id === id ? { ...usuario, status: newStatus } : usuario
        )
      );

      console.log(result.message);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const filteredUsuarios = usuariosClientes.filter(
    (usuario) =>
      usuario.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Estado',
      cell: (row: User) => (
        <input
          type="checkbox"
          checked={row.status === 1}
          className="form-checkbox h-5 w-5 text-green-500"

          onChange={() => handleStatusChange(row._id, row.status === 1 ? 0 : 1)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Telefono 1',
      selector: (row: User) => row.contactNumber1,
      sortable: true,
    },
    {
      name: 'Balance',
      selector: (row: User) => row.balance,
      sortable: true,
    },
    {
      name: 'Nombre Cliente',
      selector: (row: User) => row.nombreCompleto,
      sortable: true,
    },
 
    {
      name: 'Correo Electrónico',
      selector: (row: User) => row.email,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: User) => (
        <div className="flex items-center space-x-3.5">
          <DeleteButton id={row._id} />
          <Link
            href={`/dashboard/usuarios/editar/${row._id}`}
            className="edit"
            title="Editar"
            style={{ fontSize: '20px' }}
          >
            <FaPen />
          </Link>
          <Link
            href={`/dashboard/usuarios/abonar/${row._id}`}
            className="balance"
            title="DepositarBalance"
            style={{ fontSize: '20px' }}
          >
            <FaMoneyBillTransfer />
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
            Listado de Clientes
          </h2>
        </header>
        <div className="p-6.5">
          {/* Agrega el campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar Cliente..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Renderiza la DataTable con los datos filtrados */}
          <DataTable
            columns={columns}
            data={filteredUsuarios}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default UserDataTable;
