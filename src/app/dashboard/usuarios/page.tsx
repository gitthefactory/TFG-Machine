// "use client";

// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import DataTable from "@/components/UsuariosTable";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import React, { useEffect, useState } from "react";
// import getUsers from "@/controllers/getUsers"; // Importa la función para obtener usuarios
// import AddButton from "@/components/AddButton";

// interface UsuarioData {
//   _id: string; // Añade la propiedad id a UsuarioData
//   nombreCompleto: string;
//   email: string;
//   status: number;
//   acciones: JSX.Element; // Cambio de string a JSX.Element
// }

// const Usuarios: React.FC = () => {
//   const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const data = await getUsers("",5); // Llama a la función para obtener usuarios
//         // Añade un id único a cada usuario
//         const usuariosConIds = data.map((usuario: any, index: { toString: () => any; }) => ({
//           ...usuario,
//           id: index.toString(),
//         }));
//         setUsuarios(usuariosConIds);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchData();
//   }, []);

//   return (
//     <>
//       <DefaultLayout>
//         <Breadcrumb pageName="Usuarios" />
//         {/* Botón de agregar */}
//         <AddButton href="/dashboard/usuarios/crear" />

//         {loading ? <div>Loading...</div> : <DataTable usuarios={usuarios} />}
//       </DefaultLayout>
//     </>
//   );
// };

// export default Usuarios;
