"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaDeleteLeft } from "react-icons/fa6";


export default function DeleteBtn(params: { id: any }) {
  const router = useRouter();

  async function handleDeleteClient() {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      await fetch(`http://localhost:3000/api/clientes/?_id=${params.id}`, {
        method: "DELETE",
      });
      router.refresh();
      window.location.reload()
    }
  }
  return (
    <button onClick={handleDeleteClient} style={{ fontSize: '20px'}}>
 <FaDeleteLeft />
    </button>
  );
}
