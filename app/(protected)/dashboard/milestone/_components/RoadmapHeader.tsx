import { Sparkles } from "lucide-react";
import { Badge } from "../_ui/Badge";

interface RoadmapHeaderProps {
  totalMilestones: number;
  overallProgress: number;
}

const RoadmapHeader = ({ totalMilestones, overallProgress }: RoadmapHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Milestone Tracker</h1>
          <p className="text-muted-foreground">Track your goals and make consistent progress!</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Badge className="px-6 py-1" variant="outline">
          <Sparkles className="w-3 h-3 mr-1" />
          {totalMilestones}/10 Goals
        </Badge>
        <Badge
          className={`px-3 py-1 ${
            overallProgress === 100 
              ? 'bg-roadmap-success/10 text-roadmap-success' 
              : 'bg-roadmap-primary/10 text-roadmap-primary'
          }`}
          variant="outline"
        >
          {Math.round(overallProgress)}% Complete
        </Badge>
      </div>
    </div>
  );
};

export default RoadmapHeader;