// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import getSalas from "@/controllers/getRooms";
// import enviargamesAMaquina from "@/controllers/enviargamessAMaquina";

// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// interface Sala {
//   _id: string;
//   nombre: string;
//   maquinas?: Maquina[];
// }

// interface Maquina {
//   _id: string;
//   nombre: string;
//   id_machine: string;
//   descripcion: string;
//   status: number;
// }

// interface Game {
//   id: number;
//   name: string;
//   category: string;
//   provider_name: string;
//   image: string;
// }

// interface GameCardProps {
//   usuario: {
//     games: Game[];
//   };
// }

// const Container = styled.div`
//   margin-bottom: 20px;
// `;

// const FiltersContainer = styled.div`
// display: flex;
// justify-content: space-between;  
// margin-bottom: 5px;
// margin-right: 700px;


// `;

// const CounterContainer = styled.div`
//   display: flex;
//   align-items: center;
// `;

// const CounterLabel = styled.p`
//   margin-right: 10px;
// `;

// const Table = styled.table`
//   width: 100%;
//   // border-collapse: collapse;
// `;

// const TableHead = styled.thead`
//   background-color: #f2f2f2;
// `;

// const TableHeaderCell = styled.th`
//   padding: 10px;
// `;

// const TableRow = styled.tr`
//     background-color: #ffffff;
// `;

// const TableCell = styled.td`
//   width: 70px; 
//   height: 70px; 
//   padding: 0; 
//   border: 2px solid #ddd;
//   text-align: center;
// `;

// const Image = styled.img`
//   width: 100%; 
//   height: 100%; 
//   object-fit: contain; 
// `;

// const SendButton = styled.button`
//   margin-left: 0;
//   margin-right: 100px;
//   padding: 8px 16px;
//   background-color: #1f9b2b;
//   color: white;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s;
//   position: relative; /* Añadir posición relativa */
//   top: 10px; /* Ajustar la posición vertical */

//   &:hover {
//     background-color: #c82333;
//   }
// `;

// const PaginationContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

// const PageButton = styled.button`
//   margin: 0 5px;
//   padding: 8px 12px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;

//   &:hover {
//     background-color: #0056b3;
//   }

//   &[disabled] {
//     background-color: #ccc;
//     cursor: not-allowed;
//   }
// `;


// const AssignGames: React.FC<GameCardProps> = ({ usuario }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Todas");
//   const [selectedProvider, setSelectedProvider] = useState("Todos");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectAll, setSelectAll] = useState(false);
//   const [selectedGames, setSelectedGames] = useState<number[]>([]);
//   const [salas, setSalas] = useState<Sala[]>([]);
//   const [salaSeleccionada, setSalaSeleccionada] = useState<string>("");

//   useEffect(() => {
//     async function fetchSalas() {
//       try {
//         const fetchedSalas = await getSalas("", 10);
//         setSalas(fetchedSalas);
//       } catch (error) {
//         console.error("Error al obtener Salas:", error);
//       }
//     }

//     fetchSalas();
//   }, []);

//   useEffect(() => {
//     if (selectAll) {
//       setSelectedGames(usuario.games.map(game => game.id));
//     } else {
//       setSelectedGames([]);
//     }
//   }, [selectAll]);

//   const uniqueCategories = [...new Set(usuario.games.map(games => games.category))];
//   const uniqueProviders = [...new Set(usuario.games.map(games => games.provider_name))];

//   const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1); // Reset page to 1 when search term changes
//   };

//   const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedCategory(event.target.value);
//     setCurrentPage(1); // Reset page to 1 when category changes
//   };

//   const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedProvider(event.target.value);
//     setCurrentPage(1); // Reset page to 1 when provider changes
//   };

//   const handleSelectAll = () => {
//     setSelectAll(true);
//   };

//   const handleDeselectAll = () => {
//     setSelectAll(false);
//   };

//   const handleGameSelect = (game: Game) => {
//     if (selectedGames.some(selectedGame => selectedGame.id === game.id)) {
//       setSelectedGames(selectedGames.filter(selectedGame => selectedGame.id !== game.id));
//     } else {
//       setSelectedGames([...selectedGames, game]);
//     }
//   };

//   const pageSize = 6;
//   const indexOfLastGame = currentPage * pageSize;
//   const indexOfFirstGame = indexOfLastGame - pageSize;
//   const gamesFiltrados = usuario.games.filter(games => {
//     return (
//       (selectedCategory === "Todas" || games.category === selectedCategory) &&
//       (selectedProvider === "Todos" || games.provider_name === selectedProvider) &&
//       (games.name && games.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }).slice(indexOfFirstGame, indexOfLastGame);

//   const totalGamesCount = usuario.games.length;
//   const selectedGamesCount = selectedGames.length;

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(usuario.games.length / pageSize); i++) {
//     pageNumbers.push(i);
//   }

//   const handleRoomChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const salaId = e.target.value;
//     setSalaSeleccionada(salaId);
//   };

//   const handleSubmit = async () => {
//     if (!salaSeleccionada) {
//       toast.error("Por favor, selecciona una sala antes de enviar los juegos.");
//       return;
//     }
  
//     if (selectedGames.length === 0) {
//       console.error("No se han seleccionado juegos para enviar");
//       return;
//     }
  
//     try {
//       const maquinasResponse = await fetch(`api/maquinas?room=${salaSeleccionada}`);
//       if (!maquinasResponse.ok) {
//         throw new Error("Error al obtener las máquinas");
//       }
//       const { data: maquinas } = await maquinasResponse.json();
  
//       if (!maquinas || !Array.isArray(maquinas)) {
//         console.error("No se encontraron máquinas asociadas a la sala seleccionada");
//         return;
//       }
  
//       for (const maquina of maquinas) {
//         if (maquina.room === salaSeleccionada) {
//           try {
//             console.log(`Enviando juegos a la máquina ${maquina.nombre}:`, selectedGames);
//             await enviargamesAMaquina(maquina._id, selectedGames);
//             console.log(`Juegos enviados a la máquina ${maquina.nombre}`);
//             toast.success("Juegos enviados exitosamente");
//           } catch (error) {
//             console.error(`Error al enviar juegos a la máquina ${maquina.nombre}:`, error);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error al enviar los juegos:", error);
//     }
//   };
  
//   const handleNextPage = () => {
//     if (currentPage < pageNumbers.length) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <Container>
//        <ToastContainer
//         position="bottom-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <FiltersContainer>
//       <label htmlFor="room">Selecciona una Sala:</label>
//         <select
//           id="room"
//           value={salaSeleccionada}
//           onChange={handleRoomChange}
//         >
//           <option value="">Selecciona una Sala</option>
//           {salas.map(sala => (
//             <option key={sala._id} value={sala._id}>
//               {sala.nombre}
//             </option>
//           ))}
//         </select>
//         <div>
//           <label htmlFor="category">Categoría:</label>
//           <select
//             id="category"
//             value={selectedCategory}
//             onChange={handleCategoryChange}
//           >
//             <option value="Todas">Todas</option>
//             {uniqueCategories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="provider">Proveedor:</label>
//           <select
//             id="provider"
//             value={selectedProvider}
//             onChange={handleProviderChange}
//           >
//             <option value="Todos">Todos</option>
//             {uniqueProviders.map((provider, index) => (
//               <option key={index} value={provider}>
//                 {provider}
//               </option>
//             ))}
//           </select>
//         </div>
//       </FiltersContainer>
//       <CounterContainer>
//         <CounterLabel>games Totales: {totalGamesCount}</CounterLabel>
//         <CounterLabel>games Seleccionados: {selectedGamesCount}</CounterLabel>
//       </CounterContainer>
//       <Table>
//         <TableHead>
//           <tr>
//             <TableHeaderCell>
//               <input
//                 type="checkbox"
//                 checked={selectAll}
//                 onChange={selectAll ? handleDeselectAll : handleSelectAll}
//               />
//             </TableHeaderCell>
//             <TableHeaderCell>Nombre</TableHeaderCell>
//             <TableHeaderCell>Imagen</TableHeaderCell>
//             <TableHeaderCell>Categoría</TableHeaderCell>
//             <TableHeaderCell>Proveedor</TableHeaderCell>
//           </tr>
//         </TableHead>
//         <tbody>
//           {gamesFiltrados.map(games => (
//             <TableRow key={games.id}>
//              <TableCell>
//               <input
//                 type="checkbox"
//                 checked={selectedGames.some(selectedGame => selectedGame.id === games.id)}
//                 onChange={() => handleGameSelect(games)}
//               />
//             </TableCell>
//               <TableCell>{games.name}</TableCell>
//               <TableCell>
//                 <Image src={games.image} alt={games.name} />
//               </TableCell>
//               <TableCell>{games.category}</TableCell>
//               <TableCell>{games.provider_name}</TableCell>
//             </TableRow>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>
//         <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
//           Anterior
//         </PageButton>
//         <PageButton onClick={handleNextPage} disabled={currentPage === pageNumbers.length}>
//           Siguiente
//         </PageButton>
//       </PaginationContainer>
//       <FiltersContainer>
//         <SendButton onClick={handleSubmit}>Enviar games</SendButton>
//       </FiltersContainer>
//     </Container>
    
//   );
// };

// export default AssignGames;
