import React, { useEffect, useState } from 'react';
import Image from 'next/image';

async function fetchData() {
  try {
    const response = await fetch('/api/games');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return { error: 'Error al obtener los juegos' };
  }
}

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const data = await fetchData();
      if (!data.error) {
        setGames(data.data.games);
      }
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <>
      <h1>Lista de juegos</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {games.map(game => (
            <li key={game.id}>
              <h2>{game.name}</h2>
              <Image src={game.image} alt={game.name} width={500} height={500} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
