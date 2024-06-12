"use client";
import Link from "next/link";
import { useState } from "react";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const EditarUsuario: React.FC<{ usuario: any }> = ({ usuario }) => {
    const [newNombreCompleto, setNewNombreCompleto] = useState(usuario.nombreCompleto);
    const [newEmail, setNewEmail] = useState(usuario.email);
    const [newPassword, setNewPassword] = useState(usuario.password);
    const [newStatus, setNewStatus] = useState(usuario.status);
    const [newTypeProfile, setNewTypeProfile] = useState(usuario.typeProfile);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedUsuario = {
            newNombreCompleto,
            newEmail,
            newPassword,
            newStatus,
            newTypeProfile,
        };

        // Enviar los datos actualizados al servidor
        try {
            const response = await fetch(`/api/usuarios/${usuario._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUsuario),
            });

            if (response.ok) {
                // Redireccionar a la página de usuarios si la actualización fue exitosa
                window.location.href = "/dashboard/usuarios";
            } else {
                // Manejar el caso en que la actualización falla
                console.error("Hubo un error al actualizar el usuario.");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <>
            <DefaultLayout>
                <div className="mx-auto max-w-270">
                    <Breadcrumb pageName="Editar Usuario" />
                    <AtrasButton href="/dashboard/usuarios" />
                    <div className="flex flex-col gap-9">
                        {/* <!-- Form --> */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form onSubmit={handleSubmit} className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label
                                            htmlFor="newNombreCompleto"
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        >
                                            Nombre Completo
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
                                            Email
                                        </label>
                                        <input
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            value={newEmail}
                                            id="newEmail"
                                            name="newEmail"
                                            type="email"
                                            placeholder="Ingresa correo electronico."
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
                                            Contraseña
                                        </label>
                                        <input
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            value={newPassword}
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            placeholder="Ingresa contraseña.."
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                                            
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="newStatus"
                                        className="mb-2 block text-sm font-medium text-white"
                                    >
                                        Cambiar estado
                                    </label>
                                    <select
                                        onChange={(e: any) => setNewStatus(e.target.value)}
                                        value={newStatus}
                                        id="newStatus"
                                        name="newStatus"
                                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-black bg-black"
                                    >
                                        <option value={1}>activo</option>
                                        <option value={0}>inactivo</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="newTypeProfile"
                                        className="mb-2 block text-sm font-medium text-white"
                                    >
                                        Cambiar rol
                                    </label>
                                    <select
                                        onChange={(e: any) => setNewTypeProfile(e.target.value)}
                                        value={newTypeProfile}
                                        id="newTypeProfile"
                                        name="newTypeProfile"
                                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-black bg-black"
                                    >
                                        <option value={"660ebaa7b02ce973cad66550"}>master</option>
                                        <option value={"660ebaa7b02ce973cad66551"}>cliente</option>
                                        <option value={"660ebaa7b02ce973cad66552"}>operador</option>
                                    </select>
                                </div>

                                <div className="mt-6 flex justify-end gap-4">
                                    <Link
                                        href="/dashboard/usuarios"
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
            </DefaultLayout>

        </>
    );
};

export default EditarUsuario;
