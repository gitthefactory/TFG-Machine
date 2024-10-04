import React, { useState, useEffect, useCallback } from "react";
import Splide from '@splidejs/splide'; // Asegúrate de haber instalado Splide
import Bgaming from "./bgaming";
import Belatra from "./belatra";
import getSessionData from "@/controllers/getSession";
import Loader from "@/components/common/Loader";
import Aspect from "./aspect";
import Booming from "./Booming";
import PopOK from "./PopOk";
import '@splidejs/splide/dist/css/splide.min.css'; // Importa el CSS de Splide

const Providers: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [belatraStatus, setBelatraStatus] = useState<number | null>(null);
  const [bgamingStatus, setBgamingStatus] = useState<number | null>(null);
  const [aspectStatus, setAspectStatus] = useState<number | null>(null);
  const [boomingStatus, setBoomingStatus] = useState<number | null>(null);
  const [popokGameStatus, setPopokGameStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBelatraButton, setShowBelatraButton] = useState(false);
  const [showBgamingButton, setShowBgamingButton] = useState(false);
  const [showAspectButton, setShowAspectButton] = useState(false);
  const [showBoomingButton, setShowBoomingButton] = useState(false);
  const [popokGameButton, setShowPopokGameButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessionData = await getSessionData();

        if (sessionData.status === 200) {
          const { id_machine } = sessionData.data.user;
          const providersResponse = await fetch(`/api/providers`);
          const providersData = await providersResponse.json();

          if (providersData.message === "Ok") {
            const params = new URLSearchParams(window.location.search);
            const idMachineFromURL = params.get("idMachine");

            if (idMachineFromURL) {
              const response = await fetch(
                `/api/juegosApi/${idMachineFromURL}`
              );
              const data = await response.json();

              if (data.data && Array.isArray(data.data.providers)) {
                const belatraProvider = data.data.providers.find(
                  (p: any) => p.provider === 29
                );
                const bgamingProvider = data.data.providers.find(
                  (p: any) => p.provider === 68
                );
                const aspectProvider = data.data.providers.find(
                  (p: any) => p.provider === 87
                );
                const boomingProvider = data.data.providers.find(
                  (p: any) => p.provider === 12
                );
                const popokProvider = data.data.providers.find(
                  (p: any) => p.provider === 88
                );

                if (belatraProvider) {
                  setBelatraStatus(belatraProvider.status);
                  setShowBelatraButton(
                    belatraProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "belatra gaming" &&
                          p.status === 1
                      )
                  );
                }

                if (bgamingProvider) {
                  setBgamingStatus(bgamingProvider.status);
                  setShowBgamingButton(
                    bgamingProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "bgaming" &&
                          p.status === 1
                      )
                  );
                }
                if (aspectProvider) {
                  setAspectStatus(aspectProvider.status);
                  setShowAspectButton(
                    aspectProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "aspect gaming" &&
                          p.status === 1
                      )
                  );
                }
                if (boomingProvider) {
                  setBoomingStatus(boomingProvider.status);
                  setShowBoomingButton(
                    boomingProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "booming games" &&
                          p.status === 1
                      )
                  );
                }
                if (popokProvider) {
                  setPopokGameStatus(popokProvider.status);
                  setShowPopokGameButton(
                    popokProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "popok games" &&
                          p.status === 1
                      )
                  );
                }
              } else {
                console.error(
                  "La API /api/juegosApi no devolvió un estado válido."
                );
              }
            } else {
              console.error("idMachine parameter not found in URL");
            }
          } else {
            console.error(
              "La API /api/providers no devolvió un estado válido."
            );
          }
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProvider = useCallback((provider: string) => {
    setLoading(true);
    setVisibleSection(provider);
    setTimeout(() => setLoading(false), 900);
  }, []);

  useEffect(() => {
    const splide = new Splide('#splide', {
      type: 'loop',
      perPage: 5,
      breakpoints: {
        '1280': {
          perPage: 2,
        },
      },
      focus: 'center',
      autoplay: true,
      interval: 5000,
      flickMaxPages: 3,
      updateOnMove: true,
      pagination: false,
      padding: '10%',
      throttle: 300,
    });

    splide.mount();

    // Cleanup function to destroy the instance when the component unmounts
    return () => splide.destroy();
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <div id="splide" className="splide" style={{ textAlign: "center" }}>
      <div className="splide__track" style={{ display: "flex", justifyContent: "center" }}>
        <ul className="splide__list">
          <li className="splide__slide" onClick={() => handleProvider("belatra")}>
            <img src="/images/img/New-Providers/belatra.png" alt="Belatra" />
          </li>
          <li className="splide__slide" onClick={() => handleProvider("bgaming")}>
            <img src="/images/img/New-Providers/bgaming.png" alt="Bgaming" />
          </li>
          <li className="splide__slide" onClick={() => handleProvider("aspect")}>
            <img src="/images/img/New-Providers/aspect.png" alt="Aspect" />
          </li>
        {/*   {showAspectButton && (
            <button
              className="splide__slide"
              onClick={() => handleProvider("booming")}
              style={{
                display: visibleSection ? "none" : "inline-block",
                margin: "0 5px",
              }}
            > */}
          <li className="splide__slide" onClick={() => handleProvider("booming")}>
            <img src="/images/img/New-Providers/booming.png" alt="Booming" />
          </li>
          {/* Agrega más proveedores según sea necesario */}
        </ul>
      </div>
      {visibleSection && (
        <div className="section-content">
          {visibleSection === "belatra" && <Belatra />}
          {visibleSection === "bgaming" && <Bgaming />}
          {visibleSection === "aspect" && <Aspect />}
          {visibleSection === "booming" && <Booming />}
          {visibleSection === "popok" && <PopOK />}
        </div>
      )}
    </div>
  );
};

export default Providers;
