const ITEMS_PER_PAGE = 6;

export default async function getTransaction(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const response = await fetch(`/api/transaction?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });

    const transaction = await response.json();
    return transaction.data;
  } catch (error) {
    console.log(error);
    // Aquí puedes manejar el error según lo necesites
    throw new Error('Error al obtener Transacciones');
  }
}