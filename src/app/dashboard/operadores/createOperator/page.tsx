"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import getUsuarios from "@/controllers/getUsers";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface Usuario {
    _id: string;
    nombreCompleto: string;
    typeProfile: {
      _id: string;
    };
}

interface Cliente {
    _id: string;
    user: string;
}

function CrearUsuarios() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(1); 
  const [typeProfile, setTypeProfile] = useState("660ebaa7b02ce973cad66552");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (nombreCompleto.trim() === "" || email.trim() === "" || password.trim() === "") {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUsuarios = {
      nombreCompleto: capitalizeFirstLetter(nombreCompleto),
      email,
      password: hashedPassword,
      status,
      typeProfile,
      id_machine: "",
      client: clienteSeleccionado 
    };
    
    const response = await fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUsuarios),
    });

    if (typeof window !== "undefined" && response.status === 201) {
      window.location.href = "/dashboard/operadores";
    }
    console.log(newUsuarios);
  };

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const fetchedUsuarios = await getUsuarios("", 10);
        setUsuarios(fetchedUsuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    }

    fetchUsuarios();
  }, []);

  const usuariosClientes = usuarios.filter(
      (usuario) => usuario.typeProfile._id === "660ebaa7b02ce973cad66551"
  );

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Crear Operadores" />
        <AtrasButton href="/dashboard/operadores" />
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
                    htmlFor="password"
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

                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="clientes"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccionar Cliente
                  </label>
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setClienteSeleccionado(e.target.value)
                    }
                    value={clienteSeleccionado}
                    id="clientes"
                    name="clientes"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="">Seleccionar</option>
                    {usuariosClientes.map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombreCompleto}
                      </option>
                    ))}
                  </select>
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
      <ToastContainer />
    </DefaultLayout>
  );
}

export default CrearUsuarios;
