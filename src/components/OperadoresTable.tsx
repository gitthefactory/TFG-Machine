import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import DataTable from 'react-data-table-component';

interface User {
  _id: string;
  nombreCompleto: string;
  typeProfile: {
    _id: string;
  };
  games: { provider: string }[];
  id_machine: string;
  cantidadMaquinas: number;
  status: number;
}

const OperadoresTable: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchUsuariosClientes = async () => {
      try {
        const usuarios = await getUsers();
        const usuariosClientesFiltrados = usuarios
          .filter(usuario => usuario.typeProfile._id === "660ebaa7b02ce973cad66552")
          .map(usuario => ({
            ...usuario,
            cantidadMaquinas: usuarios.filter(u => u.id_machine === usuario.id_machine).length,
          }));
        setUsuariosClientes(usuariosClientesFiltrados);
      } catch (error) {
        console.error(error);
        // Manejo de errores
      }
    };

    fetchUsuariosClientes();
  }, []);

  const handleStatusChange = (userId: string, newStatus: number) => {
    // Lógica para cambiar el estado
    console.log(`Cambiar estado de usuario ${userId} a ${newStatus}`);
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: User) => (
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
      name: 'ID',
      selector: (row: User) => row._id,
      sortable: true,
    },
    {
      name: 'Nombre Completo',
      selector: (row: User) => row.nombreCompleto,
      sortable: true,
    },
    {
      name: 'Cantidad de Máquinas',
      selector: (row: User) => row.cantidadMaquinas,
      sortable: true,
    },
  ];

  const filteredUsers = usuariosClientes.filter(user =>
    user.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Listado de Operadores
          </h2>
        </header>
        <div className="p-6.5">
          {/* Agrega el campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar operadores..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Renderiza la DataTable con los datos filtrados */}
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default OperadoresTable;
