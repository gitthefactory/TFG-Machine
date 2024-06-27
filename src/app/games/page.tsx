"use client";

import React, { useEffect, useState } from 'react';
// import Swiper from 'swiper';
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (section) => {
    setIsLoading(true);
    setVisibleSection('');
    setTimeout(() => {
      setVisibleSection(section);
      setIsLoading(false);
    }, 1000); // Simulación del tiempo de carga
  };

  const handleCrash = () => handleSectionChange('crash');
  const handleAll = () => handleSectionChange('providers');
  const handleSlots = () => handleSectionChange('slots');
  const handleLive = () => handleSectionChange('live');

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
      {visibleSection === 'providers' && <Providers />}
      {visibleSection === 'slots' && <Slots />}
      {visibleSection === 'live' && <Live />}
      {visibleSection === 'crash' && <CrashSection />}

      <div className="dc" id="dreamcatcher" onClick={toggleModal}>
        <img src="/images/img/dreamcatcher.png" className="constant-tilt-shake" alt="Dreamcatcher" />
      </div>

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
