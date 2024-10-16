"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Belatra from '@/components/game/belatra';
import Bgaming from '@/components/game/bgaming';
import Aspect from '@/components/game/aspect';
import Booming from '@/components/game/Booming';
import PopOK from '@/components/game/PopOk';
import Igrosoft from '@/components/game/igrosoft';
import GameLayout from '@/components/game/GameLayout';
import { SocketProvider } from '@/app/api/socket/socketContext';

const Games: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
 

  useEffect(() => {
    const provider = searchParams.get('provider');
    if (provider) {
      setVisibleSection(provider.toLowerCase());
    }
  }, [searchParams]);

  return (
    <SocketProvider>
      <GameLayout>
        {visibleSection === 'belatra' && <Belatra />}
        {visibleSection === 'bgaming' && <Bgaming />}
        {visibleSection === 'aspect' && <Aspect />}
        {visibleSection === 'booming' && <Booming />}
        {visibleSection === 'popok' && <PopOK />}
        {visibleSection === 'igrosoft' && <Igrosoft />}
      </GameLayout>
    </SocketProvider>
  );
};

export default Games;
