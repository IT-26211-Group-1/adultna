export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  completed: boolean;
  createdAt: Date;
}

export interface RoadmapStats {
  totalMilestones: number;
  completedMilestones: number;
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
}