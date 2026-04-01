"use client";

interface Props {
  embedUrl: string;
}

export default function VidmolyPlayer({ embedUrl }: Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe
        src={embedUrl}
        className="absolute inset-0 h-full w-full"
        scrolling="no"
        frameBorder="0"
        allow="fullscreen; autoplay"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}