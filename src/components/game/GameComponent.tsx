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
import { Br, Cut, Line, Printer, Row, Text, render } from 'react-thermal-printer';
interface MachineBalance {
  user: string;
  balance: number;
  currency?: string; 
}

const GameComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState('providers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachineBalance, setSelectedMachineBalance] = useState<MachineBalance | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchSelectedMachineBalance = async () => {
      const query = new URLSearchParams(window.location.search);
      const idMachine = query.get('idMachine');
      
      if (idMachine) {
        try {
          const [balanceResponse, machineResponse] = await Promise.all([
            axios.get(`/api/v1`),
            axios.get(`/api/maquinas`)
          ]);

          const machine = machineResponse.data.data.find((m: any) => m.id_machine === idMachine);
          
          if (machine && machine.status === 0) {
            clearCookiesAndRedirect('/maquinas');
            return; // Termina la función si redirige
          }

          if (balanceResponse.data.code === 200) {
            const machineData = balanceResponse.data.data.find((machine: any) => machine.user === idMachine);
            setSelectedMachineBalance({
              user: machineData ? machineData.user : idMachine,
              balance: machineData ? machineData.balance : 0,
              currency: machineData ? machineData.currency : 'USD'
            });
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

      socket.on('balanceUpdated', handleBalanceUpdate);

      return () => {
        socket.off('balanceUpdated', handleBalanceUpdate);
      };
    }
  }, [socket, selectedMachineBalance]);

  const clearCookiesAndRedirect = (url: string) => {
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    window.location.href = url;
  };

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
    return currency === 'CLP' 
      ? balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : balance.toFixed(2);
  };

  const formatBalanceWithoutDecimals = (balance: number) => {
    return balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "");
  };


  const handlePay = async () => {
    if (!selectedMachineBalance) return;

    try {
      const response = await fetch(`/api/debit/${selectedMachineBalance.user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'DEBIT',
          amount: selectedMachineBalance.balance,
          currency: selectedMachineBalance.currency,
          message: 'Cliente retiró dinero',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Pago Realizado con exito!');
           // Aquí vamos a generar el recibo y enviarlo a la impresora térmica.
      const receipt = (
        <Printer type="epson" width={42}>
          <Text bold={true}>Recibo de Pago</Text>
          <Br />
          <Line />
          <Row left="Cliente" right={selectedMachineBalance?.user || 'N/A'} />
          <Row left="Monto Retirado" right={`${selectedMachineBalance?.currency || 'USD'} ${selectedMachineBalance?.balance}`} />
          <Line />
          <Text align="center">Gracias por su compra</Text>
          <Br />
          <Cut />
        </Printer>
      );

      // Generar el Uint8Array para la impresora térmica
      const dataToPrint: Uint8Array = await render(receipt);

      // Enviar los datos a la impresora térmica vía serial port
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      const writer = port.writable?.getWriter();
      if (writer) {
        await writer.write(dataToPrint);
        writer.releaseLock();
      }
      } else {
        alert(`Pago fallido consultar con admin: ${data.data.message}`);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Error making payment:', error);
      alert('El pago falló debido a un error.');
    }
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

          {visibleSection === 'providers' && <Providers />}
          {visibleSection === 'slots' && <Slots />}
          {visibleSection === 'live' && <Live />}
          {visibleSection === 'crash' && <CrashSection />}

          {/* <div className="dc" id="dreamcatcher" onClick={toggleModal}>
            <Image src="/images/img/dreamcatcher.png" className="constant-tilt-shake" alt="Dreamcatcher" width={500} height={500} />
          </div> */}

          {isModalOpen && (
            <div className="dreamcatcher-cashier-overlay" onClick={toggleModal}>
              <div className="dreamcatcher-cashier-container">
                <DreamcatcherCashier />
              </div>
            </div>
          )}

          <div className="footer d-flex justify-content-center">
            <div className="bgcreditos">
              <span className="credit">
                {selectedMachineBalance ? formatBalanceWithoutDecimals(selectedMachineBalance.balance) : '000'}
              </span>
              
              <span className="amount">
                {selectedMachineBalance ? `${selectedMachineBalance.currency || 'USD'} $${formatBalance(selectedMachineBalance.balance, selectedMachineBalance.currency)}` : 'USD $0.00'}
                
              </span>
              
            </div>
            <button className="btn botonPagar" onClick={handlePay}>PAGAR</button>
          </div>
          
           <div>
          
           </div>
        </>
       
      )}
    </div>
  );
};

export default GameComponent;
