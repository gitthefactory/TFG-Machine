const ITEMS_PER_PAGE = 6;

export default async function getProviders(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const response = await fetch(`/api/providers?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });

    const providers = await response.json();
    return providers.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener proveedores');
  }
}