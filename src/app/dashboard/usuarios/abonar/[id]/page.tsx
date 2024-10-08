"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "next/navigation";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Para asegurar que los estilos se carguen

const AbonarBalancePage: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/usuarios/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al obtener el usuario");
        }

        setUser(data);
        console.log("Datos del usuario:", data); // Debugging
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleDeposit = async () => {
    setError(null);
  
    try {
      const res = await fetch(`/api/depositUser/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // Si el estado no es 200, mostrar alerta con el mensaje de error del backend
        await Swal.fire({
          title: 'Error',
          html: `<p><span class="bold-text" style="color: black;">${data.message || 'Error al hacer el depósito'}</span></p>`,
          icon: 'error',
          confirmButtonColor: 'rgb(227, 17, 108)',
          confirmButtonText: 'ACEPTAR',
          customClass: {
            title: 'custom-title',
            htmlContainer: 'custom-html',
          },
        });
        return;  // No continuar si hay un error
      }
  
      // Mostrar mensaje de éxito
      toast.success("Depósito realizado con éxito");
  
      // Redirigir al usuario después de un tiempo
      setTimeout(() => {
        window.location.href = "/dashboard/clientes";
      }, 2000);
    } catch (error: any) {
      setError(error.message);
      toast.error("Error al realizar el depósito");
    }
  };
  

  if (error) {
    return <p>Error: {error}</p>; // Mostrar mensaje de error
  }

  if (!user) {
    return <p>Cargando...</p>;
  }
const remainingLimit = user.depositLimit - user.balance 
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Abonar Balance" />
        <AtrasButton href="/dashboard/clientes" />
    
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={(e) => { e.preventDefault(); handleDeposit(); AtrasButton; }} className="p-6.5">
              <h1 className="mb-6">ABONAR BALANCE</h1>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label
                    htmlFor="nombreCompleto"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Nombre Cliente
                  </label>
                  <input
                    value={user.data.nombreCompleto}
                    id="nombreCompleto"
                    type="text"
                    disabled // Comentar temporalmente si es necesario
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition"
                  />
                </div>
              </div>





              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label
                    htmlFor="amount"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Este cliente poseé actualmente un limite de : ${user.data.depositLimit}
                  </label>
                 
                </div>
              </div>




              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label
                    htmlFor="amount"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Balance actual cliente
                  </label>
                  <input
                    type="number"
                    id="balance"
                    value={user.data.balance}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Ingrese el monto a abonar"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition"
                    disabled
                  />
                </div>
              </div>



              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label
                    htmlFor="amount"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Monto a Abonar
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Ingrese el monto a abonar"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <AtrasButton href="/dashboard/clientes" />
                <button
                  type="submit"
                  className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  Abonar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default AbonarBalancePage;
