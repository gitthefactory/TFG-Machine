import React, { useEffect } from 'react';
import Swiper from 'swiper';
import '/src/css/swiper.css';
import '/src/css/main.css';
// import '/src/css/bootstrap.min.css';
import '/src/css/satoshi.css';

const Tatan: React.FC = () => {
  useEffect(() => {
    const tatanSwiper = new Swiper("#tatan", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    return () => {
      // tatanSwiper.destroy();
    };
  }, []);

  const openGame = () => {
    // Lógica para abrir el juego según la imagen
  };

  return (
    <div id="tatan">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/tatan/fresilla.jpg" />
                    <div className="subtitle">
                    Fresilla
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/tatan/tesorodeloriente.jpg" />
                    <div className="subtitle">
                    Tesoro de Oriente
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/tatan/orodemexico.jpg" />
                    <div className="subtitle">
                      Oro de Mexico
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/tatan/megabuffalo.jpg" />
                    <div className="subtitle">
                      Mega Buffalo
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="swiper-button-next swiper-button-next-img"></div>
      <div className="swiper-button-prev swiper-button-prev-img"></div> */}
    </div>
  );
};

export default Tatan;
