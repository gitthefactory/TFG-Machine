import { getSession } from "next-auth/react";

const ITEMS_PER_PAGE = 6;

export default async function getUsers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Obtener la sesión del usuario actual
    const session = await getSession();

    // Obtener el ID de usuario del usuario actual si hay sesión
    const userId = session?.user?._id;

    // Obtener el tipo de perfil del usuario actual
    const userProfile = session?.user?.typeProfile;

    // Validar y limpiar la consulta
    const cleanQuery = encodeURIComponent(query);

    // Construir la URL de la API utilizando el objeto URL
    const apiUrl = `/api/usuarios?query=${cleanQuery}&limit=${ITEMS_PER_PAGE}&offset=${offset}`;

    // Realizar la solicitud HTTP
    const response = await fetch(apiUrl.toString(), {
      cache: "no-store",
    });

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error("Error al obtener usuarios: " + response.statusText);
    }

    // Convertir la respuesta a JSON
    const userData = await response.json();

    // Filtrar los usuarios para que se muestren los operadores asociados con el cliente
    const usuariosFiltrados = userData.data.filter(usuario => {
      if (userProfile === '660ebaa7b02ce973cad66551') {
        // Si el usuario es un cliente, mostrar solo los operadores asociados
        return usuario.client === userId || usuario._id === userId;
      } else {
        // Para otros perfiles, mostrar todos los usuarios
        return true;
      }
    });

    return usuariosFiltrados;
  } catch (error) {
    // Lanzar una excepción para manejar el error en el código que llama a getUsers
    throw new Error("Error al obtener usuarios: " + error.message);
  }
}
