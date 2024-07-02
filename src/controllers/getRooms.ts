import { getSession } from "next-auth/react";

const ITEMS_PER_PAGE = 6;

export default async function getRooms(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Obtener la sesión del usuario actual
    const session = await getSession();

    // Obtener el ID de usuario del usuario actual si hay sesión
    const userId = session?.user?._id;

    // Obtener los datos de las salas
    const response = await fetch(`/api/salas?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });
    const salasData = await response.json();

    // Si hay una sesión y el usuario tiene el rol '660ebaa7b02ce973cad66550', o si no hay sesión, mostrar todas las salas
    if (session && session.user?.typeProfile === '660ebaa7b02ce973cad66550') {
      return salasData.data;
    } else {
      // Filtrar las salas para que solo se muestren las asociadas al usuario actual
      const salasFiltradas = salasData.data.filter(sala => {
        // Si el usuario tiene el mismo ID que el cliente asociado con la sala, mostrarla
        return sala.client === userId;
      });

      return salasFiltradas;
    }
  } catch (error) {
    console.error("Error al obtener las salas:", error);
    return [];
  }
}
