import React, { useEffect } from 'react';
import Swiper from 'swiper';
import '/src/css/swiper.css';
import '/src/css/main.css';
// import '/src/css/bootstrap.min.css';
import '/src/css/satoshi.css';

const Ezugi: React.FC = () => {
  useEffect(() => {
    const ezugiSwiper = new Swiper("#ezugi", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    return () => {
      ezugiSwiper.destroy();
    };
  }, []);

  const handleDreamCatcher = () => {
    // Lógica para manejar el clic en Dream Catcher
  };

  const handleBetOnNumbers = () => {
    // Lógica para manejar el clic en Bet on Numbers
  };

  const handleGoldenBalls = () => {
    // Lógica para manejar el clic en Golden Balls
  };

  return (
    <div id="ezugi">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <a className="btn-game" onClick={handleDreamCatcher}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/ezugi/dreamcatcher.png" />
                    <div className="subtitle">
                      Dream Catcher
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={handleBetOnNumbers}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/ezugi/betonnumbers.png" />
                    <div className="subtitle">
                      Bet on Numbers
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-md-3">
                <a className="btn-game" onClick={handleGoldenBalls}>
                  <div style={{ width: "250px", height: "250px" }}>
                    <img src="images/img/ezugi/goldenballs.png" />
                    <div className="subtitle">
                      Golden Balls
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

export default Ezugi;
