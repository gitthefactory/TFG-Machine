import React, { useState, useEffect, useCallback } from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';
import getSessionData from "@/controllers/getSession";

const Crash: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<{ [key: string]: number }>({});
  const [idMachine, setIdMachine] = useState<string | null>(null); // Estado para almacenar id_machine
  const [bgamingGames, setBgamingGames] = useState<any[]>([]);
  const [belatraGames, setBelatraGames] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        console.log("Session Data:", sessionData);

        if (sessionData.status === 200) {
          const { id_machine } = sessionData.data.user;
          setIdMachine(id_machine); // Guardar id_machine en el estado

          // Obtener idMachine de la URL usando window.location.search
          const params = new URLSearchParams(window.location.search);
          const idMachineFromURL = params.get('idMachine');

          if (idMachineFromURL) {
            console.log("idMachine from URL:", idMachineFromURL);
            // Aquí puedes usar idMachineFromURL en lugar de id_machine si es necesario
            const response = await fetch(`/api/juegosApi/${idMachineFromURL}`);
            const data = await response.json();
            console.log("API Data:", data);

            if (data.data && Array.isArray(data.data.games) && Array.isArray(data.data.providers)) {
              const belatraProvider = data.data.providers.find((p: any) => p.provider === 29);
              const bgamingProvider = data.data.providers.find((p: any) => p.provider === 68);

              if (belatraProvider) {
                setProvidersStatus(prevStatus => ({
                  ...prevStatus,
                  belatra: belatraProvider.status
                }));
              }

              if (bgamingProvider) {
                setProvidersStatus(prevStatus => ({
                  ...prevStatus,
                  bgaming: bgamingProvider.status
                }));
              }

              // Filtrar juegos por categoría "slots" y luego por status 1
              const filteredBgamingGames = data.data.games.filter((game: any) =>
                game.providerId === bgamingProvider?.provider && game.category === "slots" && game.status === 1
              );

              const filteredBelatraGames = data.data.games.filter((game: any) =>
                game.providerId === belatraProvider?.provider && game.category === "slots" && game.status === 1
              );

              setBgamingGames(filteredBgamingGames);
              setBelatraGames(filteredBelatraGames);

            } else {
              console.error("Unexpected data structure:", data);
            }
          } else {
            console.error("idMachine parameter not found in URL");
          }
        } else {
          console.error("User not authenticated:", sessionData.data.message);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProvider = useCallback((provider: string) => {
    setVisibleSection(prevVisibleSection =>
      prevVisibleSection === provider ? null : provider
    );
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        {Object.keys(providersStatus).map(provider => (
          providersStatus[provider] === 1 && (
            <button
              key={provider}
              className={`btn-provider ${provider}`}
              onClick={() => handleProvider(provider)}
              style={{ display: visibleSection ? 'none' : 'inline-block', margin: '0 5px' }}
            ></button>
          )
        ))}
      </div>
      {visibleSection && (
        <div style={{ marginTop: '20px' }}>
          {visibleSection === 'bgaming' ? <Bgaming games={bgamingGames} /> : <Belatra games={belatraGames} />}
        </div>
      )} */}
    </div>
  );
};

export default Crash;
