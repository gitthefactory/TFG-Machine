  "use client";

  import React, { useEffect, useState } from 'react';
  
  const Proveedores: React.FC = () => {
    const [machineData, setMachineData] = useState<any>(null); // Estado para almacenar los datos de la máquina
  
    useEffect(() => {
      const fetchMachineData = async () => {
        try {
          // Obtener el ID de la máquina de la URL
          const pathArray = window.location.pathname.split('/');
          const machineId = pathArray[pathArray.length - 1];
  
          // Realizar la solicitud HTTP con el ID de la máquina
          const response = await fetch(`/api/juegosApi/66479f0a812cec0bc3d0496a`);
          if (!response.ok) {
            throw new Error('Error al obtener los datos de la máquina');
          }
          const data = await response.json();
          setMachineData(data.data);
          // console.log('Información de la máquina:', data.data); // Imprimir los datos por console.log
          console.log('juegos:', data.data.games[0]);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchMachineData();
    }, []);
  
    return (
      <>
        {machineData && (
          <div>
            <h2>{machineData.nombre}</h2>
            <p>{machineData.descripcion}</p>           

            <ul>
              {machineData.games.map((group: any) => (
                <li key={group._id}>
                  <h3>Grupo de Juegos</h3>
                  <ul>
                    {group.games.map((game: any) => (
                      <li key={game._id}>
                        <h4>{game.name}</h4>
                        <p>Creador: {game.maker}</p>
                        <p>Categoría: {game.category}</p>
                        <img src={game.image} alt={game.name} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };
  
  export default Proveedores;
  