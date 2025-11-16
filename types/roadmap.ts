export interface MilestoneTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  userId?: string;
  title: string;
  description: string | null;
  category: string;
  status: "pending" | "in_progress" | "done" | "cancelled";
  priority: string | null;
  positionNumber?: number;
  tasks: MilestoneTask[];
  position: {
    x: number;
    y: number;
    z: number;
  };
  isActive: boolean;
  deadline: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateMilestonePayload = {
  title: string;
  description?: string;
  category: string;
  priority?: string;
  deadline?: string;
  tasks?: Array<{ title: string }>;
};

export type UpdateMilestonePayload = {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  deadline?: string;
  status?: "pending" | "in_progress" | "done" | "cancelled";
};

export interface CameraPosition {
  position: [number, number, number];
  fov: number;
}

export interface CameraAnimation {
  from: CameraPosition;
  to: CameraPosition;
  duration: number;
  delay?: number;
}

export interface RoadmapInteraction {
  objectName: string;
  milestoneId: string;
  timestamp: Date;
}
