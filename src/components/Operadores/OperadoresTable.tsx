import { useSocket } from "@/app/api/socket/socketContext";
import React, { useEffect, useState } from "react";
import getUsers from "@/controllers/getUsers";
import DataTable from 'react-data-table-component';
import Link from "next/link";
import DeleteButtonOperadores from '@/components/Operadores/DeleteButtonOperadores';
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
  cantidadMaquinas: number;
  status: number;
}

const OperadoresTable: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar el loading
  const { socket } = useSocket();

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
        setLoading(false); // Deja de cargar cuando los datos están listos
      } catch (error) {
        console.error(error);
        setLoading(false); // Asegúrate de desactivar el loading en caso de error
      }
    };

    fetchUsuariosClientes();

    if (socket) {
      const handleUpdateSala = async (updatedUser: User) => {
        console.log('Operador actualizado recibido:', updatedUser);
        await fetchUsuariosClientes(); // Actualiza la lista de usuarios
      };

      socket.on('SalaUpdated', handleUpdateSala);

      return () => {
        socket.off('SalaUpdated', handleUpdateSala);
      };
    }
  }, [socket]);

  const handleStatusChange = async (userId: string, newStatus: number) => {
    try {
      setLoading(true); // Muestra el loading antes de realizar la actualización

      const response = await fetch(`/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      if (socket) {
        socket.emit('UpdateSala', { _id: userId, status: newStatus });
      }

      // Actualizar el estado localmente para reflejar el cambio
      setUsuariosClientes(prevState =>
        prevState.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      setLoading(false); // Deja de cargar después de realizar la actualización
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setLoading(false); // Asegúrate de desactivar el loading en caso de error
    }
  const handleStatusChange = async (userId: string, newStatus: number) => {
    try {
      const response = await fetch(`/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      // Actualizar el estado localmente para reflejar el cambio
      setUsuariosClientes(prevState =>
        prevState.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: User) => (
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-green-500"
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
      name: 'Correo Electrónico',
      selector: (row: User) => row.email,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: User) => (
        <div className="flex items-center space-x-3.5">
          <DeleteButtonOperadores id={row._id} />
          <Link href={`/dashboard/operadores/editar/${row._id}`}
                className="edit"
                title="Editar"
                style={{ fontSize: '20px' }}>
            <FaPen />
          </Link>
        </div>
      ),
      sortable: true,
    },
  ];

  const filteredUsers = Array.isArray(usuariosClientes) ? usuariosClientes.filter(user => 
    user.nombreCompleto && user.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Listado de Operadores
          </h2>
        </header>
        <div className="p-6.5">
          <input
            type="text"
            placeholder="Buscar operadores..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <p>Cargando...</p> // Muestra un mensaje de loading
          ) : (
            <DataTable
              columns={columns}
              data={Array.isArray(filteredUsers) ? filteredUsers : []}
              pagination
              highlightOnHover
              responsive
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OperadoresTable;
