"use client"
import { useRouter } from 'next/router';
import Belatra from '@/components/game/belatra';
import Bgaming from '@/components/game/bgaming';
import Aspect from '@/components/game/aspect';
import Booming from '@/components/game/Booming';
import PopOK from '@/components/game/PopOk';
import GameLayout from '@/components/game/GameLayout';
import { SocketProvider } from '@/app/api/socket/socketContext';


const Games: React.FC = () => {


  return (
    <SocketProvider>
    <GameLayout>
     <Bgaming />
    </GameLayout>
    </SocketProvider>
  );
};

export default Games;