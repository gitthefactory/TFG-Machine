"use client";

import React, { useEffect, useState } from 'react';
import Swiper from 'swiper';
import '/src/css/swiper.css';
import '/src/css/main.css';
import '/src/css/bootstrap.min.css';
import '/src/css/satoshi.css';
import CrashSection from '@/components/game/crash'; 
import Live from '@/components/game/live';
import Providers from '@/components/game/providers';
import DreamcatcherCashier from '@/components/game/DreamcatcherCashier';
import Slots from '@/components/game/slots';
import Loader from "@/components/common/Loader";

const Games = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState('providers'); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    // Simulación de carga con un temporizador
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // // Inicializar el Swiper
    // new Swiper(".slider", {
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    // });

    // Limpia el temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, []);

  const handleCrash = () => {
    setVisibleSection('crash');
  };
  
  const handleAll = () => {
    setVisibleSection(''); 
    setTimeout(() => {
      setVisibleSection('providers');
    }, 1);
  };
  
  const handleSlots = () => {
    setVisibleSection(''); 
    setTimeout(() => {
      setVisibleSection('slots');
    }, 1);
  };
  
  const handleLive = () => {
    setVisibleSection(''); 
    setTimeout(() => {
      setVisibleSection('live');
    }, 1);
  };
  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="topbar">
        <div className="logo">
          <img src="/images/img/logo.png" alt="Logo" />
        </div>
        <div className="nav">
          <div className="navbar">
            <div className="jackpot"><span>000.000.000</span></div>
            <div className="acumulado"><span>000.000.000</span></div>
            <div className="gran"><span>000.000.000</span></div>
            <div className="menor"><span>000.000.000</span></div>
            <div className="express"><span>000.000.000</span></div>
          </div>
          <div className="menu">
            <button className="all" onClick={handleAll}></button>
            <button className="slots" onClick={handleSlots}></button>
            <button className="live" onClick={handleLive}></button>
            <button className="crash" onClick={handleCrash}></button>
          </div>
        </div>
      </div>
      {/* Los siguientes divs son controlados por el estado visibleSection */}
      {visibleSection === 'providers' && <Providers />}
      {visibleSection === 'slots' &&  <Slots />}
      {visibleSection === 'live' && <Live />}
      {visibleSection === 'crash' && <CrashSection />}

      {/* Botón o elemento para abrir o cerrar el modal */}
      <div className="dc" id="dreamcatcher" onClick={toggleModal}>
        <img src="/images/img/dreamcatcher.png" className="constant-tilt-shake" alt="Dreamcatcher" />
      </div>

      {/* Renderizar DreamcatcherCashier solo si isModalOpen es true */}
      {isModalOpen && (
        <div className="dreamcatcher-cashier-overlay" onClick={toggleModal}>
          <div className="dreamcatcher-cashier-container">
            <DreamcatcherCashier />
          </div>
        </div>
      )}

      <div className="footer d-flex justify-content-center">
        <div className="bgcreditos">
          <span className="credit">1234567890</span>
          <span className="amount">$123.456.78</span>
        </div>
      </div>
    </div>
  );
};

export default Games;
