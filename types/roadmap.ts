export interface MilestoneTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  tasks: MilestoneTask[];
  position: {
    x: number;
    y: number;
    z: number;
  };
  isActive: boolean;
}

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
