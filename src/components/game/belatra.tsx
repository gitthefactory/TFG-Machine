import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';
import { useSocket } from "@/app/api/socket/socketContext";

interface Game {
  id: number;
  name: string;
  category: string;
  provider_name: string;
  image: string;
  status: number;
}

const Belatra: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [idMachine, setIdMachine] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        
        if (!sessionData || sessionData.status !== 200) {
          console.error("Datos de sesión inválidos:", sessionData);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const idMachineFromURL = params.get('idMachine');
        setIdMachine(idMachineFromURL);
        console.log("ID de máquina desde la URL:", idMachineFromURL);

        const provider = 29;
        const response = await fetch(`/api/juegosApi/${idMachineFromURL}/${provider}`);
        const data = await response.json();

        if (data.data?.token) {
          setToken(data.data.token);
        } else {
          console.error("Token no disponible en la respuesta.");
          return;
        }

        const globalGamesResponse = await fetch('/api/juegosApi');
        const globalGamesData = await globalGamesResponse.json();

        if (Array.isArray(globalGamesData.data)) {
          const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
          const activeBelatraGames = data.data.games.filter((game: any) => game.maker === 'belatra' && game.status === 1);

          const finalBelatraGames = activeBelatraGames.filter(belatraGame => 
            activeGlobalGames.some(globalGame => globalGame.id === belatraGame.id)
          );

          console.log('Juegos activos de Belatra:', finalBelatraGames);
          setGames(finalBelatraGames);
        } else {
          console.error("Estructura de datos inesperada:", globalGamesData);
        }
      } catch (error) {
        console.error("Error al obtener los datos de sesión:", error);
      }
    };

    fetchData();
    
    if (socket) {
      const handleGameStatusUpdated = (gameStatusChange: Game) => {
        console.log('Evento gameStatusUpdated recibido:', gameStatusChange);
        setGames(prevGames => {
          const updatedGames = prevGames.map(game =>
            game.id === gameStatusChange.id ? { ...game, status: gameStatusChange.status } : game
          );
          console.log('Juegos después de la actualización:', updatedGames);
          return updatedGames;
        });
      };
    
      socket.on('gameStatusUpdated', handleGameStatusUpdated);
    
      return () => {
        socket.off('gameStatusUpdated', handleGameStatusUpdated);
      };
    }
  }, [socket]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
  };
  
  const closeGameUrl = () => {
    setSelectedGame(null);
  };

  // Filtrar juegos que están activos
  const filteredGames = games.filter(game => game.status === 1);

  return (
    <div className="belatra-container">
      <Swiper slidesPerView={1} spaceBetween={10} ref={swiperRef}>
        {[...Array(Math.ceil(filteredGames.length / 8))].map((_, pageIndex) => (
          <SwiperSlide key={pageIndex}>
            <div className="swiper-slide-content">
              {filteredGames.slice(pageIndex * 8, (pageIndex + 1) * 8).map((game, index) => (
                <div key={index} className="col-3 col-md-3">
                  <div className="btn-game" onClick={() => handleGameClick(game)}>
                    <Image
                      src={game.image}
                      alt={game.name}
                      style={{ width: '100%' }}
                      width={500}
                      height={500}
                    />
                    <div className="subtitle">
                      {game.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedGame && token && (
        <GameUrl game={selectedGame} token={token} onClose={closeGameUrl} />
      )}
    </div>
  );
}

export default Belatra;
