import React, { useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/css';

const Crash: React.FC = () => {
  useEffect(() => {
    // const crash = new Swiper("#crash", {
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    //   watchSlidesProgress: true,
    // });

    return () => {
      // crash.destroy();
    };
  }, []);

  return (
    <div id="crash" style={{ display: 'none' }}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row" style={{ justifyContent: 'center' }}>
              <div className="col-md-4">
                <h1>JANIIIIIIIIIIIIIIIIIIS</h1>
                <button className="btn-provider aviatrix"></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="swiper-button-next swiper-button-next-img"></div>
      <div className="swiper-button-prev swiper-button-prev-img"></div>
    </div>
  );
};

export default Crash;
