"use client";

interface Props {
  embedUrl: string;
}

export default function EmbedPlayer({ embedUrl }: Props) {
  const normalizedUrl = embedUrl.startsWith("//")
    ? `https:${embedUrl}`
    : embedUrl;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe
        src={normalizedUrl}
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