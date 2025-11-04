"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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
              console.warn(
                "Auto-play blocked by browser. User can click the toggle to play.",
              );
              setIsLoading(false);
              setIsPlaying(false);
              resolve();
            } else {
              console.error("❌ Audio play error:", err);
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
        console.error("Audio error:", e);
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
