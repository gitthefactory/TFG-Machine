"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const EditTransaction: React.FC<{ transaction: any }> = ({ transaction }) => {
  const [newNombre, setNewNombre] = useState<string>(transaction?.user || '');
  const [newCurrency, setNewCurrency] = useState<string>("CLP");
  const [newMessage, setNewMessage] = useState<string>('');
  const [action] = useState<string>('CREDIT');
  const [balance, setNewBalance] = useState<number>(transaction?.balance || 0);
  const [amount, setAmount] = useState<number>(0);
  const [idMachine, setIdMachine] = useState<string>("");
  const [salaBalance, setSalaBalance] = useState<number | null>(null);
  const [salaData, setSalaData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const currencyLimits = {
    CLP: 300000,
    MXN: 3000,
    BRL: 1000,
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    const urlParts = pathname.split("/");
    const id = urlParts[urlParts.length - 1];
    setIdMachine(id);

    if (!id) {
      console.error('No ID found in pathname.');
      return;
    }

    // Fetch the balance and currency from the API
    fetch(`/api/v1`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        if (data.status === 'OK') {
          const machineData = data.data.find((item: any) => item.user === id);
          if (machineData) {
            setNewBalance(machineData.balance);
            setNewCurrency(machineData.currency || 'Unknown');
            setNewNombre(machineData.user);

            // Fetch all rooms from /api/salas after successfully fetching machine data
            return fetch(`/api/salas`);
          } else {
            console.error('Machine data not found for ID:', id);
          }
        } else {
          throw new Error('Error fetching transaction details.');
        }
      })
      .then(salasResponse => {
        if (salasResponse) {
          return salasResponse.json();
        }
        throw new Error('No salas response received.');
      })
      .then(salasData => {
        console.log('Salas API Response:', salasData);

        const foundSalaData = salasData.data.find((sala: any) => sala.id_machine.includes(newNombre));
        if (foundSalaData) {
          console.log('Sala encontrada:', foundSalaData);
          setSalaData(foundSalaData);
          setSalaBalance(foundSalaData.balance);
        } else {
          console.error('No se encontró sala con el id_machine:', newNombre);
        }
      })
      .catch(error => console.error('Error fetching API:', error));
  }, [newNombre]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar el límite de moneda antes de proceder
    if (amount > currencyLimits[newCurrency as keyof typeof currencyLimits]) {
      setErrorMessage(`El monto excede el límite permitido para ${newCurrency}: ${currencyLimits[newCurrency as keyof typeof currencyLimits]}.`);
      return;
    }

    if (!idMachine || salaBalance === null) {
      console.error('ID Machine o salaBalance están faltando.');
      return;
    }

    const newSalaBalance = salaBalance - amount;
    if (newSalaBalance < 0) {
      console.error('El monto a transferir excede el balance de la sala.');
      return;
    }

    const transferData = {
      currency: newCurrency,
      id_machine: idMachine,
      balance,
      message: newMessage,
      action,
      amount,
    };

    try {
      const response = await fetch(`/api/credit/${idMachine}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (response.ok) {
        const salaResponse = await fetch(`/api/salas/${salaData._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ balance: newSalaBalance }),
        });

        if (salaResponse.ok) {
          window.location.href = "/dashboard/maquinas";
        } else {
          const errorData = await salaResponse.json();
          console.error("Error al actualizar el balance de la sala:", errorData);
        }
      } else {
        const errorData = await response.json();
        console.error("Error al hacer la solicitud:", errorData);
      }
    } catch (error) {
      console.error("Error de red:", error.message);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Transacción manual de crédito" />
        <AtrasButton href="/dashboard/maquinas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA MAQUINA</h1>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label htmlFor="newNombre" className="mb-3 block text-sm font-medium text-black dark:text-white">
                  ID Maquina
                </label>
                <input
                  value={newNombre}
                  id="newNombre"
                  name="newNombre"
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label htmlFor="currency" className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Moneda
                </label>
                <input
                  value={newCurrency}
                  id="currency"
                  name="currency"
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label htmlFor="balance" className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Balance actual
                </label>
                <input
                  value={balance}
                  id="balance"
                  name="balance"
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              
            </div>
            <h1 className="mb-6">TRANSACCIÓN CREDITO</h1>
            <div className="mb-4">
              <label htmlFor="amount" className="mb-3 block text-sm font-medium text-black dark:text-white">
                Ingresa un monto <span className="text-red">*</span>
              </label>
              <input
                onChange={(e) => setAmount(Number(e.target.value))}
                value={amount}
                id="amount"
                name="amount"
                type="number"
                placeholder="$0.00"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                required
              />
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="mb-3 block text-sm font-medium text-black dark:text-white">
                Mensaje
              </label>
              <input
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                id="message"
                name="message"
                type="text"
                placeholder="Escribe un mensaje"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Link
                href="/dashboard/maquinas"
                className="bg-gray-100 hover:bg-primary dark:bg-boxdark dark:hover:bg-primary inline-flex items-center justify-center gap-2.5 rounded-md py-3 px-8 font-medium text-black shadow-1 dark:text-white"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="hover:bg-opacity-80 inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-8 font-medium text-white shadow-1"
              >
                Creditar
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditTransaction;
