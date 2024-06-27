import React, { useState, useEffect, useCallback } from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';
import getSessionData from "@/controllers/getSession";
import Loader from "@/components/common/Loader";

const Providers: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<{ [key: string]: number }>({});
  const [idMachine, setIdMachine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to control loader visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        // console.log("Session Data:", sessionData);
  
        if (sessionData.status === 200) {
          const { id_machine } = sessionData.data.user;
          setIdMachine(id_machine); // Guardar id_machine en el estado

          // Obtener idMachine de la URL usando window.location.search
          const params = new URLSearchParams(window.location.search);
          const idMachineFromURL = params.get('idMachine');

          if (idMachineFromURL) {
            // console.log("idMachine from URL:", idMachineFromURL);
            // Aquí puedes usar idMachineFromURL en lugar de id_machine si es necesario
            const response = await fetch(`http://localhost:3000/api/juegosApi/${idMachineFromURL}`);
            const data = await response.json();
            // console.log("API Data:", data);
  
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
    setLoading(true); // Show loader when a button is clicked
    setVisibleSection(prevVisibleSection =>
      prevVisibleSection === provider ? null : provider
    );
    setTimeout(() => setLoading(false), 900); // Hide loader after 500ms or when the section is displayed
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
