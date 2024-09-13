"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import { FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import "../../../css/globals.css";
import Keyboard from '@/components/Keyboard/Keyboard'; // Importa tu componente de teclado


const Maquinas: React.FC = () => {
    const [info, setInfo] = useState({
        id_machine: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false); // Estado para mostrar/ocultar el teclado
    const [activeInput, setActiveInput] = useState<string | null>(null); // Input activo
    const keyboardRef = useRef<HTMLDivElement>(null); // Referencia para el contenedor del teclado

    const router = useRouter();

    
    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleInputFocus(inputName: string) {
        setActiveInput(inputName);
        setShowKeyboard(true); // Muestra el teclado cuando un input es enfocado
    }

    function handleKeyPress(character: string) {
        if (activeInput) {
            setInfo((prev) => {
                if (character === 'delete') {
                    return {
                        ...prev,
                        [activeInput]: prev[activeInput].slice(0, -1),
                    };
                } else {
                    return {
                        ...prev,
                        [activeInput]: prev[activeInput] + character,
                    };
                }
            });
        }
    }
    

 
    async function verificarEstadoMaquina(idMachine: string) {
        try {
            const res = await axios.get(`/api/maquinas`);
            if (res.status === 200) {
                const machines = res.data.data;
                const machine = machines.find((m: any) => m.id_machine === idMachine);
                if (machine && machine.status === 0) {
                    return false; // Máquina con status 0, no se debe permitir el login
                }
                return true; // Máquina con status distinto de 0, se puede proceder
            } else {
                throw new Error("Error al verificar el estado de la máquina");
            }
        } catch (error) {
            console.error("Error al verificar el estado de la máquina:", error);
            throw error;
        }
    }

    async function obtenerInformacionMaquina(idMachine: string) {
        try {
            const res = await axios.get(`/api/juegosApi/${idMachine}`);
            if (res.status === 200) {
                const machineData = res.data.data;
                const roomDetails = machineData.room;
                return roomDetails;
            } else {
                throw new Error("Error al obtener la información de la máquina");
            }
        } catch (error) {
            console.error("Error al obtener la información de la máquina:", error);
            throw error;
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        if (!info.id_machine || !info.password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        setLoading(true);
        try {
            // Verificar estado de la máquina antes de iniciar sesión
            const estadoMaquina = await verificarEstadoMaquina(info.id_machine);
            if (!estadoMaquina) {
                setError("La máquina está inactiva. Por favor, contacte al administrador.");
                setLoading(false);
                return;
            }

            console.log("Enviando solicitud al backend con los siguientes datos:", info);
            const res = await signIn("credentialsmaquina", {
                id_machine: info.id_machine,
                password: info.password,
                redirect: false,
            });
            console.log("Respuesta del backend:", res);

            if (res?.error) {
                setError("ID de máquina o contraseña incorrectos");
                await Swal.fire({
                    title: "ERROR",
                    text: "DATOS INGRESADOS INCORRECTAMENTE POR FAVOR REINTENTAR",
                    icon: "error",
                    confirmButtonColor: "rgb(227, 17, 108)",
                    confirmButtonText: "OK",
                    customClass: {
                        title: "custom-title",
                        htmlContainer: "custom-html",
                    },
                });
                setLoading(false);
            } else {
                // Obtener información de la sala asociada a la máquina
                const roomInfo = await obtenerInformacionMaquina(info.id_machine);
                console.log("Detalles de la sala obtenidos:", roomInfo);

                setTimeout(async () => {
                    const result = await Swal.fire({
                        title: "CONFIRMACIÓN DE DATOS",
                        html: `
                  <p><span class="bold-text" style="color: black;">MAQUINA:</span> ${info.id_machine}</p>
                  <p><span class="bold-text" style="color: black;">SALA:</span> ${roomInfo.nombre}</p>
                  <p><span class="bold-text" style="color: black;">COMUNA:</span> ${roomInfo.comuna}</p>
                  <p><span class="bold-text" style="color: black;">UBICACIÓN:</span> ${roomInfo.ciudad} / ${roomInfo.pais}</p>
              `,
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "rgb(227, 17, 108)",
                        cancelButtonColor: "rgb(102, 102, 102)",
                        confirmButtonText: "SÍ, ESTÁN CORRECTOS",
                        cancelButtonText: "CANCELAR",
                        customClass: {
                            title: "custom-title",
                            htmlContainer: "custom-html",
                        },
                    });

                    if (result.isConfirmed) {
                        router.replace(`/games/?idMachine=${info.id_machine}`);
                    }
                    setLoading(false);
                }, 1000);
            }
        } catch (error) {
            console.error("Ocurrió un error al manejar la respuesta del backend:", error);
            setError("Ocurrió un error al iniciar sesión");
            setLoading(false);
        }
    }

    return (
        <>
            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", zIndex: 10, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "5px solid transparent", borderTopColor: "white", animation: "spin 1s linear infinite" }}></div>
                    <p style={{ color: "white", fontSize: "24px", marginTop: "20px" }}>CARGANDO DATOS</p>
                </div>
            )}
            <div className="rounded-sm shadow-default dark:border-strokedark dark:bg-boxdark" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                <a>
                    <Image className="dark:hidden p-3" src={"/images/logo/logo-white.png"} alt="Logo" width={350} height={32} />
                </a>
                <p className="2xl:px-20 text-center">
                    Scanea el QRCode o ingresa los datos correspondientes a la máquina:
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        {error && (
                            <span className="message" style={{ marginBottom: 10 }}>
                                {error}
                            </span>
                        )}
                        <div className="relative">
                        <input 
  onFocus={() => handleInputFocus("id_machine")} 
  onChange={(e) => handleInput(e)} 
  name="id_machine" 
  value={info.id_machine} 
  type="text" 
  placeholder="ID Máquina" 
  className="w-full rounded-lg py-4 pl-6 pr-10 border-solid border-2 border-black uppercase" 
/>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="relative">
                            <input onFocus={() => handleInputFocus("password")} onChange={(e) => handleInput(e)} name="password" value={info.password} type="password" placeholder="Contraseña" className="w-full rounded-lg py-4 pl-6 pr-10 border-solid border-2 border-black" />
                        </div>
                    </div>
                    <div className="mb-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button type="submit" className="cursor-pointer rounded-lg bg-primary p-3 text-white transition hover:bg-opacity-90" style={{ display: "flex", alignItems: "center", fontSize: "16px", backgroundColor: "#a11069" }}>
                            <span style={{ marginRight: "8px" }}>VALIDAR DATOS</span>
                            <FaCircleCheck style={{ color: "#4CAF50", fontSize: "17px", width: "50px" }} />
                        </button>
                    </div>
                </form>

                {showKeyboard && <Keyboard ref={keyboardRef} onKeyPress={handleKeyPress} />}
            </div>
        </>
    );
};

export default Maquinas;

