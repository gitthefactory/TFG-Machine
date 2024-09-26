import React from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';
import Aspect from "./aspect";
import Booming from './Booming';
import Popok from './PopOk';

interface ButtonsProps {
  onSelectProvider: (provider: { id: number, provider_name: string }) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ onSelectProvider }) => {
  const bgamingProps = { id: 68, provider_name: "Bgaming" };
  const belatraProps = { id: 29, provider_name: "Belatra" };
  const aspectProps = { id: 87, provider_name: "Aspect" };
  const boomingPros = { id: 12, provider_name: "Booming Games" };

  return (
    <div>
      <Bgaming onClick={() => onSelectProvider(bgamingProps)} />
      <Belatra onClick={() => onSelectProvider(belatraProps)} />
      <Aspect onClick={() => onSelectProvider(aspectProps)} />
      <Booming onClick={() => onSelectProvider(boomingPros)}/>
      <Popok onClick={() => onSelectProvider(boomingPros)}/>  
      
    </div>
  );
}

export default Buttons;
