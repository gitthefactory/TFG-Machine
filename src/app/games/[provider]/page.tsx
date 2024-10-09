import { useRouter } from 'next/router';
import GameLayout from '@/components/game/GameLayout';
import Belatra from '@/components/game/belatra';
import Bgaming from '@/components/game/bgaming';
import Aspect from '@/components/game/aspect';
import Booming from '@/components/game/Booming';

const ProviderPage = () => {
  const router = useRouter();
  const { provider } = router.query;

  // Decide qué componente mostrar según el proveedor
  let ProviderComponent;

  switch (provider) {
    case 'belatra':
      ProviderComponent = Belatra;
      break;
    case 'bgaming':
      ProviderComponent = Bgaming;
      break;
    case 'aspect':
      ProviderComponent = Aspect;
      break;
    case 'booming':
      ProviderComponent = Booming;
      break;
    default:
      ProviderComponent = null;
  }

  return (
    <GameLayout>
       {ProviderComponent ? <ProviderComponent /> : <p>Loading...</p>}
    </GameLayout>
  
  );
};

export default ProviderPage;
