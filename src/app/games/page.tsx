"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import Belatra from '@/components/game/belatra';
import Bgaming from '@/components/game/bgaming';
import Aspect from '@/components/game/aspect';
import Booming from '@/components/game/Booming';
import PopOK from '@/components/game/PopOk';
import GameLayout from '@/components/game/GameLayout';
import { SocketProvider } from '@/app/api/socket/socketContext';
import { useEffect, useState } from 'react';

const Games: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');

  useEffect(() => {
    if (provider) {
      setVisibleSection(provider.toLowerCase());
    }
  }, [provider]);

  return (
    <SocketProvider>
      <GameLayout>
        {visibleSection === 'belatra' && <Belatra />}
        {visibleSection === 'bgaming' && <Bgaming />}
        {visibleSection === 'aspect' && <Aspect />}
        {visibleSection === 'booming' && <Booming />}
        {visibleSection === 'popok' && <PopOK />}
      </GameLayout>
    </SocketProvider>
  );
};

export default Games;