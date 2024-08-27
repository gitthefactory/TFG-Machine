import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { FaPen } from "react-icons/fa";
import Link from "next/link";
import DeleteButtonSalas from '@/components/Salas/DeleteButtonSalas';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { getSession } from "next-auth/react";
import getRooms from '@/controllers/getRooms'; // Asegúrate de que esta función esté bien importada

interface SalaData {
  _id: string;
  nombre: string;
  comuna: string;
  pais: string[];
  status: number;
  currency: string[];
  address: string;
  phone: number;
  client?: string;
  operator?: string[];
}

const ITEMS_PER_PAGE = 6;

const SalasTable: React.FC = () => {
  const [salas, setSalas] = useState<SalaData[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSalas, setFilteredSalas] = useState<SalaData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (session) {
          setUserRole(session.user?.typeProfile || '');

          // Obtener salas según el rol del usuario
          const salasData = await getRooms("some-query", 1); // Ajusta la query y currentPage según sea necesario
          setSalas(salasData);
          setFilteredSalas(salasData);
        }
      } catch (error) {
        console.error("Error al obtener datos de salas:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar salas basado en el término de búsqueda
    const filteredData = salas.filter((sala) =>
      sala.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSalas(filteredData);
  }, [searchTerm, salas]);

  const handleStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    // Encuentra la sala actual en el estado
    const salaToUpdate = salas.find(sala => sala._id === id);
    
    if (!salaToUpdate) {
      console.error('Sala no encontrada en el estado.');
      return;
    }

    try {
      console.log(`Actualizando sala con ID ${id} a nuevo estado ${newStatus}`);
      const response = await fetch(`/api/salas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newNombre: salaToUpdate.nombre,
          newStatus: newStatus,
          newPais: salaToUpdate.pais,
          newCiudad: salaToUpdate.comuna, // Cambia según el campo correcto
          newComuna: salaToUpdate.comuna, // Cambia según el campo correcto
          newClient: salaToUpdate.client,
          id_machine: salaToUpdate.operator, // Ajusta si es el campo correcto
          newOperator: salaToUpdate.operator, // Cambia según el campo correcto
          newCurrency: salaToUpdate.currency,
          newAddress: salaToUpdate.address,
          newPhone: salaToUpdate.phone,
        }),
      });

      const result = await response.json();
      console.log('Respuesta del backend:', result);

      if (response.ok) {
        console.log('Estado actualizado correctamente');
        // Actualizar el estado local del componente
        setSalas(prevSalas =>
          prevSalas.map(sala =>
            sala._id === id ? { ...sala, status: newStatus } : sala
          )
        );
        setFilteredSalas(prevFilteredSalas =>
          prevFilteredSalas.map(sala =>
            sala._id === id ? { ...sala, status: newStatus } : sala
          )
        );
      } else {
        console.error('Error al actualizar estado', result);
      }
    } catch (error) {
      console.error('Error al enviar solicitud de actualización', error);
    }
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: SalaData) => (
        <input
          type="checkbox"
          checked={row.status === 1}
          className="form-checkbox h-5 w-5 text-green-500"
          onChange={() => handleStatusChange(row._id, row.status)}
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
      selector: (row: SalaData) => row.pais.join(', '), // Une los elementos del array si es necesario
      sortable: true,
    },
    {
      name: 'Dirección',
      selector: (row: SalaData) => row.address,
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: (row: SalaData) => row.phone,
      sortable: true,
    },
    {
      name: 'Moneda',
      selector: (row: SalaData) => row.currency.join(', '), // Une los elementos del array si es necesario
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: SalaData) => (
        <div className="flex items-center space-x-3.5">
          <DeleteButtonSalas id={row._id} />
          <Link
            href={`/dashboard/salas/editar/${row._id}`}
            className="edit"
            title="Editar"
            style={{ fontSize: '20px' }}
          >
            <FaPen />
          </Link>
          <Link
            href={`/dashboard/salas/transferir/${row._id}`}
            className="transfer"
            title="Transferir"
            style={{ fontSize: '20px' }}
          >
            <FaMoneyBillTransfer />
          </Link>
        </div>
      ),
      sortable: true,
    }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Listado de Salas
          </h2>
          {userRole !== '660ebaa7b02ce973cad66552' && ( // Verifica si el rol no es 'Operador'
            <Link
              href="/dashboard/salas/crear"
              className="btn btn-primary"
            >
              Crear Sala
            </Link>
          )}
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
