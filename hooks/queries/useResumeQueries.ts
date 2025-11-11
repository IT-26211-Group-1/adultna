"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import { Resume, CreateResumeInput, UpdateResumeInput } from "@/types/resume";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  resume?: T;
  resumes?: T[];
}

export function useResumes() {
  return useQuery({
    queryKey: queryKeys.resumes.list(),
    queryFn: async () => {
      const response = await ApiClient.get<ApiResponse<Resume>>("/resumes");

      return response.resumes || [];
    },
  });
}

export function useResume(resumeId?: string) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId!),
    queryFn: async () => {
      const response = await ApiClient.get<ApiResponse<Resume>>(
        `/resumes/${resumeId}`,
      );

      return response.resume;
    },
    enabled: !!resumeId,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResumeInput) => {
      const response = await ApiClient.post<ApiResponse<Resume>>(
        "/resumes",
        data,
      );

      return response.resume!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() });
    },
  });
}

export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateResume", resumeId],
    mutationFn: async (data: UpdateResumeInput) => {
      const response = await ApiClient.patch<ApiResponse<Resume>>(
        `/resumes/${resumeId}`,
        data,
      );

      return response.resume!;
    },
    onSuccess: () => {
      // Don't overwrite cache - just mark as stale for background refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      await ApiClient.delete<ApiResponse<never>>(`/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() });
    },
  });
}

export function useExportResume() {
  return useMutation({
    mutationFn: async (resumeId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/resumes/${resumeId}/export`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export resume");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "resume.pdf";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useAddWorkExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ApiClient.post<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/work-experiences`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useUpdateWorkExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await ApiClient.put<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/work-experiences/${id}`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useDeleteWorkExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ApiClient.delete(`/resumes/${resumeId}/work-experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useAddEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ApiClient.post<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/education`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useUpdateEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await ApiClient.put<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/education/${id}`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useDeleteEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ApiClient.delete(`/resumes/${resumeId}/education/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useAddCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ApiClient.post<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/certifications`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useUpdateCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await ApiClient.put<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/certifications/${id}`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useDeleteCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ApiClient.delete(`/resumes/${resumeId}/certifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useAddSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ApiClient.post<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/skills`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useUpdateSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await ApiClient.put<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/skills/${id}`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useDeleteSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ApiClient.delete(`/resumes/${resumeId}/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export function useGetContactInfo(resumeId: string) {
  return useQuery({
    queryKey: queryKeys.resumes.contactInfo(resumeId),
    queryFn: async () => {
      const response = await ApiClient.get<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/contact-info`,
      );

      return response.data;
    },
    enabled: !!resumeId,
  });
}

export function useCreateContactInfo(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ApiClient.post<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/contact-info`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.contactInfo(resumeId),
      });
    },
  });
}

export function useUpdateContactInfo(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ApiClient.put<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/contact-info`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.contactInfo(resumeId),
      });
    },
  });
}

export function useUpdateSummary(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (summary: string) => {
      const response = await ApiClient.put<{ success: boolean; data: any }>(
        `/resumes/${resumeId}/summary`,
        { summary },
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });
    },
  });
}

export type ExtractedResumeData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  portfolio?: string;
  jobPosition?: string;
  summary?: string;
  workExperiences: Array<{
    jobTitle: string;
    employer: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking: boolean;
    description?: string;
  }>;
  educationItems: Array<{
    degree: string;
    fieldOfStudy?: string;
    institution: string;
    location?: string;
    graduationDate?: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    issuingOrganization?: string;
    dateObtained?: string;
  }>;
};

export function useImportResume() {
  return useMutation({
    mutationFn: async (data: { fileKey: string; fileName: string }) => {
      const response = await ApiClient.post<{
        success: boolean;
        message: string;
        statusCode: number;
        data?: {
          extractedData: ExtractedResumeData;
        };
      }>("/resumes/import", data);

      if (!response.success) {
        throw new Error(response.message || "Failed to import resume");
      }

      return response.data!.extractedData;
    },
  });
}

export function useCreateResumeFromImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      templateId: string;
      extractedData: ExtractedResumeData;
    }) => {
      const payload: CreateResumeInput = {
        title: data.extractedData.jobPosition || "Imported Resume",
        templateId: data.templateId as any,
        status: "draft",
        firstName: data.extractedData.firstName || "",
        lastName: data.extractedData.lastName || "",
        email: data.extractedData.email || "",
        phone: data.extractedData.phone || "",
        jobPosition: data.extractedData.jobPosition,
        city: data.extractedData.location,
        linkedin: data.extractedData.linkedIn,
        portfolio: data.extractedData.portfolio,
        summary: data.extractedData.summary,
        workExperiences: data.extractedData.workExperiences.map((work) => ({
          jobTitle: work.jobTitle,
          employer: work.employer,
          startDate: work.startDate,
          endDate: work.endDate,
          isCurrentlyWorkingHere: work.currentlyWorking,
          description: work.description,
        })),
        educationItems: data.extractedData.educationItems.map((edu) => ({
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          schoolName: edu.institution,
          schoolLocation: edu.location,
          graduationDate: edu.graduationDate,
        })),
        skills: data.extractedData.skills.map((skill) => ({
          skill: skill,
        })),
        certificates: data.extractedData.certifications.map((cert) => ({
          certificate: cert.name,
          issuingOrganization: cert.issuingOrganization,
        })),
      };

      const response = await ApiClient.post<ApiResponse<Resume>>(
        "/resumes",
        payload
      );

      return response.resume!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() });
    },
  });
}

export type CategoryScore = {
  score: number;
  maxScore: number;
  issues: string[];
  strengths: string[];
};

export type ATSGradingResult = {
  overallScore: number;
  categoryScores: {
    keywordOptimization: CategoryScore;
    formatCompatibility: CategoryScore;
    sectionCompleteness: CategoryScore;
    contentQuality: CategoryScore;
  };
  recommendations: string[];
  summary: string;
  passRate: "excellent" | "good" | "fair" | "poor";
};

export function useGradeResume() {
  return useMutation({
    mutationFn: async (data: {
      fileKey: string;
      fileName: string;
      jobDescription?: string;
    }) => {
      const response = await ApiClient.post<{
        success: boolean;
        message: string;
        statusCode: number;
        data?: {
          gradingResult: ATSGradingResult;
        };
      }>("/resumes/grade", data);

      if (!response.success) {
        throw new Error(response.message || "Failed to grade resume");
      }

      return response.data!.gradingResult;
    },
  });
}
