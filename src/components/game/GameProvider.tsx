import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSocket } from '@/app/api/socket/socketContext';

const Proveedores: React.FC = () => {
  const [machineData, setMachineData] = useState<any>(null);
  const [games, setGames] = useState<Game[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const pathArray = window.location.pathname.split('/');
        const machineId = pathArray[pathArray.length - 1];
        const provider = pathArray[pathArray.length - 2]; 

        const response = await fetch(`/api/juegosApi/${provider}/${machineId}/`); // Ajusta la URL de la solicitud
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la máquina');
        }
        const data = await response.json();
        setMachineData(data.data);
        console.log('Información de la máquina:', data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMachineData();
    const handleGameStatusUpdated = (gameStatusChange: Game) => {
        console.log('Game status changed:', gameStatusChange);
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gameStatusChange.id ? { ...game, status: gameStatusChange.status } : game
          )
        );
      };
 

    socket?.on('gameStatusUpdated', handleGameStatusUpdated);

      return () => {
    
      socket?.off('gameStatusUpdated', handleGameStatusUpdated); 
      };
    

   
  }, [socket]);

  return (
    <>
      {machineData && (
        <div>
          <h2>{machineData.nombre}</h2>
          <p>{machineData.descripcion}</p>
          <ul>
            {machineData.games.map((group: any) => (
              <li key={group._id}>
                <h3>Grupo de Juegos</h3>
                <ul>
                  {group.games.map((game: any) => (
                    <li key={game._id}>
                      <h4>{game.name}</h4>
                      <p>Creador: {game.maker}</p>
                      <p>Categoría: {game.category}</p>
                      <Image src={game.image} alt={game.name} width={500} height={500}/>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Proveedores;