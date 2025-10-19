// Infrastructure layer - handles milestone data access
// This could later be extended to fetch from APIs or databases

import { Milestone } from "../../../../types/roadmap";

export class MilestoneService {
  private static milestones: Record<string, Milestone> = {
    "1": {
      id: "1",
      title: "Personal Finance",
      description: "Master budgeting, saving, and financial planning",
      category: "Financial Literacy",
      tasks: [
        {
          id: "pf-1",
          title: "Create a monthly budget",
          completed: false,
        },
        {
          id: "pf-2",
          title: "Open a savings account",
          completed: false,
        },
        {
          id: "pf-3",
          title: "Learn about credit scores",
          completed: false,
        },
        {
          id: "pf-4",
          title: "Set up emergency fund",
          completed: false,
        },
        {
          id: "pf-5",
          title: "Research investment basics",
          completed: false,
        },
      ],
      position: { x: 0, y: 0, z: 0 },
      isActive: true,
    },
  };

  static getMilestone(id: string): Milestone | null {
    return this.milestones[id] || null;
  }

  static getAllMilestones(): Milestone[] {
    return Object.values(this.milestones);
  }

  static updateTaskCompletion(
    milestoneId: string,
    taskId: string,
    completed: boolean,
  ): void {
    const milestone = this.milestones[milestoneId];

    if (milestone) {
      const task = milestone.tasks.find((t) => t.id === taskId);

      if (task) {
        task.completed = completed;
      }
    }
  }

  static isMilestone(objectName: string): boolean {
    const name = objectName.toLowerCase();

    const milestone1Patterns = [
      /^milestone[_\s]*1$/i,
      /^1$/,
      /^anchor[_\s]*1$/i,
      /^point[_\s]*1$/i,
      /milestone.*1$/i,
      /anchor.*1$/i,
      /^m1$/i,
    ];

    return milestone1Patterns.some((pattern) => pattern.test(name));
  }

  static getMilestoneIdFromObjectName(objectName: string): string | null {
    const milestoneNumber = objectName.match(/\d+/)?.[0];

    return milestoneNumber && this.milestones[milestoneNumber]
      ? milestoneNumber
      : null;
  }
}
