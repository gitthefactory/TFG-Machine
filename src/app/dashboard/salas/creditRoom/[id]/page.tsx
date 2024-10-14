"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const EditTransaction: React.FC = () => {
  const [newNombre, setNewNombre] = useState<string>('');
  const [newCurrency, setNewCurrency] = useState<string>("CLP");
  const [newMessage, setNewMessage] = useState<string>('');
  const [action] = useState<string>('CREDIT');
  const [balance, setNewBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [roomId, setRoomId] = useState<string>("");
  const [error, setError] = useState<string>(''); // Estado para manejar errores
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar el indicador de carga
  const [newClientid, setnewClientId] = useState<string>(''); // Estado
  useEffect(() => {
    const currentUrl = window.location.pathname;
    const segments = currentUrl.split('/');
    const id = segments[segments.length - 1];
    setRoomId(id);

    const fetchRoomData = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/salas/${id}`);
          if (response.ok) {
            const { data } = await response.json();
            console.log("Datos de la sala:", data);
            setNewNombre(data.nombre);
            setNewBalance(data.balance);
            setNewCurrency(data.currency[0]);
            setnewClientId(data.client); // Agrega el clientId al estado
          } else {
            console.error("Error en la respuesta del servidor");
          }
        } catch (error) {
          console.error("Error al cargar los datos de la sala:", error.message);
        }
      }
    };

    fetchRoomData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reinicia el mensaje de error
    setLoading(true); // Activa el indicador de carga

    if (!roomId) {
      console.error('Room ID is missing.');
      return;
    }

    

    const transferData = {
      currency: newCurrency,
      roomId,
      balance,
      message: newMessage,
      action,
      amount,
      client : newClientid
    };

    try {
      const response = await fetch(`/api/roomCred/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (response.ok) {
        window.location.href = "/dashboard/salas";
      } else {
        const errorData = await response.json();
        console.error("Error al hacer la solicitud:", errorData.message);
        setError("Error al hacer la solicitud. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error de red:", error.message);
      setError("Error de red. Por favor verifica tu conexión.");
    } finally {
      setLoading(false); // Desactiva el indicador de carga al finalizar
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Transacción manual de crédito para una sala" />
        <AtrasButton href="/dashboard/salas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA SALA </h1>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="newNombre"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Nombre de la Sala
                </label>
                <input
                  value={newNombre}
                  id="newNombre"
                  name="RoomName"
                  type="text"
                  placeholder="Nombre de la sala"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="currency"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Moneda
                </label>
                <input
                  value={newCurrency}
                  id="currency"
                  name="currency"
                  type="text"
                  placeholder="Moneda"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="balance"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Balance actual
                </label>
                <input
                  value={balance}
                  id="balance"
                  name="balance"
                  type="text"
                  placeholder="Balance actual"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="amount"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Cantidad a transferir
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Ingrese la cantidad"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
              />
              {error && <p className="text-red-500">{error}</p>} {/* Mensaje de error */}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Link
                href="/dashboard/maquinas"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className={`flex h-10 items-center rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'} px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600`}
                disabled={loading} // Desactiva el botón mientras se carga
              >
                {loading ? "Cargando..." : "Guardar Cambios"} {/* Texto del botón */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditTransaction;
