"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AtrasButton from "@/components/AtrasButton";
import getSession from "@/controllers/getSession";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
export default function CrearProveedores() {
  const [providerId, setProviderId] = useState<number>("Seleccionar"); // Cambiar el ID predeterminado a 68
  const [provider_name, setProvider_name] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [status, setStatus] = useState<number>(1);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedSession = await getSession();
        setSession(fetchedSession);
        
        const fetchedProvider = await fetchProvider(providerId);
        if (fetchedProvider) {
          setProvider_name(fetchedProvider.provider_name);
          setImg(fetchedProvider.img);
          setStatus(fetchedProvider.status ? 1 : 0);
        }
      } catch (error) {
        console.error("Error al obtener datos de sesión:", error);
      }
    }

    fetchData();
  }, [providerId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!provider_name || !img) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch('/api/juegosApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: providerId, // Cambiar a enviar el ID del proveedor
          img: img,
          status: status === 1,
          games: []
        }),
      });
      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }
      toast.success("Proveedor creado con éxito");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al enviar el formulario");
    }
  };

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProveedor = parseInt(e.target.value); // Convertir el valor a número
    setProviderId(selectedProveedor);
    switch (selectedProveedor) {
      case 68: // Cambiar el case para el ID 68
        setImg("/images/img/buttons/bgaming1.png");
        setProvider_name("Bgaming");
        break;
      case 29:
        setImg("/images/img/buttons/belatra1.png");
        setProvider_name("Belatra");
        break;
      case 12: // Aquí puedes agregar más casos según necesites
              setImg("/images/img/buttons/bgaming1.png");
              setProvider_name("booming-games");
        break;
        case 87: // Aquí puedes agregar más casos según necesites
              setImg("/images/img/buttons/bgaming1.png");
              setProvider_name("Aspect");
        break;
        case 89: // Aquí puedes agregar más casos según necesites
        setImg("/images/img/buttons/bgaming1.png");
        setProvider_name("Igrosoft");
        break;
        case 999: // Aquí puedes agregar más casos según necesites
        // ...
        break;
       

      default:
        setImg("");
        setProvider_name("");
        break;
    }
    setStatus(1); // Cambiar el estado predeterminado a activo al cambiar el proveedor
  };

  return (
    <>
      <DefaultLayout>
        <ToastContainer />
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Crear Proveedores" />
          <AtrasButton href="/dashboard/proveedores" />
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form onSubmit={handleSubmit} className="p-6.5">
                <div className="mb-4">
                  <label
                    htmlFor="proveedor"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    ID Proveedor
                  </label>
                  <select
                    id="proveedor"
                    onChange={handleProveedorChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  >
                    <option value="Seleccionar" disabled>Seleccionar</option>
                    <option value={68}>68</option> {/* Cambiar el value a número */}
                    <option value={29}>29</option>
                    <option value={12}>12</option>
                    <option value={87}>87</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="nombreProveedor"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Nombre del Proveedor
                  </label>
                  <input
                    type="text"
                    id="nombreProveedor"
                    value={provider_name}
                    onChange={(e) => setProvider_name(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Estado
                  </label>
                  <select
                    id="status"
                    value={status.toString()}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Imagen del proveedor
                  </label>
                  {img && (
                    <Image
                      src={img}
                      alt="Imagen del Proveedor"
                      className="mt-2 w-24 h-24"
                      width={100}
                       height={100}
                    />
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </form>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
