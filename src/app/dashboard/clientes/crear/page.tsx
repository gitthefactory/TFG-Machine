"use client";

import Link from "next/link";
import { useState } from "react";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function CrearUsuarios() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typeProfile, setTypeProfile] = useState("660ebaa7b02ce973cad66551");
  const [status, setStatus] = useState(1); // Estado predeterminado agregado

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (nombreCompleto.trim() === "" || email.trim() === "" || password.trim() === "") {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUsuarios = {
      nombreCompleto: capitalizeFirstLetter(nombreCompleto),
      email : email.toLowerCase(),
      password: hashedPassword,
      status, // Agregado status al objeto nuevo usuario
      typeProfile,
      id_machine: ""
    };
    
    const response = await fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUsuarios),
    });
    if (typeof window !== "undefined" && response.status === 201) {
      window.location.href = "/dashboard/clientes";
    }
    console.log(newUsuarios);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Crear Clientes" />
        <AtrasButton href="/dashboard/clientes" />
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit} className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="nombreCompleto"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Nombre cliente Completo
                  </label>
                  <input
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    value={nombreCompleto}
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    placeholder="Ingresa nombre completo"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="email"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ingresa correo electronico"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="contrasena"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Contraseña
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Ingresa contraseña"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <Link
                  href="/dashboard/clientes"
                   className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CrearUsuarios;
