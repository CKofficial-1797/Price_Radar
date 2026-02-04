import { useState } from 'react';
import {NavLink} from 'react-router';

interface CardProps {
  initialText: string;
  hoverText: string;
  initialColor: string; 
  hoverColor: string;  
  href: string;
  imageSrc: string;
}

function Card (
  { initialText, hoverText, initialColor, hoverColor, href, imageSrc }: CardProps
){
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-full h-56 md:h-72 lg:h-80 rounded-lg text-center cursor-pointer overflow-hidden shadow flex items-center justify-center transition-colors duration-300"
    >
      {/* Image */}
      <img
        src={imageSrc}
        alt="Card Image"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-50}`}
      />

      {/* Colored overlay that changes on hover */}
      <NavLink to={href}>
        <div
          className={`absolute inset-0 transition-colors duration-300 opacity-50 ${
            hover ? hoverColor : initialColor
          }`}></div>
      </NavLink>
      {/* Text */}
      <h2
        className={`relative z-10 text-4xl md:text-5xl font-semibold transition-colors duration-300 ${
          hover ? 'text-white' : 'text-black'
        }`}
      >
        {hover ? hoverText : initialText}
      </h2>
    </div>
  );
};

export default Card;
