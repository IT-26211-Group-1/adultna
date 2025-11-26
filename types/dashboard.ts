export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed";
export type ActivityType =
  | "module_completed"
  | "job_application"
  | "resume_updated"
  | "networking_evnt"
  | "workshop_completed"
  | "milestone_achieved"
  | "other";

export type DeadlinePriority = "high" | "medium" | "low";
export type DeadlineUrgencyLevel = "urgent" | "upcoming" | "normal";

export type NotificationType =
  | "milestone"
  | "reminder"
  | "achievement"
  | "assessment"
  | "document"
  | "opportunity"
  | "training"
  | "system";

export type DailyStreak = {
  currentStreak: number;
  completionRate: number;
  lastActivityDate: string;
  isActive: boolean;
};

export type RoadmapTask = {
  id: string;
  milestoneId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  isOverdue: boolean;
  isDueSoon: boolean;
};

export type RoadmapProgress = {
  totalMilestones: number;
  completedMilestones: number;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  nextTasks: RoadmapTask[];
};

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
  timeAgo: string;
};

export type Deadline = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: DeadlinePriority;
  isCompleted: boolean;
  daysUntilDue: number;
  urgencyLevel: DeadlineUrgencyLevel;
};

export type DashboardNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
};

export type DashboardSummary = {
  dailyStreak: DailyStreak;
  roadmapProgress: RoadmapProgress;
  recentActivities: Activity[];
  upcomingDeadlines: Deadline[];
};

export type DashboardResponse = {
  success: boolean;
  data: DashboardSummary;
};

export type NotificationsResponse = {
  success: boolean;
  data: DashboardNotification[];
};

export type GenerateRemindersResponse = {
  success: boolean;
  message: string;
  data: {
    notificationsCreated: number;
  };
};
