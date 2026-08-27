import { useState, useEffect, useRef } from 'react';

const CHARS = '01✦✧x+*◇▲<>_/#~=';

export default function TextScramble({
  text = '',
  className = '',
  triggerOnHover = true,
  triggerOnMount = false,
  speed = 30,
  as: Component = 'span',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length * 2;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 2) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1;
    }, speed);
  };

  useEffect(() => {
    if (triggerOnMount) {
      scramble();
    } else {
      setDisplayText(text);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <Component
      onMouseEnter={triggerOnHover ? scramble : undefined}
      className={`inline-block select-none cursor-default font-inherit ${className}`}
      {...props}
    >
      {displayText}
    </Component>
  );
}
