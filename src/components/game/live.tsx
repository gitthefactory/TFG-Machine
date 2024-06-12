import React, { useEffect, useState } from "react";
import Swiper from "swiper";

const Live: React.FC = () => {
  useEffect(() => {
    const liveSwiper = new Swiper("#live", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    return () => {
      // liveSwiper.destroy();
    };
  }, []);

  const [visibleSection, setVisibleSection] = useState('');
;

  return (
    <div id="live" style={{ display: "none" }}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            {visibleSection === '' && (
              <div className="row">
                
              </div>
            )}

            {/* Renderizado condicional del contenido */}
      
          </div>
        </div>
      </div>

      <div className="swiper-button-next swiper-button-next-img"></div>
      <div className="swiper-button-prev swiper-button-prev-img"></div>
    </div>
  );
};

export default Live;
