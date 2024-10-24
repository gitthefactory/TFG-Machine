"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import "/src/css/swiper.css";
import "/src/css/main.css";
import "/src/css/bootstrap.min.css";
import Loader from "@/components/common/Loader";
import { useSocket } from "@/app/api/socket/socketContext";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import "/src/css/Space.css";
import Link from "next/link";

type GameLayoutProps = {
  children: React.ReactNode;
};

interface MachineBalance {
  user: string;
  balance: number;
  currency?: string;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMachineBalance, setSelectedMachineBalance] =
    useState<MachineBalance | null>(null);
  const { socket } = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const idMachine = searchParams.get("idMachine");
  const provider = searchParams.get("provider");

  useEffect(() => {
    const fetchSelectedMachineBalance = async () => {
      const query = new URLSearchParams(window.location.search);
      const idMachine = query.get("idMachine");

      if (idMachine) {
        try {
          const [balanceResponse, machineResponse] = await Promise.all([
            axios.get(`/api/v1`),
            axios.get(`/api/maquinas`),
          ]);

          const machine = machineResponse.data.data.find(
            (m: any) => m.id_machine === idMachine,
          );

          if (machine && machine.status === 0) {
            clearCookiesAndRedirect("/maquinas");
            return; // Termina la función si redirige
          }

          if (balanceResponse.data.code === 200) {
            const machineData = balanceResponse.data.data.find(
              (machine: any) => machine.user === idMachine,
            );
            setSelectedMachineBalance({
              user: machineData ? machineData.user : idMachine,
              balance: machineData ? machineData.balance : 0,
              currency: machineData ? machineData.currency : "USD",
            });
          } else {
            setSelectedMachineBalance({
              user: idMachine,
              balance: 0,
              currency: "USD",
            });
          }
        } catch (error) {
          console.error("Error fetching selected machine balance:", error);
          setSelectedMachineBalance({
            user: idMachine || "",
            balance: 0,
            currency: "USD",
          });
        }
      } else {
        console.error("No idMachine found in URL");
        setSelectedMachineBalance({
          user: "",
          balance: 0,
          currency: "USD",
        });
      }
      setIsLoading(false);
    };

    fetchSelectedMachineBalance();

    if (socket) {
      const handleBalanceUpdate = (updatedBalance: MachineBalance) => {
        console.log("Balance actualizado recibido:", updatedBalance);
        if (selectedMachineBalance?.user === updatedBalance.user) {
          setSelectedMachineBalance((prev) => ({
            ...prev,
            balance: updatedBalance.balance,
          }));
        }
      };

      socket.on("balanceUpdated", handleBalanceUpdate);

      return () => {
        socket.off("balanceUpdated", handleBalanceUpdate);
      };
    }
  }, [socket, selectedMachineBalance]);

  const handleProvider = useCallback(
    (provider: string) => {
      if (idMachine) {
        router.push(`/provider?idMachine=${idMachine}&provider=${provider}`);
      } else {
        console.error("idMachine no está disponible en la consulta.");
      }
    },
    [idMachine, router]
  );

  const clearCookiesAndRedirect = (url: string) => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    window.location.href = url;
  };

  const handleSectionChange = async (section: string) => {
    setIsLoading(true); // Establecer loading a true

    try {
      // Simular la carga de contenido (esto sería tu lógica real de carga)
      await loadContentForSection(section); // Reemplaza esto con tu función de carga real
    } catch (error) {
      console.error("Error al cargar la sección:", error);
    } finally {
      setIsLoading(false); // Establecer loading a false una vez que la carga está completa
    }
  };

  // Ejemplo de función que simula la carga de contenido
  const loadContentForSection = (section: string): Promise<void> => {
    return new Promise((resolve) => {
      // Simula un tiempo de carga
      const loadingTime = Math.random() * 1000 + 500; // Carga entre 500ms y 1500ms
      setTimeout(resolve, loadingTime);
    });
  };
  const handleCrash = () => handleSectionChange("crash");

  const handleSlots = () => handleSectionChange("slots");
  const handleLive = () => handleSectionChange("live");

  const formatBalance = (balance: number, currency: string | undefined) => {
    return currency === "CLP"
      ? balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : balance.toFixed(2);
  };

  const formatBalanceWithoutDecimals = (balance: number) => {
    return balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "");
  };

  const handlePrint = () => {
    const qrCodeData = JSON.stringify({
      user: selectedMachineBalance?.user,
      balance: selectedMachineBalance?.balance,
    });

    const receiptContent = `
           <div style="font-size: 20px; font-family: 'Times New Roman'; min-width: 100%;">
      <img src="/images/img/allplay_print.png" alt="Logo" style="max-width: 100%;"/>
      <p style="text-align: center;">RECIBO<br>
      <table style="border-collapse: collapse; width: 100%;">
        <tbody>
          <tr>
            <td style="border-top: 1px solid black;padding-top: 10px;"><strong>Máquina:</strong> </td>
            <td style="border-top: 1px solid black; padding-right: 5px; padding-top: 10px;"><strong>${selectedMachineBalance?.user}</strong></td>
          </tr>
          <tr>
            <td style="padding: 1px; padding-top: 10px"><strong>Moneda: </strong></td>
            <td style="padding: 1px; padding-top: 10px"><strong>${selectedMachineBalance?.currency}</strong></td> 
          </tr>
          <tr>
            <td style="padding: 5px; text-align: left; padding-left: 0;"><strong>Monto a retirar: </strong></td>
            <td style="padding: 5px;">$<strong>${selectedMachineBalance?.balance.toFixed(2)}</strong></td>
          </tr>
          <tr>
  <td colspan="2" style="text-align: center;">
    <div style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;">
      <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=100x100">
    </div>
  </td>
</tr>
        </tbody>
      </table>
      <p style="text-align: left;"></p>
    </div>
  `;

    Swal.fire({
      title: "Previsualización de Recibo",
      html: receiptContent,
      showCancelButton: true,
      confirmButtonText: "Imprimir",
      cancelButtonText: "Cancelar",
      background: "#white",
      iconColor: "black",
      customClass: {
        popup: "swal-wide",
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handlePay();
        // Crear un elemento iframe oculto
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <html>
              <head>
                <title>Imprimir Recibo</title>
                <style>
                  @media print {
                    body { -webkit-print-color-adjust: exact; }
                  
                  }
                </style>
              </head>
              <body>
                ${receiptContent}
              </body>
            </html>
          `);
          doc.close();

          // Esperar un momento para cargar el contenido y luego imprimir
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Eliminar el iframe después de la impresión
          // setTimeout(() => {
          //   document.body.removeChild(iframe);
          // }, 1000);
        }
      }
    });
  };

  const handlePay = async () => {
    if (!selectedMachineBalance) return;

    try {
      const response = await fetch(
        `/api/debit/${selectedMachineBalance.user}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "DEBIT",
            amount: selectedMachineBalance.balance,
            currency: selectedMachineBalance.currency,
            message: "Cliente retiró dinero",
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
      } else {
      }
    } catch (error) {
      console.error("Error making payment:", error);
      await Swal.fire("Error", "Ocurrió un error durante el retiro.", "error");
    }
  };

  return (
    <>
 
 <div style={{ fontFamily: 'Space Grotesk', paddingTop: "135px" }}  className="background"
    >
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            {/* Top bar */}
            <div style={{
  position: "fixed",
  top: "0",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
}} >
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="topbox acu d-flex justify-content-between align-items-center">
                  <div  className="text-light text-top mt-4 w-100 text-center" style={{ fontFamily: 'Space Grotesk' }}>
                    <span className="fs-6">$</span>12.345.678,90
                  </div>
                </div>
                <div className="logo">
                  <Image src="/images/img/New-clients/tatan_gaming.png" alt='logo'height={350} width={350} />
                </div>
                <div className="topbox jac d-flex justify-content-between align-items-center" style={{ fontFamily: 'Space Grotesk' }}>
                  <div className="text-light text-top mt-4 w-100 text-center">
                    <span className="fs-6">$</span>12.345.678,90
                  </div>
                </div>
              </div>
            </div>
            {/* end topbar */}
            <div className="content-1">{children}</div>
            {/* bottom_bar */}
            <div className="bottom_bar">
              <div style={{ width: "100%" }}>
                <ul className="menubar" style={{fontFamily: 'Space Grotesk'}}>
                  <li className="nav-section">
                    <Link
                      href={`/provider?idMachine=${idMachine}`}
                      
                    >
                      TODOS
                    </Link>
                  </li>
                  <li className="nav-section">
                    <a href="#" onClick={handleSlots}>
                      SLOTS
                    </a>
                  </li>
                  <li className="nav-section">
                    <a href="#" onClick={handleLive}>
                      CASINO EN VIVO
                    </a>
                  </li>
                  <li className="nav-section">
                    <a href="#">BINGO</a>
                  </li>
                  <li className="nav-section">
                    <a href="#">VIRTUALES</a>
                  </li>
                  <li>
                    <a href="#">SCRATCH</a>
                  </li>
                </ul>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                <div className="pay">
                  <a href="#" onClick={() => handlePrint()}>
                    <Image src="/images/img/New_bottomBar/pay.png" alt="pay" width={150} height={150} />
                  </a>
                </div>
                <div className="bar" style={{ flexGrow: "1" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ width: "25%", textAlign: "center", fontFamily: 'Space Grotesk' }}
                      className="machine_id"
                    >
                      {selectedMachineBalance?.user}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "1rem",
                        marginLeft: "9rem",
                         fontFamily: 'Space Grotesk'
                        
                      }}
                      className="text-light text-bottom mt-2"
                    >
                      {selectedMachineBalance
                        ? formatBalanceWithoutDecimals(
                            selectedMachineBalance.balance,
                          )
                        : "000"}
                      <span className="credits" style={{fontFamily: 'Space Grotesk'}}>CRÉDITOS</span>
                    </div>
                    <div
                      style={{ width: "25%", textAlign: "center" }}
                      className="amount"
                    >
                      <span
                        className="fs-6"
                        style={{
                          fontSize: "40px",
                          display: "flex",
                          alignItems: "center",
                          fontFamily: 'Space Grotesk'
                        }}
                      >
                        {selectedMachineBalance ? (
                          <>
                            <span
                              style={{ fontSize: "20px", marginRight: "20px", fontFamily: 'Space Grotesk'}}
                            >
                              {selectedMachineBalance.currency || "USD"}
                            </span>
                            <span
                              style={{ marginLeft: "0px", fontSize: "20px" }}
                            >
                              $
                              {formatBalance(
                                selectedMachineBalance.balance,
                                selectedMachineBalance.currency,
                              )}
                            </span>
                          </>
                        ) : (
                          "USD $0.00"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div style={{ width: "172px" }}></div> */}
              </div>
             {/*  <div className="dream_catcher">
                <Image
                  src="/images/img/DreamCatch/dream_catcher.png"
                  alt=""
                  className="cashier"
                  width={500}
                  height={500}
                />
              </div> */}
            </div>
            {/*END  bottom_bar */}

            <div className="space">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameLayout;
