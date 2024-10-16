"use client";
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Belatra from '@/components/game/belatra';
import Bgaming from '@/components/game/bgaming';
import Aspect from '@/components/game/aspect';
import Booming from '@/components/game/Booming';
import PopOK from '@/components/game/PopOk';
import Igrosoft from '@/components/game/igrosoft';
import GameLayout from '@/components/game/GameLayout';
import { SocketProvider } from '@/app/api/socket/socketContext';
import { useEffect, useState, Suspense } from 'react';

const GamesContent: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');

  useEffect(() => {
    if (provider) {
      setVisibleSection(provider.toLowerCase());
    }
  }, [provider]);

  return (
    <GameLayout>
      {visibleSection === 'belatra' && <Belatra />}
      {visibleSection === 'bgaming' && <Bgaming />}
      {visibleSection === 'aspect' && <Aspect />}
      {visibleSection === 'booming' && <Booming />}
      {visibleSection === 'popok' && <PopOK />}
      {visibleSection === 'igrosoft' && <Igrosoft />}
    </GameLayout>
  );
};

const Games = dynamic(() => Promise.resolve(GamesContent), {
  ssr: false,
});

export default function GamesPage() {
  return (
    <SocketProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Games />
      </Suspense>
    </SocketProvider>
  );
}