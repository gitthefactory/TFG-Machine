

import React, { useState, useEffect, useRef } from 'react';
import './Keyboard.css';

interface KeyboardProps {
  onKeyPress: (character: string) => void;
  onClose: () => void; // Función para manejar el cierre del teclado
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onClose }) => {
  const [shift, setShift] = useState(false);
  const keyboardRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        onClose(); // Cerrar el teclado si se hace clic fuera de él
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleKeyClick = (character: string, isSpecial?: boolean) => {
    if (isSpecial) {
      switch (character) {
        case 'delete':
          onKeyPress('delete');
          return;
        case 'Close':
          onClose(); // Cierra el teclado al hacer clic en "Close"
          return;
      }
    }

    // Ajusta el carácter dependiendo del estado de shift
    const finalCharacter = shift ? character.toUpperCase() : character.toLowerCase();
    onKeyPress(finalCharacter);
    if (shift) setShift(false); // Desactiva shift después de usarlo
  };


  return (
    <div className="">
      <ul className="keyboard" ref={keyboardRef}>
       <li className='Close' onClick={() => handleKeyClick('Close', true)}>Close</li>
        {/* Primera fila */}
        <li className="symbol" onClick={() => handleKeyClick('1')}>1</li>
        <li className="symbol" onClick={() => handleKeyClick('2')}>2</li>
        <li className="symbol" onClick={() => handleKeyClick('3')}>3</li>
        <li className="symbol" onClick={() => handleKeyClick('4')}>4</li>
        <li className="symbol" onClick={() => handleKeyClick('5')}>5</li>
        <li className="symbol" onClick={() => handleKeyClick('6')}>6</li>
        <li className="symbol" onClick={() => handleKeyClick('7')}>7</li>
        <li className="symbol" onClick={() => handleKeyClick('8')}>8</li>
        <li className="symbol" onClick={() => handleKeyClick('9')}>9</li>
        <li className="symbol" onClick={() => handleKeyClick('0')}>0</li>
        <li className="delete" onClick={() => handleKeyClick('delete', true)}>delete</li>

        {/* Segunda fila */}
        <li className="letter" onClick={() => handleKeyClick('q')}>q</li>
        <li className="letter" onClick={() => handleKeyClick('w')}>w</li>
        <li className="letter" onClick={() => handleKeyClick('e')}>e</li>
        <li className="letter" onClick={() => handleKeyClick('r')}>r</li>
        <li className="letter" onClick={() => handleKeyClick('t')}>t</li>
        <li className="letter" onClick={() => handleKeyClick('y')}>y</li>
        <li className="letter" onClick={() => handleKeyClick('u')}>u</li>
        <li className="letter" onClick={() => handleKeyClick('i')}>i</li>
        <li className="letter" onClick={() => handleKeyClick('o')}>o</li>
        <li className="letter" onClick={() => handleKeyClick('p')}>p</li>

        {/* Tercera fila */}
        <li className="letter" onClick={() => handleKeyClick('a')}>a</li>
        <li className="letter" onClick={() => handleKeyClick('s')}>s</li>
        <li className="letter" onClick={() => handleKeyClick('d')}>d</li>
        <li className="letter" onClick={() => handleKeyClick('f')}>f</li>
        <li className="letter" onClick={() => handleKeyClick('g')}>g</li>
        <li className="letter" onClick={() => handleKeyClick('h')}>h</li>
        <li className="letter" onClick={() => handleKeyClick('j')}>j</li>
        <li className="letter" onClick={() => handleKeyClick('k')}>k</li>
        <li className="letter" onClick={() => handleKeyClick('l')}>l</li>

        {/* Cuarta fila */}
        <li className="letter" onClick={() => handleKeyClick('z')}>z</li>
        <li className="letter" onClick={() => handleKeyClick('x')}>x</li>
        <li className="letter" onClick={() => handleKeyClick('c')}>c</li>
        <li className="letter" onClick={() => handleKeyClick('v')}>v</li>
        <li className="letter" onClick={() => handleKeyClick('b')}>b</li>
        <li className="letter" onClick={() => handleKeyClick('n')}>n</li>
        <li className="letter" onClick={() => handleKeyClick('m')}>m</li>
      </ul>
    </div>
  );
};

export default Keyboard;