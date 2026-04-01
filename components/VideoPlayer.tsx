"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

interface Props {
  videoId: string;
}

export default function VideoPlayer({ videoId }: Props) {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add(
        "vjs-big-play-centered",
        "vjs-16-9",
        "w-full"
      );

      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        techOrder: ["youtube"],
        sources: [
          {
            src: `https://www.youtube.com/watch?v=${videoId}`,
            type: "video/youtube",
          },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  return <div data-vjs-player ref={videoRef} />;
}