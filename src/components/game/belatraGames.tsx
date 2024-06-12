import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import socket from "@/app/api/socket";
import getGames from "@/controllers/getGames";

const Belatra: React.FC = () => {
  const [isChecked139, setIsChecked139] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGames("", 3);
        const belatraGames = response.games.filter((game: any) => game.provider === 29);
        setGames(belatraGames);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleWebSocket = (data: any) => {
      const { id, show } = data;
      if (games.some(game => game.id === id)) {
        setSelectedGame(show ? id : null);
        setShowVideo(show);
      }
    };
    socket.on("gameChange", handleWebSocket);

    return () => {
      socket.off("gameChange", handleWebSocket);
    };
  }, [games]);

  const toggleVideo = (gameId: number) => {
    setSelectedGame(gameId);
    setShowVideo(!showVideo);
    socket.emit("toggleGame", { id: gameId, show: !showVideo });
  };

  const closeGame = () => {
    setShowVideo(false);
    socket.emit("toggleGame", { id: selectedGame, show: false });
  };

  return (
    <div id="crash" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Swiper spaceBetween={100} slidesPerView={6}>
        {games.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-4">
                  <a className="btn-game" href="#" onClick={() => toggleVideo(game.id)}>
                    <div style={{ width: "250px", height: "250px", position: "relative", zIndex: "1" }}>
                      <img src={game.image} alt={game.name} />
                      <div className="subtitle">
                        {game.name}
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {showVideo && selectedGame && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <iframe
            title="Play Demo"
            src={games.find(game => game.id === selectedGame)?.url}
            width="1000"
            height="500" // Cambia este valor para ajustar el tamaño del video
            allowFullScreen
          ></iframe>
          <button onClick={closeGame} style={{ position: "absolute", top: "20px", right: "20px", background: "white", border: "none", cursor: "pointer", padding: "5px", color: "rgb(129, 18, 10)", fontWeight: "bold" }}>
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default Belatra;
