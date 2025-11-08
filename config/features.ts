import { GovGuide } from "@/app/(public)/features/_components/GovGuide";
import { Interview } from "@/app/(public)/features/_components/Interview";
import { Filebox } from "@/app/(public)/features/_components/Filebox";
import { Job } from "@/app/(public)/features/_components/Job";
import { AIGabay } from "@/app/(public)/features/_components/AIGabay";
import { Resume } from "@/app/(public)/features/_components/Resume";
import type { FeatureSection } from "@/types/features";

export const FEATURES: FeatureSection[] = [
  { id: "govguide-section", component: GovGuide },
  { id: "interview-section", component: Interview },
  { id: "filebox-section", component: Filebox },
  { id: "job-section", component: Job },
  { id: "aigabay-section", component: AIGabay },
  { id: "resume-section", component: Resume },
];
