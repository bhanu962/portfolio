import { useState, useEffect, useRef, useCallback } from 'react';

const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>~';

export default function TextScramble({
  text = '',
  className = '',
  triggerOnHover = true,
  triggerOnMount = true,
  duration = 300, // Exactly 0.3 second cipher animation (300ms)
  as: Component = 'span',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const scramble = useCallback(() => {
    if (!text) return;
    setIsScrambling(true);
    startTimeRef.current = performance.now();

    const updateFrame = (now) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);

      const resolvedLength = Math.floor(progress * text.length);

      const nextText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < resolvedLength) {
            return text[index];
          }
          // Scrambled cipher character
          return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
        })
        .join('');

      setDisplayText(nextText);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
        animFrameRef.current = null;
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(updateFrame);
  }, [text, duration]);

  useEffect(() => {
    if (triggerOnMount) {
      scramble();
    } else {
      setDisplayText(text);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [text, triggerOnMount, scramble]);

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
