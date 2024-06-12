import React, { useEffect } from "react";
import Swiper from "swiper";
import '/src/css/swiper.css';

const DreamcatcherCashier: React.FC = () => {
  useEffect(() => {
    const dreamcatcherCashier = new Swiper("#dreamcatcherCashier", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    // Cleanup function
    return () => {
      dreamcatcherCashier.destroy(); // Destroy Swiper instance when component unmounts
    };
  }, []); // Run only once on component mount

  return (
    <div id="dreamcatcherCashier" style={{ display: "none", backgroundColor: "#151f2c", paddingTop: "90px", overflow: "scroll" }}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row">
              <div className="col">
                <img src="/images/img/ezugi/dreamcatcher_cashier.png" className="cashier" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamcatcherCashier;
