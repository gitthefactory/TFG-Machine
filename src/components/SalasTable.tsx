import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteButtonRoom from "@/components/DeleteButtonSalas";
import Link from "next/link";
import { FaPenToSquare } from "react-icons/fa6";


interface SalaData {
  _id: string;
  nombre: string;
  comuna: string;
  pais: string;
  status: number;
  acciones: JSX.Element;
}

interface SalasTableProps {
  salas: SalaData[];
}

const SalasTable: React.FC<SalasTableProps> = ({ salas }) => {
  // Agregar un id único a cada fila si no tiene uno
  const rowsWithIds = salas.map((sala, index) => ({
    ...sala,
    id: sala._id || index.toString(), // Si la sala no tiene _id, se usa el índice como id
  }));

  const renderAcciones = (sala: SalaData) => (
    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
      <div className="flex items-center space-x-3.5">
       <DeleteButtonRoom id={sala._id} />
        <Link
          className="edit"
          href={`/dashboard/salas/editar/${sala._id}`}
          title="Edit"
          style={{ fontSize: '20px' }}
        >
      <FaPenToSquare />
        </Link>
      </div>
    </td>
  );

  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre Salas", flex: 1 },
    { field: "pais", headerName: "Pais", flex: 1 },
    { field: "comuna", headerName: "Comuna", flex: 1 },
    { field: "status", headerName: "Estado", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => renderAcciones(params.row as SalaData),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rowsWithIds}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        // checkboxSelection
      />
    </div>
  );
};

export default SalasTable;
