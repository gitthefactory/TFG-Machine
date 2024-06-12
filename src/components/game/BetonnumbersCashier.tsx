import React, { useEffect } from "react";
import Swiper from "swiper";
import '/src/css/swiper.css';

const BetonnumbersCashier: React.FC = () => {
  useEffect(() => {
    const betonnumbersCashier = new Swiper("#betonnumbersCashier", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    // Cleanup function
    return () => {
      betonnumbersCashier.destroy(); // Destroy Swiper instance when component unmounts
    };
  }, []); // Run only once on component mount

  return (
    <div id="betonnumbersCashier" style={{ display: "none", backgroundColor: "#151f2c", paddingTop: "450px", overflow: "scroll" }}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row">
              <div className="col">
                <img src="/images/img/ezugi/betonnumbers_cashier.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetonnumbersCashier;
