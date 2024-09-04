"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import Image from 'next/image';
import { useSocket } from '@/app/api/socket/socketContext';

interface MachineBalance {
  user: string;
  balance: number;
  currency?: string; 
}

/* interface Game {
  id: number;
  name: string;
  category: string;
  provider_name: string;
  image: string;
  status: number;
} */

const GameComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState('providers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachineBalance, setSelectedMachineBalance] = useState<MachineBalance | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const { socket } = useSocket();

/*   useEffect(() => {
    const fetchSetGames = async () => {
      try {
        const response = await axios.get('/api/v1/games');
        
        if (response.data.code === 200) {
          const gamesData = response.data.data.filter((game: Game) => game.status === 1);
          setGames(gamesData);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchSetGames();
  }, [socket]);  */

  

  useEffect(() => {
    const fetchSelectedMachineBalance = async () => {
      const query = new URLSearchParams(window.location.search);
      const idMachine = query.get('idMachine');
      
  
      if (idMachine) {
        try {
          const response = await axios.get(`/api/v1`);
          
          if (response.data.code === 200) {
            const machineData = response.data.data.find((machine: any) => machine.user === idMachine);
            
            if (machineData) {
              setSelectedMachineBalance({
                user: machineData.user,
                balance: machineData.balance,
                currency: machineData.currency || 'USD'
              });
            } else {
              setSelectedMachineBalance({
                user: idMachine,
                balance: 0,
                currency: 'USD'
              });
            }
          } else {
            setSelectedMachineBalance({
              user: idMachine,
              balance: 0,
              currency: 'USD'
            });
          }
        } catch (error) {
          console.error('Error fetching selected machine balance:', error);
          setSelectedMachineBalance({
            user: idMachine || '',
            balance: 0,
            currency: 'USD'
          });
        }
      } else {
        console.error('No idMachine found in URL');
        setSelectedMachineBalance({
          user: '',
          balance: 0,
          currency: 'USD'
        });
      }
      setIsLoading(false);
    };

    fetchSelectedMachineBalance();

    if (socket) {
      const handleBalanceUpdate = (updatedBalance: MachineBalance) => {
        console.log('Balance actualizado recibido:', updatedBalance);
        if (selectedMachineBalance?.user === updatedBalance.user) {
          setSelectedMachineBalance(prev => ({
            ...prev,
            balance: updatedBalance.balance,
          }));
        }
      };

   /*    const handleGameStatusUpdated = (gameStatusChange: Game) => {
        console.log('Game status changed:', gameStatusChange);
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gameStatusChange.id ? { ...game, status: gameStatusChange.status } : game
          )
        );
      };
 */
      socket.on('balanceUpdated', handleBalanceUpdate);
      /* socket.on('gameStatusUpdated', handleGameStatusUpdated);
 */
      return () => {
        socket.off('balanceUpdated', handleBalanceUpdate);
      /*   socket.off('gameStatusUpdated', handleGameStatusUpdated); */
      };
    }
  }, [socket, selectedMachineBalance]);
  

  const handleSectionChange = (section: string) => {
    setIsLoading(true);
    setVisibleSection('');
    setTimeout(() => {
      setVisibleSection(section);
      setIsLoading(false);
    }, 5000);
  };

  const handleCrash = () => handleSectionChange('crash');
  const handleAll = () => handleSectionChange('providers');
  const handleSlots = () => handleSectionChange('slots');
  const handleLive = () => handleSectionChange('live');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const formatBalance = (balance: number, currency: string | undefined) => {
    if (currency === 'CLP') {
      return balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return balance.toFixed(2);
    }
  };

  const formatBalanceWithoutDecimals = (balance: number) => {
    return balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <div className="topbar">
            <div className="logo">
              <Image src="/images/img/logo.png" alt="Logo" width={500} height={500} />
            </div>
            <div className="nav">
              <div className="navbar">
                <div className="jackpot"><span>78.000.000</span></div>
                <div className="acumulado"><span>000.556.970</span></div>
                <div className="gran"><span>010.000.000</span></div>
                <div className="menor"><span>000.250.000</span></div>
                <div className="express"><span>000.080.000</span></div>
              </div>
              <div className="menu">
                <button className="all" onClick={handleAll}></button>
                <button className="slots" onClick={handleSlots}></button>
                <button className="live" onClick={handleLive}></button>
                <button className="crash" onClick={handleCrash}></button>
              </div>
            </div>
          </div>
          {visibleSection === 'providers' && <Providers/>}
        {visibleSection === 'slots' && <Slots/>}
        {visibleSection === 'live' && <Live/>}
        {visibleSection === 'crash' && <CrashSection/>}
  
          <div className="dc" id="dreamcatcher" onClick={toggleModal}>
            <Image src="/images/img/dreamcatcher.png" className="constant-tilt-shake" alt="Dreamcatcher" width={500} height={500} />
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
              <span className="credit">{selectedMachineBalance ? formatBalanceWithoutDecimals(selectedMachineBalance.balance) : '000'}</span>
              <span className="amount">{selectedMachineBalance ? `${selectedMachineBalance.currency || 'USD'} $${formatBalance(selectedMachineBalance.balance, selectedMachineBalance.currency)}` : 'USD $0.00'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameComponent;