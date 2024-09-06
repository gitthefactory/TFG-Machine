import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';
import { useSocket } from "@/app/api/socket/socketContext";  // Importa el contexto del socket

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
  const swiperRef = useRef<any>(null);
  const [idMachineFromURL, setIdMachineFromURL] = useState<string | null>(null);
  const { socket } = useSocket();  // Usa el contexto del socket

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        const params = new URLSearchParams(window.location.search);
        const idMachine = params.get('idMachine');
        setIdMachineFromURL(idMachine);

        if (sessionData.status === 200) {
          const provider = 68;
          const response = await fetch(`/api/juegosApi/${idMachine}/${provider}`);
          const data = await response.json();

          if (data.data && data.data.token) {
            setToken(data.data.token);
          } else {
            return;
          }

          const globalGamesResponse = await fetch('/api/juegosApi');
          const globalGamesData = await globalGamesResponse.json();

          if (globalGamesData.data && Array.isArray(globalGamesData.data)) {
            const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
            const activeBelatraGames = data.data.games.filter((game: any) => game.maker === 'bgaming' && game.status === 1);

            const finalBelatraGames = activeBelatraGames.filter(bgamingGame => 
              activeGlobalGames.some(globalGame => globalGame.id === bgamingGame.id)
            );

            setGames(finalBelatraGames);
          } else {
            console.error("Estructura de datos inesperada:", globalGamesData);
          }
        } else {
          console.error("Usuario no autenticado:", sessionData.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos de sesión:", error);
      }
    };

    fetchData();

    // Manejo de eventos de actualización de estado de los juegos vía socket
    if (socket) {
      const handleGameStatusUpdated = (gameStatusChange: Game) => {
        console.log('Evento gameStatusUpdated recibido:', gameStatusChange);
        setGames(prevGames => {
          const updatedGames = prevGames.map(game =>
            game.id === gameStatusChange.id ? { ...game, status: gameStatusChange.status } : game
          );
          return updatedGames;
        });
      };

      socket.on('gameStatusUpdated', handleGameStatusUpdated);

      return () => {
        socket.off('gameStatusUpdated', handleGameStatusUpdated);
      };
    }
  }, [socket]);

  const handlePrevButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

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
      <div className="navigation-buttons">
        <div className="swiper-button-prev swiper-button-prev-img" onClick={handlePrevButtonClick}></div>
        <div className="swiper-button-next swiper-button-next-img" onClick={handleNextButtonClick}></div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        ref={swiperRef}
        navigation={true}
      >
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
      {selectedGame && token && idMachineFromURL && (
        <GameUrl game={selectedGame} token={token} idMachine={idMachineFromURL} onClose={closeGameUrl} />
      )}
    </div>
  );
}

export default Belatra;
