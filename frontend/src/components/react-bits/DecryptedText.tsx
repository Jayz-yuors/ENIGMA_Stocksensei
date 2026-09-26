import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  encryptedClassName?: string;
  animateOnHover?: boolean;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~[]{}|;:,.<>?';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  className = '',
  encryptedClassName = 'text-cyan-400 font-mono',
  animateOnHover = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  const startAnimation = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration += 1 / (maxIterations / text.length || 1);

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (!animateOnHover) {
      return startAnimation();
    }
  }, [text, animateOnHover]);

  const handleMouseEnter = () => {
    if (animateOnHover && !isHovered) {
      setIsHovered(true);
      startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (animateOnHover) {
      setIsHovered(false);
    }
  };

  return (
    <span
      className={`inline-block transition-colors duration-200 ${className} ${isHovered ? encryptedClassName : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
};
