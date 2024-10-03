import React, { useState, useEffect, useCallback } from "react";
import Bgaming from "./bgaming";
import Belatra from "./belatra";
import getSessionData from "@/controllers/getSession";
import Loader from "@/components/common/Loader";
import Aspect from "./aspect";
import Booming from "./Booming";
import PopOK from "./PopOk";
import "/src/css/splide.min.css"

interface ProviderData {
  provider_name: string;
  status: number;
}

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
                `/api/juegosApi/${idMachineFromURL}`,
              );
              const data = await response.json();

              if (data.data && Array.isArray(data.data.providers)) {
                const belatraProvider = data.data.providers.find(
                  (p: any) => p.provider === 29,
                );
                const bgamingProvider = data.data.providers.find(
                  (p: any) => p.provider === 68,
                );
                const aspectProvider = data.data.providers.find(
                  (p: any) => p.provider === 87,
                );
                const boomingProvider = data.data.providers.find(
                  (p: any) => p.provider === 12,
                );

                const popokProvider = data.data.providers.find(
                  (p: any) => p.provider === 88,
                );

                if (belatraProvider) {
                  setBelatraStatus(belatraProvider.status);
                  setShowBelatraButton(
                    belatraProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "belatra gaming" &&
                          p.status === 1,
                      ),
                  );
                }

                if (bgamingProvider) {
                  setBgamingStatus(bgamingProvider.status);
                  setShowBgamingButton(
                    bgamingProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "bgaming" &&
                          p.status === 1,
                      ),
                  );
                }
                if (aspectProvider) {
                  setAspectStatus(aspectProvider.status);
                  setShowAspectButton(
                    aspectProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "aspect gaming" &&
                          p.status === 1,
                      ),
                  );
                  console.log("AspectButton", aspectProvider);
                }
                if (boomingProvider) {
                  setBoomingStatus(boomingProvider.status);
                  setShowBoomingButton(
                    boomingProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "booming games" &&
                          p.status === 1,
                      ),
                  );
                }
                if (popokProvider) {
                  setPopokGameStatus(popokProvider.status);
                  setShowPopokGameButton(
                    popokProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "popok games" &&
                          p.status === 1,
                      ),
                  );
                  console.log("Popok Button", popokProvider);
                }
              } else {
                console.error(
                  "La API /api/juegosApi no devolvió un estado válido.",
                );
              }
            } else {
              console.error("idMachine parameter not found in URL");
            }
          } else {
            console.error(
              "La API /api/providers no devolvió un estado válido.",
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

  return (
    <div id="splide" className="splide" style={{ textAlign: "center" }}>
      <div
        className="splide__track"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ul className="splide__list">
          {showBelatraButton && (
            <li
              className="splide__slide"
              onClick={() => handleProvider("belatra")}
              style={{
                display: visibleSection ? "none" : "inline-block",
                margin: "0 5px",
              }}
            >
              <img src="/images/img/New-Providers/belatra.png" />
            </li>
          )}
          {showBgamingButton && (
            <button
              className="splide__slide"
              onClick={() => handleProvider("bgaming")}
              style={{
                display: visibleSection ? "none" : "inline-block",
                margin: "0 5px",
              }}
            >
              <img src="/images/img/New-Providers/bgaming.png" />
            </button>
          )}
          {showAspectButton && (
            <button
              className="splide__slide"
              onClick={() => handleProvider("aspect")}
              style={{
                display: visibleSection ? "none" : "inline-block",
                margin: "0 5px",
              }}
            >
              <img src="/images/img/New-Providers/aspect.png" />
            </button>
          )}
          {showAspectButton && (
            <button
              className="splide__slide"
              onClick={() => handleProvider("booming")}
              style={{
                display: visibleSection ? "none" : "inline-block",
                margin: "0 5px",
              }}
            >
              <img src="/images/img/New-Providers/booming.png" />
            </button>
          )}
          {/* {showAspectButton && (
  <button
    className="splide__slide"
    onClick={() => handleProvider('popok')}
    style={{ display: visibleSection ? 'none' : 'inline-block', margin: '0 5px' }}
  ><img src="public/images/img/New-Providers/igrosoft.png"/></button>
)} */}
        </ul>
      </div>
      {visibleSection && (
        <div className="splide">
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
