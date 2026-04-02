"use client";

import { useEffect, useState } from "react";

type FloatingText = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

function generateTexts(): FloatingText[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 14 + Math.random() * 22,
    duration: 10 + Math.random() * 8,
    delay: -Math.random() * 8,
    opacity: 0.04 + Math.random() * 0.08,
  }));
}

export default function FloatingTextBackground() {
  const [texts, setTexts] = useState<FloatingText[]>([]);

  useEffect(() => {
    setTexts(generateTexts());
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {texts.map((text) => (
        <span
          key={text.id}
          className="absolute whitespace-nowrap text-white font-serif animate-fall"
          style={{
            left: `${text.left}%`,
            top: "-10%",
            fontSize: `${text.size}px`,
            animationDuration: `${text.duration}s`,
            animationDelay: `${text.delay}s`,
            opacity: text.opacity,
          }}
        >
          lucas.rest
        </span>
      ))}
    </div>
  );
}