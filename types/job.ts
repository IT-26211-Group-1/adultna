export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  listedDate: string;
  applyUrl: string;
};

export type JobCardProps = {
  job: Job;
};
