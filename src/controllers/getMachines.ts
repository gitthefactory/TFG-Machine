import { getSession } from "next-auth/react";

const ITEMS_PER_PAGE = 6;

export default async function getMachines(room: string, query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Obtener la sesión del usuario actual
    const session = await getSession();

    // Obtener el ID de usuario del usuario actual si hay sesión
    const userId = session?.user?._id;

    // Obtener el tipo de perfil del usuario actual
    const userProfile = session?.user?.typeProfile;

    // Obtener los datos de las máquinas asociadas a la sala seleccionada
    const maquinasResponse = await fetch(`http://localhost:3000/api/maquinas?room=${room}&query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });
    const maquinasData = await maquinasResponse.json();

    // Filtrar las máquinas según el tipo de usuario y su perfil
    if (userProfile === '660ebaa7b02ce973cad66550') {
      // Si el usuario tiene el rol específico, mostrar todas las máquinas de la sala seleccionada
      return maquinasData.data;
    } else {
      // Filtrar las máquinas para que solo se muestren las asociadas al usuario cliente y a la sala seleccionada
      const maquinasFiltradas = maquinasData.data.filter(maquina => maquina.client === userId);
      return maquinasFiltradas;
    }
  } catch (error) {
    console.error("Error al obtener las máquinas:", error);
    return [];
  }
}
