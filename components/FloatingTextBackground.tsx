"use client";

const texts = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 3.7 + (i % 5) * 8) % 100}%`,
  size: `${14 + ((i * 7) % 18)}px`,
  duration: `${12 + (i % 8)}s`,
  delay: `-${(i * 1.7) % 12}s`,
  opacity: 0.03 + ((i % 5) * 0.01),
}));

export default function FloatingTextBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {texts.map((text) => (
        <span
          key={text.id}
          className="absolute whitespace-nowrap font-serif text-white animate-fall select-none"
          style={{
            left: text.left,
            top: "-25%",
            fontSize: text.size,
            animationDuration: text.duration,
            animationDelay: text.delay,
            opacity: text.opacity,
            willChange: "transform, opacity",
          }}
        >
          lucas.rest
        </span>
      ))}
    </div>
  );
}