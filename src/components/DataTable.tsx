import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import DataTable from 'react-data-table-component';
import DeleteButton from '@/components/DeleteButton'
import Link from "next/link";
import { FaPen } from "react-icons/fa";


interface User {
  _id: string;
  nombreCompleto: string;
  email: string;
  typeProfile: {
    _id: string;
  };
  games: { provider: string }[];
  id_machine: string;
}

const UserDataTable: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
  }, []);

  const handleStatusChange = (id: string, newStatus: number) => {
    setUsuariosClientes((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario._id === id ? { ...usuario, status: newStatus } : usuario
      )
    );
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
      name: 'ID',
      selector: (row: User) => row._id,
      sortable: true,
    },
    {
      name: 'Nombre Cliente',
      selector: (row: User) => row.nombreCompleto,
      sortable: true,
    },
    // {
    //   name: 'Maquina',
    //   selector: (row: User) => row.games.length > 0 ? "Sí" : "No",
    //   sortable: true,
    // },
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
