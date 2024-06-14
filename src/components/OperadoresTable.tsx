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
      { Header: "ID", accessor: "_id" },
      { Header: "Nombre Completo", accessor: "nombreCompleto" },
      {
        Header: "Cantidad de Máquinas",
        accessor: "cantidadMaquinas",
      },
      { Header: "Estado", accessor: "status" },
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
    <div>
      <div style={{ height: 400, width: "100%" }}>
        <table
          {...getTableProps()}
          style={{
            borderSpacing: 0,
            width: "100%",
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                style={{ background: "aliceblue" }}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={{ backgroundColor: index % 2 === 0 ? '#D2D8D8' : 'transparent', borderBottom: '1px solid black' }}>

                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {cell.render("Cell")}
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
  );
};

export default OperadoresTable;
