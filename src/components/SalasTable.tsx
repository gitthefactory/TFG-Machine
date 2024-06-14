import React, { useEffect, useMemo, useState } from "react";
import getUsers from "@/controllers/getUsers";
import { useTable } from "react-table";
import { FaPenToSquare } from "react-icons/fa6";
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
  const [usuariosClientes, setUsuariosClientes] = useState<SalaData[]>([]);

  useEffect(() => {
    const fetchUsuariosClientes = async () => {
      try {
        const usuarios = await getUsers();
        const usuariosClientesFiltrados = usuarios.filter(
          (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
        );
        setUsuariosClientes(usuariosClientesFiltrados);
      } catch (error) {
        console.error(error);
        // Manejo de errores
      }
    };

    fetchUsuariosClientes();
  }, []);

  const columns = useMemo(
    () => [
      { Header: "Nombre Salas", accessor: "nombre", align: 'left' },
      { Header: "Pais", accessor: "pais", align: 'left' },
      { Header: "Comuna", accessor: "comuna", align: 'left' },
      { Header: "Estado", accessor: "status", align: 'left' },
      {
        Header: "Acciones",
        accessor: "_id",
        Cell: ({ value }) => (
          <Link href={`/dashboard/salas/editar/${value}`}>
            <FaPenToSquare />
          </Link>
        ),
        align: 'left' // Añadido align: 'left' para el encabezado "Acciones"
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: salas || [],
  });

  // Asegurarse de que salas sea un array antes de usarlo
  if (!Array.isArray(salas)) {
    return <div>No hay datos de salas disponibles.</div>;
  }

  return (
    <div>
      <table {...getTableProps()} style={{ borderSpacing: 0, width: '100%' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps()}
                  className={`border-b border-[#eee] px-4 py-2 bg-gray-200 dark:bg-gray-900 ${column.align === 'left' ? 'text-left' : 'text-center'}`}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{ backgroundColor: index % 2 === 0 ? '#D2D8D8' : 'transparent' }}
              >
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className="border-b border-[#eee] px-4 py-2 text-left"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SalasTable;
