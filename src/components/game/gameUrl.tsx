import React, { useState, useEffect } from "react";
import { FaRegRectangleXmark } from "react-icons/fa6";
import getSessionData from "@/controllers/getSession";

interface GameUrlProps {
  game: any; // Adjust the type according to your game object structure
  onClose: () => void;
}

const GameUrl: React.FC<GameUrlProps> = ({ game, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const { sessionToken } = getSessionData();

  useEffect(() => {
    const fetchGameUrl = async () => {
      try {
        const response = await fetch(
          `https://aggregator.casinoenruta.com/api/game?SessionToken=${sessionToken}&client_secret=9ffcfd63-e809-451c-9651-955c0622709d&user=1&username=usertest&balance=0&country=CL&currency=CLP&game=${game.id}&return_url=https://google.com&language=es_ES&mobile=false`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.status === "OK" && data.data.url) {
            setGameUrl(data.data.url);
            setShowVideo(true);
          } else {
            console.error("Error al obtener la URL del juego:", data);
          }
        } else {
          console.error("Error en la solicitud para obtener la URL del juego.");
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);
      }
    };

    if (game) {
      fetchGameUrl();
    }
  }, [game, sessionToken]);

  const closeGame = () => {
    onClose();
    setShowVideo(false);
  };

  return (
    <div id="crash">
      {showVideo && game && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(120, 0, 0, 0.9)", zIndex: 999 }}>
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(120, 0, 0, 0.9)", zIndex: 999 }}>
            <button onClick={closeGame} style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "white",
              minWidth: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
            }}>
              <FaRegRectangleXmark style={{ fontSize: '1.5em', color: "rgb(129, 18, 10)" }} />
            </button>
            <iframe
              title="Play Demo"
              src={gameUrl}
              className="fullscreen-video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUrl;
