"use client";
import React, { useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const EditTransaction: React.FC<{ transaction: any }> = ({ transaction }) => {
    const [newNombre, setNewNombre] = useState<string>(transaction.id_machine || '');
    const [newCurrency, setNewCurrency] = useState<string>(transaction.currency || '');
  const [newMessage, setNewMessage] = useState<string>('');
  const [action] = useState<number>('DEBIT');

  const [balance, setNewbalance] = useState<number>(transaction.balance);

  // const [credit, setNewCredit] = useState<number>(transaction.balance);

  const [debit, setDebit] = useState<number>();


  console.log(transaction);


  console.log(transaction);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const transferData = {
      currency: newCurrency,
      id_machine: newNombre,
      balance,
      message: newMessage,
      action,
      // credit,
      debit,
    };

    console.log("Datos a enviar:", transferData); 

    try {
      const response = await fetch(`/api/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (response.ok) {
        window.location.href = "/dashboard/maquinas";
      } else {
        const errorData = await response.json();
        console.error("Error al hacer la solicitud:", errorData.message);
      }
    } catch (error) {
      console.error("Error de red:", error.message);
    }
  };


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Transacción manual de débito" />
        <AtrasButton href="/dashboard/salas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA MAQUINA</h1>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="newNombre"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  ID Maquina
                </label>
                <input
                  onChange={(e) => setNewNombre(e.target.value)}
                  value={newNombre}
                  id="newNombre"
                  name="newNombre"
                  type="text"
                  placeholder="id machine"
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
                  onChange={(e) => setNewCurrency(e.target.value)}
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
                  onChange={(e) => setNewbalance(e.target.value)}
                  value={balance}
                  id="balance"
                  name="balance"
                  type="text"
                  placeholder="Balante actual"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
            </div>
            <h1 className="mb-6">TRANSACCION DEBITO</h1>
            <div className="mb-4">
              <label
                htmlFor="debit"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Ingresa un monto <span className="text-red">*</span>
              </label>
              <input
                onChange={(e) => setDebit(Number(e.target.value))}
                value={debit}
                id="debit"
                name="debit"
                type="number"
                placeholder="$0.00"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="debit"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
             Mensaje
              </label>
              <input
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                id="message"
                name="message"
                type="string"
                placeholder="Escribe un mensaje"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Link
                href="/dashboard/salas"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditTransaction;
