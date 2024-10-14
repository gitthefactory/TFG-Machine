import { getSession } from 'next-auth/react';

const ITEMS_PER_PAGE = 6;

export default async function getClients(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const session = await getSession();

    if (session) {
      const user = session.user;
      const userId = user?._id;
      const typeProfile = user?.typeProfile;

      // Permitir el acceso completo si el typeProfile es '660ebaa7b02ce973cad66550'
      if (typeProfile === '660ebaa7b02ce973cad66550') {
        const response = await fetch(`/api/usuarios?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
          cache: "no-store",
        });

        const clients = await response.json();
        return clients.data;
      } else {
        const response = await fetch(`/api/usuarios?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
          cache: "no-store",
        });

        const clients = await response.json();

        // Filtrar los clientes que coinciden con el userId
        const filteredClients = clients.data.filter(client => client.user === userId);

        return filteredClients;
      }
    } else {
      // Usuario no autenticado
      console.error("User not authenticated");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
