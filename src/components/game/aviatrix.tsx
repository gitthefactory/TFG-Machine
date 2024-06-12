import React, { useState } from "react";

const Aviatrix: React.FC = () => {
  const videoUrl = "https://game.aviatrix.bet/?cid=demolanding";
  const [showVideo, setShowVideo] = useState(false);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const closeGame = () => {
    setShowVideo(false);
  };

  return (
    <div id="crash" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ position: "relative", textAlign: "center" }}>
        {!showVideo && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-4">
                <a className="btn-game" href="#" onClick={toggleVideo}>
                  <div style={{ width: "250px", height: "250px", position: "relative", zIndex: "1" }}>
                    <img src="images/img/aviatrix/aviatrix.jpg" alt="Aviatrix" />
                    <div className="subtitle">
                      AVIATRIX
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
        {showVideo && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <iframe
              title="Video Demo"
              src={videoUrl}
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
    </div>
  );
}

export default Aviatrix;
