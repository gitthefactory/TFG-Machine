import React, { useEffect, useMemo, useState } from "react";
import getUsers from "@/controllers/getUsers";
import { useTable } from "react-table";

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

  useEffect(() => {
    const fetchUsuariosClientes = async () => {
      try {
        const usuarios = await getUsers();
        const usuariosClientesFiltrados = usuarios
          .filter(
            (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66552"
          )
          .map((usuario) => ({
            ...usuario,
            cantidadMaquinas: usuarios.filter(
              (u) => u.id_machine === usuario.id_machine
            ).length,
          }));
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
      { Header: "ID", accessor: "_id",  align: 'left'},
      { Header: "Nombre Completo", accessor: "nombreCompleto",  align: 'left' },
      {
        Header: "Cantidad de Máquinas",  align: 'left',
        accessor: "cantidadMaquinas",
      },
      { Header: "Estado", accessor: "status",  align: 'left' },
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
    data: usuariosClientes || [],
  });

  if (!Array.isArray(usuariosClientes)) {
    return <div>No hay datos de usuarios disponibles.</div>;
  }

  return (
    <div className="mx-auto max-w-270">
    <div className="flex flex-col gap-9">
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                style={{ backgroundColor: index % 2 === 0 ? '#E8EDED' : 'transparent' }}
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
    </div>
    </div>
    </div>
  );
};

export default OperadoresTable;
