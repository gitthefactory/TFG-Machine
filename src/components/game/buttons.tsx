import React from "react";
import Bgaming from './bgaming';
import Belatra from './belatra';

interface ButtonsProps {
  onSelectProvider: (id: number) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ onSelectProvider }) => {
  // Define button props
  const bgamingProps = { id: 68, provider_name: "Bgaming" };
  const belatraProps = { id: 29, provider_name: "Belatra" };

  return (
    <div>
      {/* Pass onClick handler to select provider */}
      <Bgaming onClick={() => onSelectProvider(bgamingProps.id)} />
      <Belatra onClick={() => onSelectProvider(belatraProps.id)} />
    </div>
  );
}

export default Buttons;
