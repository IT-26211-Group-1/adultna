import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@heroui/button";
import { Task } from "@/types/roadmap";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 transition-colors hover:opacity-80"
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-roadmap-success" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      <span 
        className={`flex-1 transition-all ${
          task.completed 
            ? "text-muted-foreground line-through" 
            : "text-foreground"
        }`}
      >
        {task.title}
      </span>
      
      <Button
        variant="bordered"
        size="sm"
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto border-adult-green hover:bg-white/50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TaskItem;