"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn , useSession} from "next-auth/react";
import Swal from "sweetalert2";
import { FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import "../../css/globals.css";
import Keyboard from "@/components/Keyboard/Keyboard";
import { SessionProvider } from "next-auth/react";

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
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null); // Especificar el tipo correcto


  const { data: session } = useSession(); // Obtiene la sesión actual
  
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInfo((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "id_machine"
          ? e.target.value.toUpperCase()
          : e.target.value,
    }));
  }

  function handleInputFocus(inputName: string) {
    setActiveInput(inputName); // Cambia el input activo con el nombre pasado como argumento
    setShowKeyboard(true); // Muestra el teclado cuando haces foco en un input
  }

  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
    setActiveInput(null);
  };

  function handleKeyPress(character: string) {
    if (activeInput) {
      setInfo((prev) => {
        let newValue = prev[activeInput];
        if (character === "delete") {
          newValue = newValue.slice(0, -1);
        } else {
          newValue +=
            activeInput === "id_machine" ? character.toUpperCase() : character;
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
        console.log("LA MAQUINA E :", machine);
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

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const idMachineCookie = cookies.find((cookie) => cookie.startsWith("id_machine="));

    if (idMachineCookie) {
      const idMachineValue = idMachineCookie.split("=")[1];
      router.push(`/provider/?idMachine=${idMachineValue}`);
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target as Node) &&
        !((event.target as HTMLElement).closest("input") && activeInput) // Si el click no es en un input activo
      ) {
        setShowKeyboard(false); // Oculta el teclado
        setActiveInput(null); // Limpia el input activo
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeInput, keyboardRef, session, router]);

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
      const res = await axios.get(`/api/maquinas`);
      if (res.status === 200) {
        const machines = res.data.data;
        const machine = machines.find((m: any) => m.id_machine === idMachine);
        if (machine) {
          const updateRes = await axios.put(`/api/maquinas/${machine._id}`, {
            signIn: 1,
          });
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
            router.push(`/provider/?idMachine=${info.id_machine}`); // Redirige a la página de juegos
            document.cookie = `id_machine=${info.id_machine}; path=/; expires=${new Date(Date.now() + 100 * 365 * 864e5).toUTCString()}`;
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
    <SessionProvider>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "5px solid transparent",
              borderTopColor: "white",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "white", fontSize: "24px", marginTop: "20px" }}>
            CARGANDO DATOS
          </p>
        </div>
      )}
      <div
        className="rounded-sm shadow-default dark:border-strokedark dark:bg-boxdark"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <a>
          <Image
            className="p-3 dark:hidden"
            src={"/images/img/Logo-Factory/Logo-factory.png"}
            alt="Logo"
            width={350}
            height={32}
          />
        </a>
        <p className="text-center 2xl:px-20">
          Scanea el QRCode o ingresa los datos correspondientes a la máquina:
        </p>
        {error && (
          <span
            className="message "
            style={{ color: "gray", margin: "0px, 0px, 30px" }}
          >
            {error}
          </span>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <input
                onFocus={() => handleInputFocus("id_machine")}
                /* onChange={(e) => handleInput(e)}  */
                onChange={handleInput}
                name="id_machine"
                value={info.id_machine}
                type="text"
                placeholder="ID Máquina"
                className="w-full rounded-lg border-2 border-solid border-black py-4 pl-6 pr-10 "
                style={{ textAlign: "center"}}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="relative">
              <input
                onFocus={() => handleInputFocus("password")}
                onChange={handleInput}
                name="password"
                value={info.password}
                type="password"
                placeholder="Contraseña"
                className="w-full rounded-lg border-2 border-solid border-black py-4 pl-6 pr-10"
              />
            </div>
          </div>
          <div
            className="mb-5"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-primary p-3 text-white transition hover:bg-opacity-90"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                backgroundColor: "#FECB00",
              }}
            >
              <span style={{ marginRight: "8px" }}>VALIDAR DATOS</span>
              <FaCircleCheck
                style={{ color: "#000", fontSize: "17px", width: "50px" }}
              />
            </button>
          </div>
        </form>

        {showKeyboard && (
          <Keyboard onKeyPress={handleKeyPress} onClose={handleCloseKeyboard} />
        )}
      </div>
      </SessionProvider>
      {redirectUrl && ( // Redirigir después de iniciar sesión correctamente
        <Link href={redirectUrl} />
      )}
    </>
  );
};

export default Maquinas;
