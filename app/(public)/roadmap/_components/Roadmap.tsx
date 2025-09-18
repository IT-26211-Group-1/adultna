import { useState, useEffect } from "react";
import { Milestone, RoadmapStats } from "@/types/roadmap";
import RoadmapHeader from "./RoadmapHeader";
import MilestoneCard from "./MilestoneCard";
import AddMilestoneCard from "./AddMilestoneCard";
import StatsSection from "./StatsSection";

const Roadmap = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  // Initialize with 3 default milestones
  useEffect(() => {
    const initialMilestones: Milestone[] = [
      {
        id: "milestone-1",
        title: "Getting Started",
        description: "Set up your foundation and initial goals",
        tasks: [
          {
            id: "task-1",
            title: "Define your vision",
            completed: false,
            createdAt: new Date()
          }
        ],
        completed: false,
        createdAt: new Date()
      },
      {
        id: "milestone-2",
        title: "Build Momentum",
        description: "Take action and start making progress",
        tasks: [],
        completed: false,
        createdAt: new Date()
      },
      {
        id: "milestone-3",
        title: "Achieve Success",
        description: "Reach your ultimate objective",
        tasks: [],
        completed: false,
        createdAt: new Date()
      }
    ];
    setMilestones(initialMilestones);
  }, []);

  const calculateStats = (): RoadmapStats => {
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.completed).length;
    const totalTasks = milestones.reduce((sum, m) => sum + m.tasks.length, 0);
    const completedTasks = milestones.reduce(
      (sum, m) => sum + m.tasks.filter(t => t.completed).length, 
      0
    );
    const overallProgress = totalMilestones > 0 
      ? (completedMilestones / totalMilestones) * 100 
      : 0;

    return {
      totalMilestones,
      completedMilestones,
      totalTasks,
      completedTasks,
      overallProgress
    };
  };

  const handleAddMilestone = (title: string, description?: string) => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title,
      description,
      tasks: [],
      completed: false,
      createdAt: new Date()
    };
    
    setMilestones(prev => [...prev, newMilestone]);
  };

  const handleUpdateMilestone = (updatedMilestone: Milestone) => {
    setMilestones(prev =>
      prev.map(m => 
        m.id === updatedMilestone.id ? updatedMilestone : m
      )
    );
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
  };

  const stats = calculateStats();
  const canAddMore = milestones.length < 10;

  return (
    <div className={`min-h-screen bg-background transition-all duration-300 ${
      isStatsExpanded ? 'pb-96' : 'pb-16'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <RoadmapHeader 
          totalMilestones={stats.totalMilestones}
          overallProgress={stats.overallProgress}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onUpdateMilestone={handleUpdateMilestone}
              onDeleteMilestone={handleDeleteMilestone}
              index={index}
            />
          ))}
          
          {canAddMore && (
            <AddMilestoneCard
              onAdd={handleAddMilestone}
              disabled={!canAddMore}
            />
          )}
        </div>

        {!canAddMore && (
          <div className="text-center mt-8 p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
            <p className="text-muted-foreground">
              You&#39;ve reached the maximum of 10 milestones. Complete or delete existing ones to add more.
            </p>
          </div>
        )}
      </div>

      <StatsSection
        stats={stats}
        isExpanded={isStatsExpanded}
        onToggle={() => setIsStatsExpanded(!isStatsExpanded)}
      />
    </div>
  );
};

export default Roadmap;