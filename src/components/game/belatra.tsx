import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore, { Navigation } from 'swiper';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';

// SwiperCore.use([Navigation]);

const Belatra: React.FC = () => {
  const [games, setGames] = useState<any[]>([]); // Estado para almacenar los juegos
  const [selectedGame, setSelectedGame] = useState<any>(null); // Estado para el juego seleccionado
  const [token, setToken] = useState<string | null>(null); // Estado para el token de autenticación, asumiendo que es una cadena
  const swiperRef = useRef<any>(null); // Referencia al Swiper para controlarlo programáticamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtiene los datos de sesión del usuario
        const sessionData = await getSessionData(); 
        // console.log("Datos de sesión:", sessionData);
  
        // Obtiene el parámetro 'idMachine' de la URL
        const params = new URLSearchParams(window.location.search);
        const idMachineFromURL = params.get('idMachine'); 
        // console.log("ID de la máquina desde URL:", idMachineFromURL);
  
        // Verifica si el usuario está autenticado
        if (sessionData.status === 200) {
          const provider = 29; // Identificador del proveedor de juegos (en este caso, 29)
  
          // Realiza una solicitud para obtener datos de juegos desde el servidor
          const response = await fetch(`/api/juegosApi/${idMachineFromURL}/${provider}`);
          const data = await response.json();
          // console.log("Datos de juegos desde el servidor:", data);
  
          // Verifica si el token está disponible en la respuesta
          if (data.data && data.data.token) {
            setToken(data.data.token); // Establece el estado del token
          } else {
            // console.error("Token no encontrado en la respuesta:", data);
            return; // Sale de la función si no se encuentra el token
          }
  
          // Realiza una solicitud para obtener juegos globales
          const globalGamesResponse = await fetch('/api/juegosApi');
          const globalGamesData = await globalGamesResponse.json();
          // console.log("Datos de juegos globales:", globalGamesData);
  
          // Verifica si los juegos están disponibles en la respuesta
          if (globalGamesData.data && Array.isArray(globalGamesData.data)) {
            // Filtra los juegos globales con status 1
            const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
            // console.log("Juegos activos globales con status 1:", activeGlobalGames);
  
            // Filtra los juegos de 'belatra' específicos con status 1
            const activeBelatraGames = data.data.games.filter((game: any) => game.maker === 'belatra' && game.status === 1);
            // console.log("Juegos activos de 'belatra' con status 1:", activeBelatraGames);
  
            // Filtra los juegos de 'belatra' que también están en la lista de juegos globales con status 1
            const finalBelatraGames = activeBelatraGames.filter(belatraGame => 
              activeGlobalGames.some(globalGame => globalGame.id === belatraGame.id)
            );
            // console.log("Juegos finales de 'belatra' con status 1 en ambas listas:", finalBelatraGames);
  
            // Establece los juegos filtrados en el estado
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
  }, []);
  
  

// Función para manejar el clic en el botón "Anterior"
const handlePrevButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev(); // Mueve el swiper a la diapositiva anterior
    }
};

// Función para manejar el clic en el botón "Siguiente"
const handleNextButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext(); // Mueve el swiper a la siguiente diapositiva
    }
};

// Función para manejar el clic en un juego
const handleGameClick = (game: any) => {
    setSelectedGame(game); // Establece el juego seleccionado en el estado
};

// Función para cerrar el juego seleccionado
const closeGameUrl = () => {
    setSelectedGame(null); // Resetea el juego seleccionado a null
};
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
    </div>
  );
}

export default Belatra;
