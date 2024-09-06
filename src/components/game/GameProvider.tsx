/* "use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSocket } from '@/app/api/socket/socketContext';

const GameProvider: React.FC = () => {
  const [machineData, setMachineData] = useState<any>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const fetchMachineData = async () => {
      try {
        const pathArray = window.location.pathname.split('/');
        const machineId = pathArray[pathArray.length - 1];
        const provider = pathArray[pathArray.length - 2];

        const response = await fetch(`/api/juegosApi/${provider}/${machineId}/`);
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

    socket.on('gameStatusUpdated', (updatedGame) => {
      setMachineData((prevMachineData) => {
        if (!prevMachineData) return prevMachineData;

        return {
          ...prevMachineData,
          games: prevMachineData.games.map((group: any) => ({
            ...group,
            games: group.games.map((game: any) =>
              game._id === updatedGame.id
                ? { ...game, status: updatedGame.status }
                : game
            )
          }))
        };
      });
    });

    return () => {
      socket.off('gameStatusUpdated');
    };
  }, [socket]);

  const filteredGames = machineData?.games.flatMap((group: any) =>
    group.games.filter((game: any) => game.status === 1) // Filtra los juegos disponibles
  ) || [];

  return (
    <>
      {machineData && (
        <div>
          <h2>{machineData.nombre}</h2>
          <p>{machineData.descripcion}</p>
          <ul>
            {filteredGames.map((game: any) => (
              <li key={game._id}>
                <h4>{game.name}</h4>
                <p>Creador: {game.maker}</p>
                <p>Categoría: {game.category}</p>
                <Image src={game.image} alt={game.name} width={500} height={500} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default GameProvider;
 */