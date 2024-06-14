import React, { useEffect, useMemo, useState } from "react";
import getUsers from "@/controllers/getUsers";
import { useTable } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";

interface MaquinaData {
  _id: string;
  id_machine: string;
  nombre: string;
  descripcion: string;
  status: number;
}

interface MaquinasTableProps {
  maquinas: MaquinaData[];
}

const MaquinasTable: React.FC<MaquinasTableProps> = ({ maquinas }) => {
  const columns = useMemo(
    () => [
      { Header: "ID Máquina", accessor: "id_machine", align: 'left' },
      { Header: "Nombre", accessor: "nombre", align: 'left' },
      { Header: "Descripción", accessor: "descripcion", align: 'left' },
      { Header: "Estado", accessor: "status", align: 'left' },
      {
        Header: "Acciones",
        accessor: "_id",
        Cell: ({ value }) => (
          <Link href={`/dashboard/maquinas/editar/${value}`}>
            <FaEdit />
          </Link>
        ),
        align: 'left'
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
    data: maquinas || [],
  });

  if (!Array.isArray(maquinas)) {
    return <div>No hay datos de máquinas disponibles.</div>;
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

export default MaquinasTable;

