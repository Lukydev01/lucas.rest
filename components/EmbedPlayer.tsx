"use client";

type Props = {
  embedUrl: string;
};

export default function EmbedPlayer({ embedUrl }: Props) {
  const normalizedUrl = embedUrl.startsWith("//")
    ? `https:${embedUrl}`
    : embedUrl;

  return (
    <iframe
      src={normalizedUrl}
      className="w-full min-h-[80vh] rounded-2xl"
      allow="fullscreen *; autoplay *; encrypted-media *"
      allowFullScreen
      frameBorder="0"
      scrolling="no"
    />
  );
}