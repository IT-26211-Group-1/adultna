// Infrastructure layer - handles milestone data access
import { Milestone } from "../../../../types/roadmap";

export class MilestoneService {
  private static milestones: Record<string, Milestone> = {
    "1": {
      id: "1",
      title: "Personal Finance Mastery",
      description:
        "Build a strong foundation in managing your money, budgeting, and financial planning",
      category: "Financial Literacy",
      tasks: [
        {
          id: "pf-1",
          title: "Create and track a monthly budget",
          completed: false,
        },
        {
          id: "pf-2",
          title: "Open a high-yield savings account",
          completed: false,
        },
        {
          id: "pf-3",
          title: "Check and understand your credit score",
          completed: false,
        },
        { id: "pf-4", title: "Build 3-month emergency fund", completed: false },
        { id: "pf-5", title: "Research investment options", completed: false },
      ],
      position: { x: 2.6, y: 0.1, z: 1.0 },
      isActive: true,
    },
    "2": {
      id: "2",
      title: "Health & Wellness",
      description:
        "Establish healthy habits for your physical and mental wellbeing",
      category: "Personal Health",
      tasks: [
        {
          id: "hw-1",
          title: "Schedule annual health checkup",
          completed: false,
        },
        {
          id: "hw-2",
          title: "Create exercise routine (3x/week)",
          completed: false,
        },
        {
          id: "hw-3",
          title: "Learn stress management techniques",
          completed: false,
        },
        {
          id: "hw-4",
          title: "Establish healthy sleep schedule",
          completed: false,
        },
        { id: "hw-5", title: "Plan balanced meals", completed: false },
      ],
      position: { x: 1.6, y: 0.1, z: 1.1 },
      isActive: true,
    },
    "3": {
      id: "3",
      title: "Career Development",
      description: "Advance your professional skills and career trajectory",
      category: "Professional Growth",
      tasks: [
        { id: "cd-1", title: "Update resume and LinkedIn", completed: false },
        {
          id: "cd-2",
          title: "Develop 2-3 key professional skills",
          completed: false,
        },
        { id: "cd-3", title: "Network with 5 professionals", completed: false },
        { id: "cd-4", title: "Set 1-year and 5-year goals", completed: false },
        { id: "cd-5", title: "Seek mentorship", completed: false },
      ],
      position: { x: 0.6, y: 0.1, z: 1.0 },
      isActive: true,
    },
    "4": {
      id: "4",
      title: "Education & Learning",
      description: "Commit to continuous learning and skill development",
      category: "Personal Development",
      tasks: [
        { id: "el-1", title: "Read 1 book per month", completed: false },
        { id: "el-2", title: "Complete an online course", completed: false },
        {
          id: "el-3",
          title: "Learn a new language (basics)",
          completed: false,
        },
        { id: "el-4", title: "Attend workshops/seminars", completed: false },
        { id: "el-5", title: "Start a learning journal", completed: false },
      ],
      position: { x: 0.5, y: 0.1, z: 0.0 },
      isActive: true,
    },
    "5": {
      id: "5",
      title: "Relationships & Social",
      description: "Nurture meaningful connections and build support network",
      category: "Social Development",
      tasks: [
        {
          id: "rs-1",
          title: "Schedule regular friend/family time",
          completed: false,
        },
        { id: "rs-2", title: "Join a club or group", completed: false },
        { id: "rs-3", title: "Practice active listening", completed: false },
        { id: "rs-4", title: "Volunteer in community", completed: false },
        { id: "rs-5", title: "Set healthy boundaries", completed: false },
      ],
      position: { x: 0.4, y: 0.1, z: -0.9 },
      isActive: true,
    },
    "6": {
      id: "6",
      title: "Personal Growth",
      description: "Develop self-awareness and emotional intelligence",
      category: "Self-Development",
      tasks: [
        { id: "pg-1", title: "Start daily journaling", completed: false },
        { id: "pg-2", title: "Identify personal values", completed: false },
        { id: "pg-3", title: "Practice daily gratitude", completed: false },
        { id: "pg-4", title: "Overcome one limiting belief", completed: false },
        { id: "pg-5", title: "Develop morning routine", completed: false },
      ],
      position: { x: -0.6, y: 0.1, z: -1.1 },
      isActive: true,
    },
    "7": {
      id: "7",
      title: "Home & Living Skills",
      description: "Master essential life skills for independent living",
      category: "Practical Skills",
      tasks: [
        { id: "hl-1", title: "Learn 5 healthy recipes", completed: false },
        {
          id: "hl-2",
          title: "Create home maintenance schedule",
          completed: false,
        },
        { id: "hl-3", title: "Organize living space", completed: false },
        { id: "hl-4", title: "Learn basic repairs", completed: false },
        { id: "hl-5", title: "Understand tenant rights", completed: false },
      ],
      position: { x: -1.6, y: 0.1, z: -1.0 },
      isActive: true,
    },
    "8": {
      id: "8",
      title: "Digital Literacy",
      description: "Navigate the digital world safely and effectively",
      category: "Technology Skills",
      tasks: [
        {
          id: "dl-1",
          title: "Set up password manager + 2FA",
          completed: false,
        },
        { id: "dl-2", title: "Learn to identify phishing", completed: false },
        { id: "dl-3", title: "Review privacy settings", completed: false },
        { id: "dl-4", title: "Create file backup system", completed: false },
        { id: "dl-5", title: "Learn productivity tools", completed: false },
      ],
      position: { x: -1.9, y: 0.1, z: 0.1 },
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
    if (!objectName) return false;
    const name = objectName.toLowerCase().trim();

    const milestonePatterns = [
      /^milestone[_\s]*\d+$/i,
      /^milestone[_\s]*future$/i,
      /^mlestone[_\s]*\d+$/i,
    ];

    return milestonePatterns.some((pattern) => pattern.test(name));
  }

  static getMilestoneIdFromObjectName(objectName: string): string | null {
    if (!objectName) return null;
    const name = objectName.toLowerCase().trim();

    if (name.includes("future")) {
      return "future";
    }

    const match = name.match(/(\d+)/);
    const milestoneNumber = match?.[0];

    return milestoneNumber && this.milestones[milestoneNumber]
      ? milestoneNumber
      : null;
  }
}
