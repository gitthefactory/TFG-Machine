const ITEMS_PER_PAGE = 6;

export default async function getGames(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const response = await fetch(`http://localhost:3000/api/games?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });

    const games = await response.json();
    return games.data;
  } catch (error) {
    console.log(error);
    // Aquí puedes manejar el error según lo necesites
    throw new Error('Error al obtener juegos');
  }
}