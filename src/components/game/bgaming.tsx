import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';

SwiperCore.use([Navigation]);

const Belatra: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null); // Assuming token is a string
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
  
        const params = new URLSearchParams(window.location.search);
        const idMachineFromURL = params.get('idMachine');
  
        if (sessionData.status === 200) {
          // const { id_machine } = sessionData.data.user;
          const provider = 68;
          const response = await fetch(`http://localhost:3000/api/juegosApi/${idMachineFromURL}/${provider}`);
          const data = await response.json();
  
          // Check if the token is available in the response
          if (data.data && data.data.token) {
            setToken(data.data.token); // Set the token state
          } else {
            console.error("Token not found in response:", data);
          }
  
          // Proceed with handling games if the response structure is as expected
          if (data.data && Array.isArray(data.data.games) && Array.isArray(data.data.providers)) {
            const belatraProvider = data.data.providers.find((p: any) => p.provider === 68);
            if (belatraProvider && belatraProvider.status === 0) {
              setGames([]);
            } else if (belatraProvider && belatraProvider.status === 1) {
              const bGamingGames = data.data.games.filter((game: any) => game.maker === 'bgaming' && game.status === 1);
              setGames(bGamingGames);
            }
          } else {
            console.error("Unexpected data structure:", data);
          }
        } else {
          console.error("User not authenticated:", sessionData.data.message);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
  
    fetchData();
  }, []);
  

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

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
  };

  const closeGameUrl = () => {
    setSelectedGame(null);
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
                    <img
                      src={game.image}
                      alt={game.name}
                      style={{width:'100%'}}
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
