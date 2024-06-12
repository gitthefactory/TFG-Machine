"use client";

import Link from "next/link";
import { useState } from "react";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function CrearUsuarios() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Seleccionar");
  const [typeProfile, setTypeProfile] = useState("Seleccionar");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (status === "Seleccionar" || typeProfile === "Seleccionar") {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUsuarios = {
      nombreCompleto,
      email,
      password: hashedPassword,
      status,
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
      window.location.href = "/dashboard/usuarios";
    }
    console.log(newUsuarios);
  };
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Crear Usuarios" />
        <AtrasButton href="/dashboard/usuarios" />
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit} className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="nombreCompleto"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Nombre Completo
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
                    placeholder="Ingresa contraseña.."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="status"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Indicar estado
                  </label>
                  <select
                    onChange={(e: any) => setStatus(e.target.value)}
                    value={status}
                    id="status"
                    name="status"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="Seleccionar" disabled>Seleccionar</option>
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="w-full xl:w-1/2">
                <label
                  htmlFor="roles"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Cambiar rol
                </label>
                <select
                  onChange={(e: any) => setTypeProfile(e.target.value)}
                  value={typeProfile}
                  id="typeProfile"
                  name="typeProfile"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="Seleccionar" disabled>Seleccionar</option>
                  <option value={"660ebaa7b02ce973cad66550"}>Master</option>
                  <option value={"660ebaa7b02ce973cad66551"}>Cliente</option>
                  <option value={"660ebaa7b02ce973cad66552"}>Operador</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Link
                  href="/dashboard/usuarios"
                  className="button-secondary"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="button-primary"
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
