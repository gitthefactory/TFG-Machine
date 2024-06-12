import React, { useState, useCallback } from 'react';
import Bgaming from './bgaming';
import Belatra from './belatra';

const Providers: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const handleProvider = useCallback((provider: string) => {
    setVisibleSection(prevVisibleSection =>
      prevVisibleSection === provider ? null : provider
    );
  }, []);

  const providerComponents: { [key: string]: JSX.Element } = {
    bgaming: <Bgaming />,
    belatra: <Belatra />,
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {Object.keys(providerComponents).map(provider => (
          <button
            key={provider}
            className={`btn-provider ${provider}`}
            onClick={() => setVisibleSection(provider)}
            style={{ display: visibleSection ? 'none' : 'inline-block', margin: '0 5px' }}
          ></button>
        ))}
      </div>
      {visibleSection && (
        <div style={{ marginTop: '20px' }}>{providerComponents[visibleSection]}</div>
      )}
    </div>
  );
};

export default Providers;
