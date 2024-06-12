"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import socket from "@/app/api/socket";
import getGames from "@/controllers/getGames";

const Paginas = () => {
  const [isChecked29, setisChecked29] = useState(true);
  const [gamesProvider29, setGamesProvider29] = useState<any[]>([]);
  const [gamesProvider68, setGamesProvider68] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
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
        const belatraGamesProvider29 = response.games.filter(
          (game: any) => game.provider === 29,
        );

        setGamesProvider29(belatraGamesProvider29);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedIsChecked = localStorage.getItem("isChecked29");
    if (storedIsChecked !== null) {
      setisChecked29(JSON.parse(storedIsChecked));
    }

    const handleCheckboxChange29 = ({ id, isChecked }) => {
      if (id === 29) {
        setisChecked29(isChecked);
        localStorage.setItem("isChecked29", JSON.stringify(isChecked));
      }
    };

    socket.on("checkboxChange", handleCheckboxChange29);

    return () => {
      socket.off("checkboxChange", handleCheckboxChange29);
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
      <div className="container">
        <div className="row" style={{ display: "flex" }}>
          {isChecked29 && (
            <div className="col-md-6">
              <h2>Juegos del proveedor 29</h2>
              <div className="row">
                {gamesProvider29
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
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Paginas;
