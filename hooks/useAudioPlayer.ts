"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { logger } from "@/lib/logger";

type UseAudioPlayerReturn = {
  play: (url: string) => Promise<void>;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
};

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async (url: string): Promise<void> => {
    // Validate URL before creating Audio object
    if (!url || url.trim() === "") {
      logger.warn("[useAudioPlayer] Cannot play audio: URL is empty");
      setError("No audio URL provided");

      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    const audio = new Audio(url);

    return new Promise<void>((resolve, reject) => {
      audio.addEventListener("loadeddata", () => {
        setIsLoading(false);
        audio
          .play()
          .then(() => resolve())
          .catch((err) => {
            if (err.name === "NotAllowedError") {
              logger.warn(
                "Auto-play blocked by browser. User can click the toggle to play.",
              );
              setIsLoading(false);
              setIsPlaying(false);
              resolve();
            } else {
              logger.error("❌ Audio play error:", err);
              setError("Failed to play audio");
              setIsLoading(false);
              reject(err);
            }
          });
      });

      audio.addEventListener("playing", () => {
        setIsPlaying(true);
        setIsLoading(false);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        audioRef.current = null;
      });

      audio.addEventListener("pause", () => {
        setIsPlaying(false);
      });

      audio.addEventListener("error", (e) => {
        logger.error("Audio error:", e);
        setError("Failed to load audio");
        setIsLoading(false);
        setIsPlaying(false);
        reject(e);
      });

      audioRef.current = audio;
    });
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    play,
    pause,
    stop,
    isPlaying,
    isLoading,
    error,
  };
};
