import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";

SwiperCore.use([Navigation]);

const Bgaming: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        console.log("Session Data:", sessionData);

             // Obtener idMachine de la URL usando window.location.search
             const params = new URLSearchParams(window.location.search);
             const idMachineFromURL = params.get('idMachine');

        if (sessionData.status === 200) {
          const { id_machine } = sessionData.data.user;
          const provider = 68;
          const response = await fetch(`http://localhost:3000/api/juegosApi/${idMachineFromURL}/${provider}`);
          const data = await response.json();
          console.log("API Data:", data);

          // Ensure the structure is as expected before accessing properties
          if (data.data && Array.isArray(data.data.games)) {
            const bGamingGames = data.data.games.filter((game: any) => game.maker === 'bgaming' && game.status === 1);
            setGames(bGamingGames);
          } else {
            console.error("Unexpected data structure:", data);
          }
        } else {
          console.error("User not authenticated:", sessionData.data.message);
          // Handle unauthenticated user case
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        // Handle error fetching session data
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
            <div className="row">
              {games.slice(pageIndex * 8, (pageIndex * 8) + 4).map((game: any, index: number) => (
                <div key={index} className="col-6 col-md-3" style={{ marginBottom: "20px" }}>
                  <a className="btn-game" href="#">
                    <img 
                      src={game.image} 
                      alt={game.name} 
                      style={{ width: "100%", height: "250px" }} 
                    />
                    <div className="subtitle">
                      {game.name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="row">
              {games.slice((pageIndex * 8) + 4, (pageIndex * 8) + 8).map((game: any, index: number) => (
                <div key={index} className="col-6 col-md-3" style={{ marginBottom: "20px" }}>
                  <a className="btn-game" href="#">
                    <img 
                      src={game.image} 
                      alt={game.name} 
                      style={{ width: "100%", height: "250px" }} 
                    />
                    <div className="subtitle">
                      {game.name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);
}

export default Bgaming;
