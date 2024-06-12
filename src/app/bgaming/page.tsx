"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import socket from "@/app/api/socket";
import getGames from "@/controllers/getGames";

const Paginas = () => {
  const [isChecked68, setisChecked68] = useState(true);
  const [gamesProvider68, setGamesProvider68] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  // const toggleVideo = (gameId: number) => {
  //   setSelectedGame(gameId);
  //   setShowVideo(!showVideo);
  //   socket.emit("toggleGame", { id: gameId, show: !showVideo });
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGames("", 3);
        const gamesProvider68 = response.games.filter(
          (game: any) => game.provider === 68,
        );

        setGamesProvider68(gamesProvider68);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);
  


  useEffect(() => {
  const storedIsChecked = localStorage.getItem("isChecked68");
  if (storedIsChecked !== null) {
    setisChecked68(JSON.parse(storedIsChecked));
  }

  const handleCheckboxChange68 = ({ id, isChecked }) => {
    if (id === 68) {
      setisChecked68(isChecked);
      localStorage.setItem("isChecked68", JSON.stringify(isChecked));
    }
  };

  socket.on("checkboxChange", handleCheckboxChange68);

  return () => {
    socket.off("checkboxChange", handleCheckboxChange68);
  };
}, []);

  
  
useEffect(() => {
  // Función que se ejecuta cuando el componente se desmonta
  return () => {
    // Limpiar el almacenamiento local
    localStorage.removeItem("useClient");
  };
}, []);

  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Test" />
      {isChecked68 && (
      <div className="container">
        <div className="row" style={{ display: "flex" }}>
        
          <div className="col-md-6">
            <h2>Juegos del proveedor 68</h2>
            <div className="row">
              {gamesProvider68
                .slice(startIndex, startIndex + 6)
                .map((game: any, index: number) => (
                  <div className="col-md-4" key={index}>
                    <a
                      className="btn-game"
                      href="#"
                      onClick={() => toggleVideo(game.id)}
                    >
                      <div
                        style={{
                          width: "250px",
                          height: "250px",
                          position: "relative",
                          zIndex: "1",
                        }}
                      >
                        <img
                          src={game.image}
                          alt={game.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div className="subtitle">
                          {game.name}
                          {game.id}
                        </div>
                      </div>
                    </a>
                    <div style={{ height: "20px" }}></div>
                  </div>
                ))}
            </div>
          </div>
          
        </div>
      </div>
      )}
    </DefaultLayout>
  );
};

export default Paginas;
