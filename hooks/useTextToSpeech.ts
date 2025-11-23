"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { logger } from "@/lib/logger";

type VoiceGender = "female";

type UseTextToSpeechOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voiceGender?: VoiceGender;
};

type UseTextToSpeechReturn = {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  isReady: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
};

export const useTextToSpeech = (
  options: UseTextToSpeechOptions = {},
): UseTextToSpeechReturn => {
  const {
    rate = 1,
    pitch = 1,
    volume = 1,
    lang = "en-US",
    voiceGender = "female",
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(
    null,
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();

        setVoices(availableVoices);

        // Auto-select Joanna or female voice only
        if (availableVoices.length > 0 && !currentVoice) {
          // Filter voices by language
          const languageVoices = availableVoices.filter((voice) =>
            voice.lang.startsWith(lang.split("-")[0]),
          );

          // First, try to find Joanna specifically
          const joannaVoice = languageVoices.find((voice) =>
            voice.name.toLowerCase().includes("joanna"),
          );

          // If Joanna not found, find any female voice
          const femaleVoice = languageVoices.find((voice) => {
            const name = voice.name.toLowerCase();

            return (
              name.includes("female") ||
              name.includes("samantha") ||
              name.includes("victoria") ||
              name.includes("karen") ||
              name.includes("zira") ||
              name.includes("susan") ||
              name.includes("salli") ||
              name.includes("kendra") ||
              name.includes("ivy") ||
              name.includes("emma") ||
              name.includes("amy") ||
              name.includes("woman")
            );
          });

          // Priority: Joanna > any female voice > first language voice
          setCurrentVoice(
            joannaVoice ||
              femaleVoice ||
              languageVoices[0] ||
              availableVoices[0],
          );
        }
      };

      loadVoices();

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      return () => {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, [lang, voiceGender, currentVoice]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSpeaking, isPaused]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text || !text.trim()) return;

      // Check if speech synthesis is available and not busy
      if (!window.speechSynthesis) {
        logger.warn("Speech synthesis not available");
        return;
      }

      // Stop any ongoing speech
      stop();

      const utterance = new SpeechSynthesisUtterance(text.trim());

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = lang;

      if (currentVoice) {
        utterance.voice = currentVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        // Browsers often block autoplay, which triggers this error silently
        // This is expected behavior and not a real error
        const errorType = event.error || "canceled";

        // Only log detailed errors for actual problems
        if (
          event.error &&
          event.error !== "canceled" &&
          event.error !== "interrupted"
        ) {
          logger.error("Speech synthesis error:", {
            error: event.error,
            type: event.type,
            text: text.substring(0, 50) + "...",
          });
        } else {
          // For expected cancellations, use debug level
          logger.warn("Speech synthesis canceled:", errorType);
        }

        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, pitch, volume, lang, currentVoice, stop],
  );

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const isReady = isSupported && currentVoice !== null;

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    isReady,
    voices,
    currentVoice,
    setVoice,
  };
};
