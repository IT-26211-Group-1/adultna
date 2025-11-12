export const JOB_CARD_COLORS = [
  "from-[#ACBD6F]/20 to-[#ACBD6F]/5",
  "from-[#F16F33]/20 to-[#F16F33]/5",
  "from-[#FCE2A9]/30 to-[#FCE2A9]/10",
  "from-[#CBCBE7]/25 to-[#CBCBE7]/8",
];

export const JOB_CARD_SKELETON_COLORS = [
  "from-[#ACBD6F]/10 to-[#ACBD6F]/5",
  "from-[#F16F33]/10 to-[#F16F33]/5",
  "from-[#FCE2A9]/15 to-[#FCE2A9]/5",
  "from-[#CBCBE7]/12 to-[#CBCBE7]/4",
];

export function getJobCardColor(index: number): string {
  return JOB_CARD_COLORS[index % JOB_CARD_COLORS.length];
}

export function getJobCardSkeletonColor(index: number): string {
  return JOB_CARD_SKELETON_COLORS[index % JOB_CARD_SKELETON_COLORS.length];
}
