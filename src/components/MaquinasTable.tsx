import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteButtonMachine from "@/components/DeleteButtonMaquinas";
import Link from "next/link";
import { FaPenToSquare } from "react-icons/fa6";

interface MaquinaData {
  _id: string;
  id_machine: string;
  nombre: string;
  descripcion: string;
  status: number;
  acciones: JSX.Element;
  games: any[];
  direccion: string;
}

interface MaquinasTableProps {
  maquinas: MaquinaData[];
}

const MaquinasTable: React.FC<MaquinasTableProps> = ({ maquinas }) => {
  // Agregar un id único a cada fila si no tiene uno
  const rowsWithIds = maquinas.map((maquina, index) => ({
    ...maquina,
    id: maquina._id || index.toString(), // Si la maquina no tiene _id, se usa el índice como id
  }));

  const renderAcciones = (maquina: MaquinaData) => (
    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
      <div className="flex items-center space-x-3.5">
        <DeleteButtonMachine id={maquina._id} />
        <Link
          href={`/dashboard/maquinas/editar/${maquina._id}`}
          className="edit"
          title="Editar"
          style={{ fontSize: '20px' }}
        >
          <FaPenToSquare />
        </Link>
      </div>
    </td>
  );

  const renderGamesCount = (maquina: MaquinaData) => (
    <td className="">
      {maquina.games.length}
    </td>
  );
  
  

  const columns: GridColDef[] = [
    { field: 'id_machine', headerName: 'ID', flex: 1 },
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
    { field: 'status', headerName: 'Estado', flex: 1 },
    { field: 'games', headerName: 'Cantidad de Juegos', flex: 1,
      renderCell: (params) => renderGamesCount(params.row as MaquinaData)},
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => renderAcciones(params.row as MaquinaData),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rowsWithIds}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default MaquinasTable;
