import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { signOut } from 'next-auth/react';
import { useSocket } from "@/app/api/socket/socketContext";
import Loader from "@/components/common/Loader";
import { useSearchParams } from "next/navigation";

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
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef<any>(null);
  const { socket } = useSocket();
  const searchParams = useSearchParams();
  const idMachine = searchParams.get("idMachine");
  const provider = searchParams.get("provider") || "29"; // Valor por defecto

  useEffect(() => {
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const sessionData = await getSessionData();
        if (!sessionData || sessionData.status !== 200) {
          console.error("Datos de sesión inválidos:", sessionData);
          return;
        }

        // Asegúrate de que idMachine esté definido antes de hacer la solicitud
        if (idMachine) {
          await fetchMachineData(idMachine);
          await fetchGamesData(idMachine, parseInt(provider));
        } else {
          console.warn("El ID de la máquina no está disponible.");
        }
      } catch (error) {
        console.error("Error al obtener los datos de sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (socket) {
      socket.on('gameStatusUpdated', handleGameStatusUpdated);
      return () => {
        socket.off('gameStatusUpdated', handleGameStatusUpdated);
      };
    }
  }, [socket, idMachine, provider]); // Añadir provider a las dependencias

  const fetchMachineData = async (idMachineFromURL: string) => {
    const response = await fetch(`/api/maquinas`);
    const machineData = await response.json();
    const machine = machineData.data.find((m: any) => m.id_machine === idMachineFromURL);

    if (machine) {
      if (machine.status === 0) {
        await showDisabledMachineAlert();
      }
    } else {
      console.warn("No se encontró la máquina con el ID proporcionado.");
    }
  };

  const showDisabledMachineAlert = async () => {
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
  };

  const fetchGamesData = async (idMachineFromURL: string, provider: number) => {
    const response = await fetch(`/api/juegosApi/${idMachineFromURL}/${provider}`);
    const data = await response.json();
    if (data.data?.token) {
      setToken(data.data.token);
      const globalGamesData = await fetchGlobalGamesData();
      const finalBelatraGames = filterActiveGames(data.data.games, globalGamesData);
      setGames(finalBelatraGames);
    } else {
      console.error("Token no disponible en la respuesta.");
    }
  };

  const fetchGlobalGamesData = async () => {
    const response = await fetch('/api/juegosApi');
    const data = await response.json();
    return data.data || [];
  };

  const filterActiveGames = (belatraGames: Game[], globalGames: Game[]) => {
    const activeGlobalGames = globalGames.flatMap(providerData => providerData.games).filter(game => game.status === 1);
    return belatraGames.filter(belatraGame => 
      activeGlobalGames.some(globalGame => globalGame.id === belatraGame.id && belatraGame.status === 1)
    );
  };

  const handleGameStatusUpdated = (gameStatusChange: Game) => {
    console.log('Evento gameStatusUpdated recibido:', gameStatusChange);
    setGames(prevGames => prevGames.map(game =>
      game.id === gameStatusChange.id ? { ...game, status: gameStatusChange.status } : game
    ));
  };

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
  };

  const closeGameUrl = () => {
    setSelectedGame(null);
  };

  const filteredGames = games.filter(game => game.status === 1);

  return (
    <div className="belatra-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Swiper slidesPerView={1} spaceBetween={10} ref={swiperRef}>
            {[...Array(Math.ceil(filteredGames.length / 8))].map((_, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className="swiper-slide-content">
                  {filteredGames.slice(pageIndex * 8, (pageIndex + 1) * 8).map((game) => (
                    <div key={game.id} className="col-3 col-md-3">
                      <div className="col p-1" onClick={() => handleGameClick(game)}>
                        <Image
                          src={game.image}
                          alt={game.name}
                          style={{ width: '100%' }}
                          width={500}
                          height={500}
                        />
                        <div className="subtitle">{game.name}</div>
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
        </>
      )}
    </div>
  );
}

export default Belatra;
