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
}

const DataTable: React.FC = () => {
  const [usuariosClientes, setUsuariosClientes] = useState<User[]>([]);

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
      { Header: "ID", accessor: "_id" },
      { Header: "Nombre Completo", accessor: "nombreCompleto" },
      {
        Header: "Proveedor",
        accessor: "games",
        Cell: ({ value }) => (value.length > 0 ? "Sí" : "No"),
      },
      {
        Header: "ID de Máquina",
        accessor: "id_machine",
        Cell: ({ value }) => (value ? value : "Sin Máquina"),
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
    data: usuariosClientes || [], // Agregar verificación de seguridad para usuariosClientes
  });

  // Asegurarse de que usuariosClientes sea un array antes de usarlo
  if (!Array.isArray(usuariosClientes)) {
    return <div>No hay datos de usuarios disponibles.</div>;
  }

  return (
    <div className="mx-auto max-w-270">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm bg-white shadow-default dark:bg-boxdark">
          <div style={{ height: 400, width: "100%" }}>
            <table {...getTableProps()} style={{ borderSpacing: 0, width: '100%' }}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} style={{ padding: '8px', textAlign: 'left' }}>
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
                    <tr {...row.getRowProps()} style={{ backgroundColor: index % 2 === 0 ? '#f3f4f6' : 'transparent' }}>
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()} style={{ padding: '8px' }}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
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

export default DataTable;
