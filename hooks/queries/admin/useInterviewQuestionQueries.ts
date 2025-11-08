"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import type {
  ListQuestionsParams,
  ListQuestionsResponse,
  CreateQuestionRequest,
  CreateQuestionResponse,
  UpdateQuestionRequest,
  UpdateQuestionResponse,
  UpdateQuestionStatusRequest,
  UpdateQuestionStatusResponse,
  DeleteQuestionResponse,
  RestoreQuestionResponse,
  GenerateAIQuestionRequest,
  GenerateAIQuestionResponse,
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/types/interview-question";

// API Functions
const questionApi = {
  list: (params?: ListQuestionsParams): Promise<ListQuestionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append("category", params.category);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.source) queryParams.append("source", params.source);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const query = queryParams.toString();

    return ApiClient.get(`/interview-questions${query ? `?${query}` : ""}`);
  },

  create: (data: CreateQuestionRequest): Promise<CreateQuestionResponse> =>
    ApiClient.post("/interview-questions", data),

  update: (data: UpdateQuestionRequest): Promise<UpdateQuestionResponse> =>
    ApiClient.put(`/interview-questions/${data.questionId}`, {
      question: data.question,
      category: data.category,
      industry: data.industry,
      jobRoles: data.jobRoles,
      source: data.source,
    }),

  updateStatus: (
    data: UpdateQuestionStatusRequest,
  ): Promise<UpdateQuestionStatusResponse> =>
    ApiClient.patch(`/interview-questions/${data.questionId}/status`, {
      status: data.status,
      reason: data.reason,
    }),

  softDelete: (questionId: string): Promise<DeleteQuestionResponse> =>
    ApiClient.delete(`/interview-questions/${questionId}`),

  restore: (questionId: string): Promise<RestoreQuestionResponse> =>
    ApiClient.post(`/interview-questions/${questionId}/restore`, {}),

  permanentDelete: (questionId: string): Promise<DeleteQuestionResponse> =>
    ApiClient.delete(`/interview-questions/${questionId}/permanent`),

  generateAI: (
    data: GenerateAIQuestionRequest,
  ): Promise<GenerateAIQuestionResponse> =>
    ApiClient.post("/interview-questions/generate-ai", data),

  getIndustries: (): Promise<{
    success: boolean;
    message: string;
    data: string[];
  }> => ApiClient.get("/interview-questions/industries"),

  getAudioUrl: (
    questionId: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      audioUrl: string;
      cached: boolean;
    };
  }> => ApiClient.get(`/interview-questions/${questionId}/speech`),

  synthesizeText: (
    text: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      audioUrl: string;
      cached: boolean;
    };
  }> => ApiClient.post("/tts/synthesize", { text }),

  createSession: (data: CreateSessionRequest): Promise<CreateSessionResponse> =>
    ApiClient.post("/interview-sessions", data),

  // Get presigned URL for direct S3 upload
  getPresignedUrl: (data: {
    userId: string;
    format?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      uploadUrl: string;
      s3Key: string;
      jobName: string;
    };
  }> => ApiClient.post("/transcribe/presigned-url", data),

  // Start transcription with S3 key
  startTranscription: (data: {
    jobName: string;
    s3Key: string;
    userId: string;
    format?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      jobName: string;
      status: string;
    };
  }> => ApiClient.post("/transcribe/start", data),

  // Transcribe audio to text (Speech-to-Text) - Legacy
  transcribeAudio: (data: {
    userId: string;
    audioData: string;
    format?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      jobName: string;
      status: string;
    };
  }> => ApiClient.post("/transcribe", data),

  // Get transcription result
  getTranscription: (
    jobName: string,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      status: string;
      transcript?: string;
    };
  }> => ApiClient.get(`/transcribe/result?jobName=${jobName}&userId=${userId}`),
};

// Query Hooks
export function useInterviewQuestions(params?: ListQuestionsParams) {
  const queryClient = useQueryClient();

  // List Questions Query
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["admin", "interview-questions", "list", params],
    queryFn: () => questionApi.list(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create Question Mutation
  const createQuestionMutation = useMutation({
    mutationFn: questionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  // Update Question Mutation
  const updateQuestionMutation = useMutation({
    mutationFn: questionApi.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "interview-questions",
          "detail",
          variables.questionId,
        ],
      });
    },
  });

  // Update Question Status Mutation
  const updateQuestionStatusMutation = useMutation({
    mutationFn: questionApi.updateStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "interview-questions",
          "detail",
          variables.questionId,
        ],
      });
    },
  });

  // Soft Delete Mutation
  const softDeleteQuestionMutation = useMutation({
    mutationFn: questionApi.softDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  // Restore Mutation
  const restoreQuestionMutation = useMutation({
    mutationFn: questionApi.restore,
    onSuccess: (data, questionId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions", "detail", questionId],
      });
    },
  });

  // Permanent Delete Mutation
  const permanentDeleteQuestionMutation = useMutation({
    mutationFn: questionApi.permanentDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  // Generate AI Question Mutation
  const generateAIQuestionMutation = useMutation({
    mutationFn: questionApi.generateAI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  return {
    // Data
    questions: questionsData?.data?.questions || [],
    total: questionsData?.data?.total || 0,
    questionsData,

    // Loading states
    isLoadingQuestions,
    isCreatingQuestion: createQuestionMutation.isPending,
    isUpdatingQuestion: updateQuestionMutation.isPending,
    isUpdatingStatus: updateQuestionStatusMutation.isPending,
    isDeleting: softDeleteQuestionMutation.isPending,
    isPermanentDeleting: permanentDeleteQuestionMutation.isPending,
    isRestoring: restoreQuestionMutation.isPending,
    isGeneratingAI: generateAIQuestionMutation.isPending,

    // Errors
    questionsError,
    createQuestionError: createQuestionMutation.error,
    updateQuestionError: updateQuestionMutation.error,
    updateStatusError: updateQuestionStatusMutation.error,
    deleteQuestionError:
      softDeleteQuestionMutation.error || permanentDeleteQuestionMutation.error,
    restoreQuestionError: restoreQuestionMutation.error,
    generateAIError: generateAIQuestionMutation.error,

    // Actions
    createQuestion: createQuestionMutation.mutate,
    createQuestionAsync: createQuestionMutation.mutateAsync,
    updateQuestion: updateQuestionMutation.mutate,
    updateQuestionAsync: updateQuestionMutation.mutateAsync,
    updateQuestionStatus: updateQuestionStatusMutation.mutate,
    updateQuestionStatusAsync: updateQuestionStatusMutation.mutateAsync,
    softDeleteQuestion: softDeleteQuestionMutation.mutate,
    softDeleteQuestionAsync: softDeleteQuestionMutation.mutateAsync,
    restoreQuestion: restoreQuestionMutation.mutate,
    restoreQuestionAsync: restoreQuestionMutation.mutateAsync,
    permanentDeleteQuestion: permanentDeleteQuestionMutation.mutate,
    permanentDeleteQuestionAsync: permanentDeleteQuestionMutation.mutateAsync,
    generateAIQuestion: generateAIQuestionMutation.mutate,
    generateAIQuestionAsync: generateAIQuestionMutation.mutateAsync,
    refetchQuestions,

    // Mutation data
    createQuestionData: createQuestionMutation.data,
    updateQuestionData: updateQuestionMutation.data,
    updateStatusData: updateQuestionStatusMutation.data,
    generateAIData: generateAIQuestionMutation.data,
  };
}

// Hook for fetching industries from approved questions
export function useQuestionIndustries() {
  const {
    data: industriesData,
    isLoading: isLoadingIndustries,
    error: industriesError,
    refetch: refetchIndustries,
  } = useQuery({
    queryKey: ["admin", "interview-questions", "industries"],
    queryFn: questionApi.getIndustries,
    staleTime: 10 * 60 * 1000, // 10 minutes (industries don't change often)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    industries: industriesData?.data || [],
    isLoadingIndustries,
    industriesError,
    refetchIndustries,
  };
}

// Hook for fetching audio URL for a specific question (AWS Polly TTS)
export function useQuestionAudio(questionId: string, enabled: boolean = false) {
  const {
    data: audioData,
    isLoading: isLoadingAudio,
    error: audioError,
    refetch: refetchAudio,
  } = useQuery({
    queryKey: ["admin", "interview-questions", "audio", questionId],
    queryFn: () => questionApi.getAudioUrl(questionId),
    enabled, // Only fetch when explicitly enabled
    staleTime: Infinity, // Audio URLs are cached in S3, so they never become stale
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });

  return {
    audioUrl: audioData?.data?.audioUrl,
    isCached: audioData?.data?.cached || false,
    isLoadingAudio,
    audioError,
    refetchAudio,
  };
}

// Hook for synthesizing generic text to speech (AWS Polly TTS)
export function useTextToSpeechAudio(text: string, enabled: boolean = false) {
  const {
    data: audioData,
    isLoading: isLoadingAudio,
    error: audioError,
    refetch: refetchAudio,
  } = useQuery({
    queryKey: ["tts", "audio", text],
    queryFn: () => questionApi.synthesizeText(text),
    enabled: enabled && !!text, // Only fetch when explicitly enabled and text is provided
    staleTime: Infinity, // Audio URLs are cached in S3, so they never become stale
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });

  return {
    audioUrl: audioData?.data?.audioUrl,
    isCached: audioData?.data?.cached || false,
    isLoadingAudio,
    audioError,
    refetchAudio,
  };
}

// Hook for creating an interview session
export function useCreateInterviewSession() {
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: questionApi.createSession,
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({
        queryKey: ["interview-sessions"],
      });
    },
  });

  return {
    createSession: createSessionMutation.mutate,
    createSessionAsync: createSessionMutation.mutateAsync,
    isCreatingSession: createSessionMutation.isPending,
    createSessionError: createSessionMutation.error,
    sessionData: createSessionMutation.data,
  };
}

// Hook for speech-to-text transcription (Hybrid Approach)
export function useSpeechToText(userId: string) {
  const [isListening, setIsListening] = useState(false);
  const [realtimeTranscript, setRealtimeTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Transcribe audio mutation (for final AWS Transcribe accuracy)
  const transcribeMutation = useMutation({
    mutationFn: questionApi.transcribeAudio,
  });

  // Check if Web Speech Recognition is supported
  const isSpeechRecognitionSupported = useCallback(() => {
    if (typeof window === "undefined") return false;

    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }, []);

  // Start real-time speech recognition using Web Speech API
  const startRealtimeRecognition = useCallback(
    (onTranscriptUpdate: (transcript: string) => void) => {
      // Check if running in browser
      if (typeof window === "undefined") {
        console.warn("Speech recognition only works in browser");

        return false;
      }

      // Check for Speech Recognition API
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn(
          "Real-time transcription not supported in this browser. Using AWS Transcribe only.",
        );

        return false;
      }

      try {
        const recognition = new SpeechRecognition();

        recognition.continuous = true; // Keep listening
        recognition.interimResults = true; // Get partial results for instant feedback
        recognition.lang = "en-US";

        let finalTranscript = "";

        recognition.onresult = (event: any) => {
          let interimTranscript = "";

          // Loop through results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              // Final result - append to permanent transcript
              finalTranscript += transcript + " ";
            } else {
              // Interim result - show temporarily
              interimTranscript += transcript;
            }
          }

          // Combine final and interim for real-time display
          const fullTranscript = (finalTranscript + interimTranscript).trim();

          setRealtimeTranscript(fullTranscript);
          onTranscriptUpdate(fullTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error, event);

          // Handle specific errors
          if (
            event.error === "not-allowed" ||
            event.error === "permission-denied"
          ) {
            alert(
              "Microphone access denied. Please allow microphone access in your browser settings.",
            );
          } else if (event.error === "no-speech") {
            console.warn("No speech detected. Please try speaking again.");
          } else if (event.error === "network") {
            console.error(
              "Network error. Please check your internet connection.",
            );
          } else if (event.error === "aborted") {
            console.warn("Speech recognition aborted.");
          } else {
            console.error(`Speech recognition error: ${event.error}`);
          }

          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onstart = () => {};

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);

        return true;
      } catch (error) {
        console.error("Failed to start speech recognition:", error);

        return false;
      }
    },
    [],
  );

  // Stop real-time speech recognition
  const stopRealtimeRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setRealtimeTranscript("");
  }, []);

  // Poll for transcription result with exponential backoff + jitter
  const pollTranscription = async (jobName: string): Promise<string> => {
    const maxAttempts = 60;
    const delays = [500, 1000, 1500, 2000, 3000, 5000];

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await questionApi.getTranscription(jobName, userId);

        if (result.data.status === "COMPLETED" && result.data.transcript) {
          return result.data.transcript;
        }

        if (result.data.status === "FAILED") {
          throw new Error("Transcription failed");
        }

        const baseDelay = delays[Math.min(attempt, delays.length - 1)];
        const jitter = Math.random() * 500;
        const delayMs = baseDelay + jitter;

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } catch (error: any) {
        if (
          error?.message?.includes("429") ||
          error?.message?.includes("rate limit")
        ) {
          const backoffDelay = Math.min(10000, 1000 * Math.pow(2, attempt));

          console.warn(`Rate limited, backing off for ${backoffDelay}ms`);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        } else if (attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }

    throw new Error("Transcription timed out");
  };

  // Combined transcribe and poll (AWS Transcribe with presigned URL)
  const transcribeAndPoll = async (audioBlob: Blob): Promise<string> => {
    const format = "webm";

    const presignedResult = await questionApi.getPresignedUrl({
      userId,
      format,
    });

    const { uploadUrl, s3Key, jobName } = presignedResult.data;

    await fetch(uploadUrl, {
      method: "PUT",
      body: audioBlob,
      headers: {
        "Content-Type": audioBlob.type || "audio/webm",
      },
    });

    await questionApi.startTranscription({
      jobName,
      s3Key,
      userId,
      format,
    });

    const transcript = await pollTranscription(jobName);

    return transcript;
  };

  return {
    transcribe: transcribeMutation.mutate,
    transcribeAsync: transcribeMutation.mutateAsync,
    isTranscribing: transcribeMutation.isPending,
    transcribeError: transcribeMutation.error,
    transcribeData: transcribeMutation.data,
    transcribeAndPoll,
    // Real-time recognition
    startRealtimeRecognition,
    stopRealtimeRecognition,
    isListening,
    realtimeTranscript,
    isSpeechRecognitionSupported,
  };
}
