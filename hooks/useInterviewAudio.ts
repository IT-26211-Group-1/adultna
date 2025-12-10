import { useState, useCallback, useEffect } from "react";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import {
  useTextToSpeechAudio,
  useSpeechToText,
} from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { logger } from "@/lib/logger";

type InterviewAudioReturn = {
  tts: {
    isMuted: boolean;
    isPlaying: boolean;
    isLoadingAudio: boolean;
    audioUrl: string | undefined;
    toggleMute: () => void;
    stop: () => void;
  };
  stt: {
    isRecording: boolean;
    isTranscribing: boolean;
    audioBlob: Blob | null;
    recordingError: string | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    clearRecording: () => void;
    transcribeAndPoll: (
      audioBlob: Blob,
      jobRole?: string,
    ) => Promise<string | null>;
    startRealtimeRecognition: (onTranscript: (text: string) => void) => boolean;
    stopRealtimeRecognition: () => void;
  };
};

export function useInterviewAudio(
  currentQuestionText: string,
  userId: string,
  shouldFetchTTS: boolean = true,
): InterviewAudioReturn {
  const { getSecureItem, setSecureItem } = useSecureStorage();

  const [isMuted, setIsMuted] = useState(() => {
    const saved = getSecureItem("interview_tts_muted");

    return saved === "true";
  });

  const [isTranscribing, setIsTranscribing] = useState(false);

  const { play, stop, isPlaying } = useAudioPlayer();

  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    error: recordingError,
  } = useAudioRecorder();

  const shouldFetch = !isMuted && shouldFetchTTS && !!currentQuestionText;
  const { audioUrl, isLoadingAudio } = useTextToSpeechAudio(
    currentQuestionText,
    shouldFetch,
  );

  const {
    transcribeAndPoll: originalTranscribeAndPoll,
    startRealtimeRecognition,
    stopRealtimeRecognition,
  } = useSpeechToText(userId);

  useEffect(() => {
    if (audioUrl && !isMuted && currentQuestionText) {
      const timeout = setTimeout(async () => {
        try {
          await play(audioUrl);
        } catch {
          // Auto-play blocked by browser
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [audioUrl, isMuted, currentQuestionText, play]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;

    setIsMuted(newMuted);
    setSecureItem("interview_tts_muted", String(newMuted), 60 * 24 * 30);
    if (newMuted && isPlaying) {
      stop();
    }
  }, [isMuted, isPlaying, stop, setSecureItem]);

  const transcribeAndPoll = useCallback(
    async (audioBlob: Blob, jobRole?: string): Promise<string | null> => {
      setIsTranscribing(true);
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error("Transcription timeout after 60 seconds")),
            60000,
          );
        });

        const result = await Promise.race([
          originalTranscribeAndPoll(audioBlob, jobRole),
          timeoutPromise,
        ]);

        return result;
      } catch (error) {
        logger.error("[transcribeAndPoll] Error:", error);
        throw error;
      } finally {
        setIsTranscribing(false);
      }
    },
    [originalTranscribeAndPoll],
  );

  if (!userId || userId.trim() === "") {
    logger.warn("[useInterviewAudio] Invalid userId provided to audio hook");
  }

  return {
    tts: {
      isMuted,
      isPlaying,
      isLoadingAudio,
      audioUrl,
      toggleMute,
      stop,
    },
    stt: {
      isRecording,
      isTranscribing,
      audioBlob,
      recordingError,
      startRecording,
      stopRecording,
      clearRecording,
      transcribeAndPoll,
      startRealtimeRecognition,
      stopRealtimeRecognition,
    },
  };
}
