"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const OperatorForm: React.FC<{ usuario: any }> = ({ usuario }) => {
    const [newNombreCompleto, setNewNombreCompleto] = useState(usuario.nombreCompleto);
    const [newEmail, setNewEmail] = useState(usuario.email);
    const [newPassword, setNewPassword] = useState(usuario.password);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedUsuario = {
            nombreCompleto: newNombreCompleto,
            email: newEmail,
            password: newPassword,
        };

        try {
            const response = await fetch(`/api/usuarios/${usuario._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUsuario),
            });

            if (response.ok) {
                // Mostrar notificación de éxito
                toast.success('¡Usuario actualizado exitosamente!');
                // Redirigir o hacer cualquier otra acción necesaria
                window.location.href = "/dashboard/operadores";
            } else {
                console.error("Hubo un error al actualizar el usuario.");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Editar Operador" />
                <AtrasButton href="/dashboard/clientes" />
                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form onSubmit={handleSubmit} className="p-6.5">
                            <h1 className="mb-6">DATOS DEL OPERADOR</h1>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label
                                        htmlFor="newNombreCompleto"
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    >
                                        Nombre Operador
                                    </label>
                                    <input
                                        onChange={(e) => setNewNombreCompleto(e.target.value)}
                                        value={newNombreCompleto}
                                        id="newNombreCompleto"
                                        name="newNombreCompleto"
                                        type="text"
                                        placeholder="Ingresa nombre completo."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                                        required
                                    />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <label
                                        htmlFor="newEmail"
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    >
                                        Correo Electrónico
                                    </label>
                                    <input
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        value={newEmail}
                                        id="newEmail"
                                        name="newEmail"
                                        type="email"
                                        placeholder="Ingresa correo electrónico."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label
                                        htmlFor="newPassword"
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    >
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        placeholder="Ingresa una nueva contraseña..."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <Link
                                    href="/dashboard/operadores"
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
            </div>
            <ToastContainer />
        </DefaultLayout>
    );
};

export default OperatorForm;
