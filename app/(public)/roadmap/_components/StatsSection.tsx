import { ChevronUp, ChevronDown, Target, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../_ui/Card";
import { Button } from "@heroui/button";
import { RoadmapStats } from "@/types/roadmap";
import ProgressRing from "./ProgressRing";

interface StatsSectionProps {
  stats: RoadmapStats;
  isExpanded: boolean;
  onToggle: () => void;
}

const StatsSection = ({ stats, isExpanded, onToggle }: StatsSectionProps) => {
  const taskCompletionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      {/* Pull up button */}
      <div className="flex justify-center py-2 bg-muted/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="rounded-full w-12 h-6 p-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Stats content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6 space-y-6">
          {/* Overall Progress */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-roadmap-primary to-adult-green bg-clip-text text-transparent">
              Roadmap Progress
            </h2>
            <div className="flex justify-center mb-4">
              <ProgressRing progress={stats.overallProgress} size={80} strokeWidth={6} />
            </div>
            <p className="text-muted-foreground">
              {stats.completedMilestones} of {stats.totalMilestones} milestones completed
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <Target className="w-5 h-5 text-roadmap-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalMilestones}
                </div>
                <p className="text-xs text-muted-foreground">Total Goals</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-roadmap-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.completedMilestones}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <Clock className="w-5 h-5 text-roadmap-warning" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalTasks}
                </div>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-roadmap-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {taskCompletionRate}%
                </div>
                <p className="text-xs text-muted-foreground">Task Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;