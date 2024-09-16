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
import Keyboard from '@/components/Keyboard/Keyboard'; 


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
        setInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.name === "id_machine" ? e.target.value.toUpperCase() : e.target.value,
        }));
    }

    function handleInputFocus(inputName: string) {
        setActiveInput(inputName);
        setShowKeyboard(true); // Muestra el teclado cuando un input es enfocado
    };

    const handleInputBlur = () => {
        setShowKeyboard(false); // Oculta el teclado cuando el input pierde el foco
    };

    const handleCloseKeyboard = () => {
        setShowKeyboard(false);
    };

    function handleKeyPress(character: string) {
        if (activeInput) {
            setInfo((prev) => {
                let newValue = prev[activeInput];
                if (character === 'delete') {
                    newValue = newValue.slice(0, -1);
                } else {
                    newValue += activeInput === 'id_machine' ? character.toUpperCase() : character;
                }
                return {
                    ...prev,
                    [activeInput]: newValue,
                };
            });
        }
    }

    

 
    async function verificarEstadoMaquina(idMachine: string) {
        try {
            const res = await axios.get(`/api/maquinas`);
            if (res.status === 200) {
                const machines = res.data.data;
                const machine = machines.find((m: any) => m.id_machine === idMachine);
                console.log('LA MAKINA E :' , machine)
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
    
    async function verificarEstadoSignIn(idMachine: string) {
        try {
            // Realiza una solicitud GET para obtener todas las máquinas
            const res = await axios.get(`/api/maquinas`);
            
            if (res.status === 200) {
                // Extrae los datos de la respuesta
                const machines = res.data.data;
                
                // Busca la máquina con el id_machine especificado
                const machine = machines.find((m: any) => m.id_machine === idMachine);
                
                // Imprime la máquina encontrada para depuración
                console.log('LA MAQUINA ES:', machine);
                
                if (machine && machine.signIn === 1) {
                    // Si la máquina tiene status 1, no se debe permitir el login
                    return false;
                }
                // Si la máquina tiene status distinto de 1, se puede proceder
                return true;
            } else {
                // Lanza un error si la respuesta no es 200 OK
                throw new Error("Error al verificar el estado de la máquina");
            }
        } catch (error) {
            // Imprime el error y lo lanza nuevamente
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


    async function actualizarEstadoSignIn(idMachine: string) {
        try {
            // Primero, obtener la máquina para verificar que existe
            const res = await axios.get(`/api/maquinas`);
            if (res.status === 200) {
                const machines = res.data.data;
                const machine = machines.find((m: any) => m.id_machine === idMachine);
                if (machine) {
                    // Máquina encontrada, proceder a actualizar el estado
                    const updateRes = await axios.put(`/api/maquinas/${machine._id}`, { signIn: 1 });
                    if (updateRes.status === 200) {
                        console.log("Estado de signIn actualizado correctamente.");
                    } else {
                        throw new Error("Error al actualizar el estado de signIn de la máquina");
                    }
                } else {
                    throw new Error("Máquina no encontrada");
                }
            } else {
                throw new Error("Error al obtener las máquinas");
            }
        } catch (error) {
            console.error("Error al actualizar el estado de signIn:", error);
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
            const estadoSignin = await verificarEstadoSignIn(info.id_machine)
            const estadoMaquina = await verificarEstadoMaquina(info.id_machine);
            if (!estadoSignin) {
                setError("El usuario está activo en otra ubicación.");
                setLoading(false);
                return;
            }
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
                        await actualizarEstadoSignIn(info.id_machine);
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
  /* onChange={(e) => handleInput(e)}  */
  onChange={handleInput}
  name="id_machine" 
  value={info.id_machine} 
  type="text" 
  placeholder="ID Máquina" 
  className="w-full rounded-lg py-4 pl-6 pr-10 border-solid border-2 border-black " 
  
/>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="relative">
                            <input onFocus={() => handleInputFocus("password")} onChange={handleInput} name="password" value={info.password} type="password" placeholder="Contraseña" className="w-full rounded-lg py-4 pl-6 pr-10 border-solid border-2 border-black" />
                        </div>
                    </div>
                    <div className="mb-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button type="submit" className="cursor-pointer rounded-lg bg-primary p-3 text-white transition hover:bg-opacity-90" style={{ display: "flex", alignItems: "center", fontSize: "16px", backgroundColor: "#a11069" }}>
                            <span style={{ marginRight: "8px" }}>VALIDAR DATOS</span>
                            <FaCircleCheck style={{ color: "#4CAF50", fontSize: "17px", width: "50px" }} />
                        </button>
                    </div>
                </form>

                {showKeyboard && (
  <Keyboard onKeyPress={handleKeyPress} onClose={handleCloseKeyboard} />
)}
            </div>
        </>
    );
};

export default Maquinas;