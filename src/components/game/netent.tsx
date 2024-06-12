import React, { useEffect } from 'react';
import Swiper from 'swiper';
import '/src/css/swiper.css';
import '/src/css/main.css';
// import '/src/css/bootstrap.min.css';
import '/src/css/satoshi.css';

const Netent: React.FC = () => {
  useEffect(() => {
    const netentSwiper = new Swiper("#netent", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    return () => {
      // netentSwiper.destroy();
    };
  }, []);

  const openGame = () => {
    // Lógica para abrir el juego
  };

  return (
    <div id="netent">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/netent/aloha.png" />
                    <div className="subtitle">
                      ALOHA
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/netent/cashnoire.png" />
                    <div className="subtitle">
                      CASH NOIRE
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/netent/druidsdream.png" />
                    <div className="subtitle">
                      DRUIDS DREAM
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/netent/funkymaster.png" />
                    <div className="subtitle">
                      FUNK MASTER
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={openGame}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/netent/granspin.png" />
                    <div className="subtitle">
                      GRAND SPIN
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Netent;
