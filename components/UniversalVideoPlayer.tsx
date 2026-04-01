"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

interface Props {
  videoId?: string | null;
  src?: string | null;
}

export default function UniversalVideoPlayer({
  videoId,
  src,
}: Props) {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add(
      "vjs-big-play-centered",
      "w-full"
    );

    videoRef.current.innerHTML = "";
    videoRef.current.appendChild(videoElement);

    const isYoutube = !!videoId;

    playerRef.current = videojs(videoElement, {
      controls: true,
      responsive: true,
      fluid: true,
      aspectRatio: "16:9",
      playbackRates: [0.5, 1, 1.5, 2],
      ...(isYoutube && {
        techOrder: ["youtube"],
        youtube: {
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
      }),
      sources: [
        isYoutube
          ? {
              src: `https://www.youtube.com/watch?v=${videoId}`,
              type: "video/youtube",
            }
          : {
              src: src!,
              type: "video/mp4",
            },
      ],
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoId, src]);

  return <div data-vjs-player ref={videoRef} />;
}