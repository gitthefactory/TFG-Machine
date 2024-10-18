import React, { useState, useEffect, useCallback } from "react";
import Splide from "@splidejs/splide";
import getSessionData from "@/controllers/getSession";
import { useRouter, useSearchParams } from "next/navigation";
import "@splidejs/splide/dist/css/splide.min.css";
import Link from "next/link";


const Providers: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [belatraStatus, setBelatraStatus] = useState<number | null>(null);
  const [bgamingStatus, setBgamingStatus] = useState<number | null>(null);
  const [aspectStatus, setAspectStatus] = useState<number | null>(null);
  const [boomingStatus, setBoomingStatus] = useState<number | null>(null);
  const [popokGameStatus, setPopokGameStatus] = useState<number | null>(null);
  const [igrosoftStatus, setIGROsoftStatus] = useState<number |null>(null);
  const [caletaStatus, setCaletaStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCaletaButton, setShowCaletaButton] = useState(false);
  const [showBelatraButton, setShowBelatraButton] = useState(false);
  const [showBgamingButton, setShowBgamingButton] = useState(false);
  const [showAspectButton, setShowAspectButton] = useState(false);
  const [showBoomingButton, setShowBoomingButton] = useState(false);
  const [popokGameButton, setShowPopokGameButton] = useState(false);
  const [igrosoftButton, setShowIGROsoftButton] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idMachine = searchParams.get("idMachine");
  const provider = searchParams.get("provider");

  useEffect(() => {
    if (idMachine && provider) {
      // Lógica para manejar la data basada en `idMachine` y `provider`
      console.log("idMachine:", idMachine);
      console.log("provider:", provider);
    }
  }, [idMachine, provider]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessionData = await getSessionData();

        if (sessionData.status === 200) {
          const providersResponse = await fetch(`/api/providers`);
          const providersData = await providersResponse.json();

          if (providersData.message === "Ok") {
            if (idMachine) {
              const response = await fetch(`/api/juegosApi/${idMachine}`);
              const data = await response.json();

              if (data.data && Array.isArray(data.data.providers)) {
                // Procesa los proveedores
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
                const igrosoftProvider = data.data.providers.find(
                  (p: any) => p.provider === 89
                );
                const caletaProvider = data.data.providers.find((p:any) => p.provider === 2);

                // Actualiza los estados de los proveedores según la respuesta
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
                if (igrosoftProvider) {
                  setIGROsoftStatus(igrosoftProvider.status);
                  setShowIGROsoftButton(
                    igrosoftProvider.status === 1 &&
                      providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "igrosoft games" &&
                          p.status === 1
                      )
                  );
                }
                if (caletaProvider) {
                  setShowCaletaButton(caletaProvider.status);
                  setShowCaletaButton(caletaProvider.status === 1 &&
                    providersData.data.some(
                        (p: any) =>
                          p.provider_name.toLowerCase() === "Caleta Gaming" &&
                          p.status === 1
                      )
  
                  );
                }
              } else {
                console.error("La API /api/juegosApi no devolvió un estado válido.");
              }
            } else {
              console.error("idMachine parameter not found in URL");
            }
          } else {
            console.error("La API /api/providers no devolvió un estado válido.");
          }
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idMachine]);

  const handleProvider = useCallback(
    (provider: string) => {
      if (idMachine) {
        router.push(`/provider?idMachine=${idMachine}&provider=${provider}`);
      } else {
        console.error("idMachine no está disponible en la consulta.");
      }
    },
    [idMachine, router]
  );

  useEffect(() => {
    const splide = new Splide("#splide", {
      type: "loop",
      perPage:6 ,
      breakpoints: {
        1280: {
          perPage: 3,
        },
      },
      focus: "center",
      autoplay: true,
      interval: 4000,
      flickMaxPages: 3,
      updateOnMove: true,
      pagination: false,
      padding: "10%",
      throttle: 300,
    }).mount();

    // Cleanup function to destroy Splide when the component unmounts
    return () => {
      splide.destroy();
    };
  }, []);

  return (
    <div id="splide" className="splide" style={{ textAlign: "center" }}>
      <div className="splide__track" /* style={{ display: "flex", justifyContent: "center" }} */>
        <ul className="splide__list">
          <Link href={`/games?idMachine=${idMachine}&provider=belatra`} className="splide__slide">
            <img src="/images/img/New-Providers/belatra.png" alt="belatra" />
          </Link>
          <Link href={`/games?idMachine=${idMachine}&provider=bgaming`} className="splide__slide">
            <img src="/images/img/New-Providers/bgaming.png" alt="Bgaming" />
          </Link>
          <Link href={`/games?idMachine=${idMachine}&provider=aspect`} className="splide__slide"  >
            <img src="/images/img/New-Providers/aspect.png" alt="Aspect" />
          </Link>
          <Link href={`/games?idMachine=${idMachine}&provider=booming`} className="splide__slide">
            <img src="/images/img/New-Providers/booming.png" alt="Booming" />
          </Link>
          <Link href={`/games?idMachine=${idMachine}&provider=popok`} className="splide__slide">
          <img src="/images/img/popok/popok.png" alt="" />
          </Link>
          <Link href={`/games?idMachine=${idMachine}&provider=igrosoft`} className="splide__slide">
          <img src="/images/img/igrosoft/igrosoft.png" alt="" />
          </Link>
          <Link href={`/games?idMachine=${idMachine}&provider=caleta`} className="splide__slide">
          <img src="/images/img/caleta/caleta.png" alt="" />
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Providers;
