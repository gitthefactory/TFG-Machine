import React, { useState, useEffect, useCallback } from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';
import getSessionData from "@/controllers/getSession";
import Loader from "@/components/common/Loader";
import Aspect from "./aspect";

interface ProviderData {
  provider_name: string;
  status: number;
}

const Providers: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [belatraStatus, setBelatraStatus] = useState<number | null>(null);
  const [bgamingStatus, setBgamingStatus] = useState<number | null>(null);
  const [aspectStatus, setAspectStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBelatraButton, setShowBelatraButton] = useState(false);
  const [showBgamingButton, setShowBgamingButton] = useState(false);
  const [showAspectButton, setShowAspectButton] = useState(false);

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
            const idMachineFromURL = params.get('idMachine');

            if (idMachineFromURL) {
              const response = await fetch(`/api/juegosApi/${idMachineFromURL}`);
              const data = await response.json();

              if (data.data && Array.isArray(data.data.providers)) {
                const belatraProvider = data.data.providers.find((p: any) => p.provider === 29);
                const bgamingProvider = data.data.providers.find((p: any) => p.provider === 68);
                const aspectProvider = data.data.providers.find((p: any)=> p.provider === 87);

                if (belatraProvider) {
                  setBelatraStatus(belatraProvider.status);
                  setShowBelatraButton(belatraProvider.status === 1 && providersData.data.some((p: any) => p.provider_name.toLowerCase() === 'belatra gaming' && p.status === 1));
                }

                if (bgamingProvider) {
                  setBgamingStatus(bgamingProvider.status);
                  setShowBgamingButton(bgamingProvider.status === 1 && providersData.data.some((p: any) => p.provider_name.toLowerCase() === 'bgaming' && p.status === 1));
                }
                if (aspectProvider) {
                  setAspectStatus(aspectProvider.status);
                  setShowAspectButton(aspectProvider.status === 1 && providersData.data.some((p: any) => p.provider_name.toLowerCase() === 'aspect gaming' && p.status === 1));
                  console.log("AspectButton", aspectProvider)
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
  }, []);

  const handleProvider = useCallback((provider: string) => {
    setLoading(true);
    setVisibleSection(provider);
    setTimeout(() => setLoading(false), 900);
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      {loading && <Loader />}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {showBelatraButton && (
          <button
            className="btn-provider belatra"
            onClick={() => handleProvider('belatra')}
            style={{ display: visibleSection ? 'none' : 'inline-block', margin: '0 5px' }}
          >
           
          </button>
        )}
        {showBgamingButton && (
          <button
            className="btn-provider bgaming"
            onClick={() => handleProvider('bgaming')}
            style={{ display: visibleSection ? 'none' : 'inline-block', margin: '0 5px' }}
          >
            
          </button>
        )}
       {showAspectButton && (
  <button
    className="btn-provider aspect"
    onClick={() => handleProvider('aspect')}
    style={{ display: visibleSection ? 'none' : 'inline-block', margin: '0 5px' }}
  >

  </button>
)}
      </div>
      {visibleSection && (
        <div style={{ marginTop: '20px' }}>
         {visibleSection === 'belatra' && <Belatra />}
         {visibleSection === 'bgaming' && <Bgaming />}
         {visibleSection === 'aspect' && <Aspect/>}
        </div>
      )}
    </div>
    
  );
};

export default Providers;
