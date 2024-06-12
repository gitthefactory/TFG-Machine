import React, { useEffect } from 'react';
import Swiper from 'swiper';
// import 'swiper/css/swiper.min.css';

const Greentube: React.FC = () => {
  useEffect(() => {
    const greentubeSwiper = new Swiper("#greentube", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    return () => {
      greentubeSwiper.destroy();
    };
  }, []);

  const openGame = (game: string) => {
    // Lógica para abrir el juego
  };

  return (
    <div id="greentube">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row d-flex justify-content-center align-items-center p-3">
              {/* Primer conjunto de juegos */}
            </div>
            <div className="row d-flex justify-content-center align-items-center p-3">
              {/* Segundo conjunto de juegos */}
            </div>
          </div>
        </div>
      </div>

      <div className="swiper-button-next swiper-button-next-img"></div>
      <div className="swiper-button-prev swiper-button-prev-img"></div>
    </div>
  );
};

export default Greentube;
