import React, { useState, useEffect } from "react";
import styled from "styled-components";
import enviargamesAMaquina from "@/controllers/enviargamessAMaquina";
import getSingleMachine from "@/controllers/getSingleMachine";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Maquina {
  _id: string;
  nombre: string;
  id_machine: string;
  descripcion: string;
  status: number;
  games: any[];
}

interface Game {
  id: number;
  name: string;
  category: string;
  provider_name: string;
  image: string;
}

interface GameCardProps {
  usuario: {
    games: Game[];
  };
}

const Container = styled.div`
  margin-bottom: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  margin-right: 600px;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CounterLabel = styled.p`
  margin-right: 10px;
`;

const Table = styled.table`
  width: 100%;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableHeaderCell = styled.th`
  padding: 10px;
`;

const TableRow = styled.tr`
  background-color: #ffffff;
`;

const TableCell = styled.td`
  width: 70px;
  height: 70px;
  padding: 0;
  border: 2px solid #ddd;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const SendButton = styled.button`
  margin-left: 0;
  margin-right: 100px;
  padding: 8px 16px;
  background-color: #1f9b2b;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  top: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const AssignMachines: React.FC<GameCardProps> = ({ usuario }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProvider, setSelectedProvider] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedGames, setSelectedGames] = useState<number[]>([]);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState<string>("");
  const [selectedMachineGames, setSelectedMachineGames] = useState<number[]>([]);

  useEffect(() => {
    async function fetchMaquinas() {
      try {
        const fetchedMaquinas = await getSingleMachine("", 10);
        setMaquinas(fetchedMaquinas);
      } catch (error) {
        console.error("Error al obtener Maquinas:", error);
      }
    }

    fetchMaquinas();
  }, []);

  useEffect(() => {
    console.log("Máquina seleccionada:", maquinaSeleccionada);
    
    async function fetchMachineGames() {
        if (!maquinaSeleccionada) return;
      
        try {
          const response = await fetch(`http://localhost:3000/api/maquinas/${maquinaSeleccionada}`);
          if (!response.ok) {
            throw new Error("Error al obtener los juegos de la máquina");
          }
          const { data } = await response.json();
      
          if (!data || !Array.isArray(data.games)) {
            console.error("No se encontraron juegos asociados a la máquina seleccionada");
            return;
          }
      
          setSelectedMachineGames(data.games.map((game) => game.id));
        } catch (error) {
          console.error("Error al obtener los juegos de la máquina:", error);
        }
      }
      
  
    fetchMachineGames();
  }, [maquinaSeleccionada]);
  

  useEffect(() => {
    if (selectAll) {
      setSelectedGames(usuario.games.map(game => game.id));
    } else {
      setSelectedGames([]);
    }
  }, [selectAll]);

  const uniqueCategories = [...new Set(usuario.games.map(games => games.category))];
  const uniqueProviders = [...new Set(usuario.games.map(games => games.provider_name))];

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    setSelectAll(true);
  };

  const handleDeselectAll = () => {
    setSelectAll(false);
  };

  const handleGameSelect = (game: Game) => {
    const isAlreadySelected = isGameSelected(game);
    if (isAlreadySelected) {
      // Si el juego ya estaba seleccionado, lo quitamos de las listas de juegos seleccionados
      setSelectedGames(selectedGames.filter(selectedGame => selectedGame.id !== game.id));
      setSelectedMachineGames(selectedMachineGames.filter(selectedGameId => selectedGameId !== game.id));
    } else {
      // Si el juego no estaba seleccionado, lo añadimos a las listas de juegos seleccionados
      setSelectedGames([...selectedGames, game]);
      setSelectedMachineGames([...selectedMachineGames, game.id]);
    }
  };

  const isGameSelected = (game: Game) => {
    return selectedGames.some(selectedGame => selectedGame.id === game.id) || 
           (selectedMachineGames && selectedMachineGames.some((maqGameId: number) => maqGameId === game.id));
  };
  
  const pageSize = 6;
  const indexOfLastGame = currentPage * pageSize;
  const indexOfFirstGame = indexOfLastGame - pageSize;
  const gamesFiltrados = usuario.games.filter(games => {
    return (
      (selectedCategory === "Todas" || games.category === selectedCategory) &&
      (selectedProvider === "Todos" || games.provider_name === selectedProvider) &&
      (games.name && games.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).slice(indexOfFirstGame, indexOfLastGame);

  const totalGamesCount = usuario.games.length;
  const selectedGamesIds = [...selectedGames, ...selectedMachineGames];
  const selectedGamesCount = selectedGamesIds.length;
  

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(usuario.games.length / pageSize); i++) {
    pageNumbers.push(i);
  }

  const handleRoomChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const salaId = e.target.value;
    setMaquinaSeleccionada(salaId);
  };

  const handleSubmit = async () => {
    if (!maquinaSeleccionada) {
      console.error("No se ha seleccionado ninguna máquina");
      toast.error("Por favor, selecciona una máquina");
      return;
    }

    if (selectedGames.length === 0) {
      console.error("No se han seleccionado juegos para enviar");
      toast.error("Por favor, selecciona al menos un juego");
      return;
    }

    try {
      console.log(`Enviando juegos a la máquina ${maquinaSeleccionada}:`, selectedGames);

      await enviargamesAMaquina(maquinaSeleccionada, selectedGames);

      console.log(`Juegos enviados a la máquina ${maquinaSeleccionada}`);
      toast.success("Juegos enviados exitosamente");
    } catch (error) {
      console.error(`Error al enviar juegos a la máquina ${maquinaSeleccionada}:`, error);
      toast.error(`Error al enviar juegos a la máquina ${maquinaSeleccionada}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <Container>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
      <FiltersContainer>
        <label htmlFor="machine">Selecciona una Máquina:</label>
        <select
          id="machine"
          value={maquinaSeleccionada}
          onChange={handleRoomChange}
        >
          <option value="">Selecciona una Máquina</option>
          {maquinas.map(maquina => (
            <option key={maquina._id} value={maquina._id}>
              {maquina.id_machine}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="category">Categoría:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Todas">Todas</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="provider">Proveedor:</label>
          <select
            id="provider"
            value={selectedProvider}
            onChange={handleProviderChange}
          >
            <option value="Todos">Todos</option>
            {uniqueProviders.map((provider, index) => (
              <option key={index} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>
      </FiltersContainer>
      <CounterContainer>
        <CounterLabel>Juegos Totales: {totalGamesCount}</CounterLabel>
        {/* <CounterLabel>Juegos Seleccionados: {selectedGamesCount}</CounterLabel> */}
      </CounterContainer>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={selectAll ? handleDeselectAll : handleSelectAll}
              />
            </TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Imagen</TableHeaderCell>
            <TableHeaderCell>Categoría</TableHeaderCell>
            <TableHeaderCell>Proveedor</TableHeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {gamesFiltrados.map(games => (
            <TableRow key={games.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={isGameSelected(games)}
                  onChange={() => handleGameSelect(games)}
                />
              </TableCell>
              <TableCell>{games.name}</TableCell>
              <TableCell>
                <Image src={games.image} alt={games.name} />
              </TableCell>
              <TableCell>{games.category}</TableCell>
              <TableCell>{games.provider_name}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <PaginationContainer>
        <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </PageButton>
        <PageButton onClick={handleNextPage} disabled={currentPage === pageNumbers.length}>
          Siguiente
        </PageButton>
      </PaginationContainer>
      <FiltersContainer>
        <SendButton onClick={handleSubmit}>Enviar games</SendButton>
      </FiltersContainer>
    </Container>
  );
};

export default AssignMachines;