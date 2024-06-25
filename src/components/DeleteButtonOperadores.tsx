"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaTrashCan } from "react-icons/fa6";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function DeleteBtn({ id }: { id: any }) {
  const router = useRouter();

  async function handleDeleteOperador() {
    await fetch(`http://localhost:3000/api/usuarios/?_id=${id}`, {

      method: "DELETE",
    });
    router.refresh();
    toast.success("Operador eliminado exitosamente", {
      position: "top-right",
    });
  }

  function confirmDelete() {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que quieres eliminar este Operador?",
      buttons: [
        {
          label: "Sí",
          onClick: handleDeleteOperador,
        },
        {
          label: "No",
          onClick: () => toast.info("Eliminación cancelada", {
            position: "top-right",
          }),
        },
      ],
    });
  }

  return (
    <>
      <button onClick={confirmDelete} style={{ fontSize: '20px' }}>
        <FaTrashCan />
      </button>
      <ToastContainer />
    </>
  );
}