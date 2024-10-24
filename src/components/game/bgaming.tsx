import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';
import { useSocket } from "@/app/api/socket/socketContext";
import Swal from 'sweetalert2';
import { signOut } from 'next-auth/react';
import Loader from "../common/Loader";
import Link from 'next/link';
import { useRouter } from "next/navigation";

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
  const [machineStatus, setMachineStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const swiperRef = useRef<any>(null);
  const [idMachineFromURL, setIdMachineFromURL] = useState<string | null>(null);
  const { socket } = useSocket();
  const [isMounted, setIsMounted] = useState(false);


  const router = useRouter();


  useEffect(() => {
    setIsMounted(true); // El componente está montado
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        if (!sessionData || sessionData.status !== 200) {
          console.error("Datos de sesión inválidos:", sessionData);
          setLoading(false);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const idMachine = params.get('idMachine');
        setIdMachineFromURL(idMachine);

        if (idMachine) {
          const machineResponse = await fetch(`/api/maquinas`);
          const machineData = await machineResponse.json();
          const machine = machineData.data.find((m: any) => m.id_machine === idMachine);

          if (machine) {
            setMachineStatus(machine.status);

            if (machine.status === 0) {
              setTimeout(async () => {
                const result = await Swal.fire({
                  title: 'ALERTA',
                  html: `<p><span class="bold-text" style="color: black;">SU MAQUINA HA SIDO DESHABILITADA :</span></p>`,
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: 'rgb(227, 17, 108)',
                  confirmButtonText: 'ACEPTAR',
                  customClass: {
                    title: 'custom-title',
                    htmlContainer: 'custom-html',
                  },
                });

                if (result.isConfirmed) {
                  await signOut({ callbackUrl: '/' });
                }
                setLoading(false);
              }, 1000);

              return;
            }
          } else {
            console.warn("No se encontró la máquina con el ID proporcionado.");
          }
        }

        const provider = 68;
        const response = await fetch(`/api/juegosApi/${idMachine}/${provider}`);
        const data = await response.json();

        if (data.data?.token) {
          setToken(data.data.token);
        } else {
          console.error("Token no disponible en la respuesta.");
          setLoading(false);
          return;
        }

        const globalGamesResponse = await fetch('/api/juegosApi');
        const globalGamesData = await globalGamesResponse.json();

        if (Array.isArray(globalGamesData.data)) {
          const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
          const activeBgamingGames = data.data.games.filter((game: any) => game.maker === 'bgaming' && game.status === 1);

          const finalBgamingGames = activeBgamingGames.filter(bgamingGame =>
            activeGlobalGames.some(globalGame => globalGame.id === bgamingGame.id)
          );

          setGames(finalBgamingGames);
        } else {
          console.error("Estructura de datos inesperada:", globalGamesData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de sesión:", error);
        setLoading(false);
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
    // Actualiza la URL con el juego seleccionado
    router.push(`?idMachine=${idMachineFromURL}&gameId=${game.id}`, undefined, { shallow: true });
  };
 const closeGameUrl = () => {
    if (isMounted) {
      setLoading(true);
      setTimeout(() => {
        setSelectedGame(null);
        // Restablecer la URL original sin recargar la página
        router.replace(`/games?idMachine=${idMachineFromURL}&provider=bgaming`, undefined, { shallow: true });
        setLoading(false);
      }, 2000);
    }
  };
  
  const filteredGames = games.filter(game => game.status === 1);

  return (
    <div className="belatra-container">
    {loading ? (
      <Loader isSidebarOpen={false} />
    ) : (
      <>
        <div className="navigation-buttons">
          <div className="swiper-button-prev swiper-button-prev-img" onClick={handlePrevButtonClick}></div>
          <div className="swiper-button-next swiper-button-next-img" onClick={handleNextButtonClick}></div>
        </div>
        <Swiper slidesPerView={1} spaceBetween={10} ref={swiperRef}>
          {[...Array(Math.ceil(filteredGames.length / 8))].map((_, pageIndex) => (
            <SwiperSlide key={pageIndex}>
              <div className="swiper-slide-content">
                {filteredGames.slice(pageIndex * 8, (pageIndex + 1) * 8).map((game) => (
                  <div key={game.id} className="col-3 col-md-3">
                    <Link href={`?idMachine=${idMachineFromURL}&provider=bgaming&gameId=${game.id}`} onClick={() => handleGameClick(game)} shallow>
                      <div className="btn-game">
                        <Image
                          src={game.image}
                          alt={game.name}
                          style={{ width: '100%' }}
                          width={500}
                          height={500}
                          priority
                        />
                        <div className="subtitle">
                          {game.name}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {selectedGame && token && (
          <GameUrl game={selectedGame} token={token} onClose={closeGameUrl} />
        )}
      </>
    )}
  </div>
);
};

export default Belatra;
