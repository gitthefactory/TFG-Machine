import React from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';
import Aspect from "./aspect";

interface ButtonsProps {
  onSelectProvider: (provider: { id: number, provider_name: string }) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ onSelectProvider }) => {
  const bgamingProps = { id: 68, provider_name: "Bgaming" };
  const belatraProps = { id: 29, provider_name: "Belatra" };
  const aspectProps = { id: 87, provider_name: "Aspect" };

  return (
    <div>
      <Bgaming onClick={() => onSelectProvider(bgamingProps)} />
      <Belatra onClick={() => onSelectProvider(belatraProps)} />
      <Aspect onClick={() => onSelectProvider(aspectProps)} />
    </div>
  );
}

export default Buttons;
