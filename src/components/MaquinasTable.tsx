import React, { useMemo } from "react";
import { useTable } from "react-table";
import { FaPenToSquare } from "react-icons/fa6";
import Link from "next/link";
import DeleteButtonMachine from "@/components/DeleteButtonMaquinas";

interface MaquinaData {
  _id: string;
  id_machine: string;
  // games: number;  // Comentado porque no se usa en este ejemplo
  // descripcion: string;  // Comentado porque no se usa en este ejemplo
  status: number;
}

interface MaquinasTableProps {
  maquinas: MaquinaData[];
}

const MaquinasTable: React.FC<MaquinasTableProps> = ({ maquinas }) => {
  const columns = useMemo(
    () => [
      { Header: "ID Máquina", accessor: "id_machine", align: 'left' },
      { Header: "Estado", accessor: "status", align: 'left' },
      {
        Header: "Acciones",
        accessor: "_id",
        Cell: ({ value }) => (
          <div className="flex items-center space-x-3.5">
            <DeleteButtonMachine id={value} />
            <Link
              href={`/dashboard/maquinas/editar/${value}`}
              className="edit"
              title="Editar"
              style={{ fontSize: '20px' }}
            >
              <FaPenToSquare />
            </Link>
          </div>
        ),
        align: 'left'
      }
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

export default MaquinasTable;
