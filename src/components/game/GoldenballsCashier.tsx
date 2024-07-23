import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css/swiper.min.css"; // Import Swiper styles
import Image from 'next/image';

const GoldenballsCashier: React.FC = () => {
  useEffect(() => {
    const goldenballsCashier = new Swiper("#goldenballsCashier", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,
    });

    // Cleanup function
    return () => {
      goldenballsCashier.destroy(); // Destroy Swiper instance when component unmounts
    };
  }, []); // Run only once on component mount

  return (
    <div id="goldenballsCashier" style={{ display: "none", backgroundColor: "#151f2c", paddingTop: "320px", overflow: "scroll" }}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="container">
            <div className="row">
              <div className="col">
                <Image src="assets/img/ezugi/goldenballs_cashier.png" className="cashier" alt =""width={500} height={500} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldenballsCashier;
