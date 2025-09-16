import { Map, Sparkles } from "lucide-react";
import { Badge } from "@heroui/badge";

interface RoadmapHeaderProps {
  totalMilestones: number;
  overallProgress: number;
}

const RoadmapHeader = ({ totalMilestones, overallProgress }: RoadmapHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-roadmap-primary to-purple-600 flex items-center justify-center">
          <Map className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Roadmap</h1>
          <p className="text-muted-foreground">Track your goals and make progress</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Badge variant="solid" className="px-3 py-1">
          <Sparkles className="w-3 h-3 mr-1" />
          {totalMilestones}/10 Goals
        </Badge>
        <Badge 
          variant="solid" 
          className={`px-3 py-1 ${
            overallProgress === 100 
              ? 'bg-roadmap-success/10 text-roadmap-success' 
              : 'bg-roadmap-primary/10 text-roadmap-primary'
          }`}
        >
          {Math.round(overallProgress)}% Complete
        </Badge>
      </div>
    </div>
  );
};

export default RoadmapHeader;