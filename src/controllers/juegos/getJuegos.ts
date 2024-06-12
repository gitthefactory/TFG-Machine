import { getSession } from "next-auth/react";
import fetch from 'node-fetch';

const ITEMS_PER_PAGE = 6;

export default async function getJuegos(userId: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Obtener la sesión del usuario actual
    const session = await getSession();

    if (!session) {
      throw new Error('Usuario no autenticado.');
    }

    // Obtener la máquina asociada al usuario
    const responseMaquinas = await fetch(`http://localhost:3000/api/maquinas/${userId}`);
    const maquinaSeleccionada = await responseMaquinas.json();

    if (!maquinaSeleccionada) {
      throw new Error('La máquina seleccionada no existe para este usuario.');
    }

    // Verificar si el usuario es un administrador
    const isAdmin = session.user?.typeProfile === '660ebaa7b02ce973cad66550';

    if (isAdmin) {
      // Si el usuario es administrador, obtener juegos de la API de juegos
      const responseJuegos = await fetch(`http://localhost:3000/api/juegosApi?query=&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
        cache: "no-store",
      });
      const juegos = await responseJuegos.json();
      return juegos.data;
    } else {
      // Si el usuario no es administrador, obtener los juegos de la máquina seleccionada
      const juegosMaquina = maquinaSeleccionada.games;
      
      // Filtrar los juegos del usuario para devolver solo aquellos con la propiedad checked establecida como true
      const juegosUsuario = juegosMaquina.filter(juego => juego.checked === true);
      
      // Calcular el índice de inicio y el índice de finalización para la paginación
      const startIndex = offset;
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, juegosUsuario.length);
      
      // Devolver los juegos del usuario dentro del rango de la página actual
      return juegosUsuario.slice(startIndex, endIndex);
    }
  } catch (error) {
    // Manejar el error según lo necesites
    throw new Error('Error al obtener juegos');
  }
}
