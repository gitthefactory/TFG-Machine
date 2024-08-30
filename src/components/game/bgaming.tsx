import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { signOut } from 'next-auth/react'; // Importa la función signOut

const Belatra: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [idMachine, setIdMachine] = useState<string | null>(null);
  const [machineStatus, setMachineStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        
        if (!sessionData || sessionData.status !== 200) {
          console.error("Datos de sesión inválidos:", sessionData);
          setLoading(false);
          return;
        }

        // Obtener idMachine de la URL
        const params = new URLSearchParams(window.location.search);
        const idMachineFromURL = params.get('idMachine');
        setIdMachine(idMachineFromURL);
        console.log("ID de máquina desde la URL:", idMachineFromURL);

        if (idMachineFromURL) {
          const machineResponse = await fetch(`/api/maquinas`);
          const machineData = await machineResponse.json();
          const machine = machineData.data.find((m: any) => m.id_machine === idMachineFromURL);

          if (machine) {
            setMachineStatus(machine.status);

            // Mostrar alerta y cerrar sesión si la máquina está deshabilitada
            if (machine.status === 0) {
              setTimeout(async () => {
                await Swal.fire({
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

                // Cerrar sesión después de mostrar la alerta
                signOut(); 
                setLoading(false);
              }, 1000);

              return; // Detener el flujo si la máquina está deshabilitada
            }
          } else {
            console.warn("No se encontró la máquina con el ID proporcionado.");
          }
        }

        // Llamar a la API con el idMachine
        const provider = 68;
        const response = await fetch(`/api/juegosApi/${idMachineFromURL}/${provider}`);
        const data = await response.json();

        if (data.data?.token) {
          setToken(data.data.token);
        } else {
          console.error("Token no disponible en la respuesta.");
          setLoading(false);
          return;
        }

        // Obtener juegos globales
        const globalGamesResponse = await fetch('/api/juegosApi');
        const globalGamesData = await globalGamesResponse.json();

        // Filtrar juegos activos
        if (Array.isArray(globalGamesData.data)) {
          const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
          const activeBelatraGames = data.data.games.filter((game: any) => game.maker === 'belatra' && game.status === 1);

          const finalBelatraGames = activeBelatraGames.filter(belatraGame => 
            activeGlobalGames.some(globalGame => globalGame.id === belatraGame.id)
          );

          setGames(finalBelatraGames);
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
  }, []);

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
  };

  const closeGameUrl = () => {
    setSelectedGame(null);
  };

  return (
    <div className="belatra-container">
      {loading ? (
        <p>Loading...</p> 
      ) : (
        <>
          <Swiper slidesPerView={1} spaceBetween={10} ref={swiperRef}>
            {[...Array(Math.ceil(games.length / 8))].map((_, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className="swiper-slide-content">
                  {(games.slice(pageIndex * 8, (pageIndex + 1) * 8)).map((game, index) => (
                    <div key={index} className="col-3 col-md-3">
                      <div className="btn-game" onClick={() => handleGameClick(game)}>
                        <Image
                          src={game.image}
                          alt={game.name}
                          style={{width:'100%'}}
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
        </>
      )}
    </div>
  );
}

export default Belatra;
