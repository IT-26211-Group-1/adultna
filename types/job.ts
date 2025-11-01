export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  listedDate: string;
  applyUrl: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  isRemote?: boolean;
};

export type JobCardProps = {
  job: Job;
};

export type JobFilterState = {
  datePosted: string;
  jobType: string;
  employmentType: string;
};
