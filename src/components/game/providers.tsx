import React, { useState, useEffect, useCallback } from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';
import getSessionData from "@/controllers/getSession";
import Loader from "@/components/common/Loader";

const Providers: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<{ [key: string]: number }>({});
  const [idMachine, setIdMachine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
  
        if (sessionData.status === 200) {
          const { id_machine } = sessionData.data.user;
          setIdMachine(id_machine); 


          const params = new URLSearchParams(window.location.search);
          const idMachineFromURL = params.get('idMachine');

          if (idMachineFromURL) {
            const response = await fetch(`http://localhost:3000/api/juegosApi/${idMachineFromURL}`);
            const data = await response.json();
  
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
    setLoading(true); 
    setVisibleSection(prevVisibleSection =>
      prevVisibleSection === provider ? null : provider
    );
    setTimeout(() => setLoading(false), 900); 
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      {loading && <Loader />} {/* Display loader if loading is true */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
          {visibleSection === 'bgaming' ? <Bgaming /> : <Belatra />}
        </div>
      )}
    </div>
  );
};

export default Providers;
