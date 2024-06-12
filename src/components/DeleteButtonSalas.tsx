"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaDeleteLeft } from "react-icons/fa6";

export default function DeleteBtn(params: { id: any }) {
  const router = useRouter();

  async function handleDeleteRoom() {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      await fetch(`http://localhost:3000/api/salas/?_id=${params.id}`, {
        method: "DELETE",
      });
      router.refresh();
      window.location.reload()
    }
  }
  return (
    <button onClick={handleDeleteRoom} style={{ fontSize: '20px'}}>
 <FaDeleteLeft />
    </button>
  );
}
