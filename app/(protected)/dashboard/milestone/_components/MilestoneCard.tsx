import { useState } from "react";
import { MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../_ui/Card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "../_ui/TextArea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../_ui/DropdownMenu";
import { Badge } from "../_ui/Badge";
import { Milestone } from "@/types/roadmap";
import ProgressRing from "./ProgressRing";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";

interface MilestoneCardProps {
  milestone: Milestone;
  onUpdateMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  index: number;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const bgColors = shuffleArray([
  'bg-[#ACBD6F]', // olivine
  'bg-[#FCE2A9]', // peachYellow
  'bg-[#CBCBE7]', // periwinkle
  'bg-[#F16F33]/80', // crayola-orange
  'bg-[#FDFAE7]', // ultraviolet
]);

const MilestoneCard = ({ 
  milestone, 
  onUpdateMilestone, 
  onDeleteMilestone,
  index
}: MilestoneCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(milestone.title);
  const [editDescription, setEditDescription] = useState(milestone.description || "");

  const completedTasks = milestone.tasks.filter(task => task.completed).length;
  const totalTasks = milestone.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isCompleted = totalTasks > 0 && completedTasks === totalTasks;

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdateMilestone({
        ...milestone,
        title: editTitle.trim(),
        description: editDescription.trim(),
        completed: isCompleted
      });
      setIsEditing(false);
    }
  };

  const handleAddTask = (title: string) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date()
    };
    
    onUpdateMilestone({
      ...milestone,
      tasks: [...milestone.tasks, newTask]
    });
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = milestone.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const updatedMilestone = {
      ...milestone,
      tasks: updatedTasks,
      completed: updatedTasks.length > 0 && updatedTasks.every(task => task.completed)
    };
    
    onUpdateMilestone(updatedMilestone);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = milestone.tasks.filter(task => task.id !== taskId);
    const updatedMilestone = {
      ...milestone,
      tasks: updatedTasks,
      completed: updatedTasks.length > 0 && updatedTasks.every(task => task.completed)
    };
    
    onUpdateMilestone(updatedMilestone);
  };

  if (isEditing) {
    return (
      <Card className="roadmap-card transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Milestone title..."
              className="font-semibold text-lg"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <Button className="border-2 rounded-lg border-[#2e2c29] bg-adult-green text-white" onClick={handleSaveEdit} size="sm">Save</Button>
              <Button 
                className="border-2 rounded-lg border-[#2e2c29]"
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(milestone.title);
                  setEditDescription(milestone.description || "");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`roadmap-card group transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col ${bgColors[index % bgColors.length]} ${isCompleted ? 'ring-2 ring-roadmap-success/20' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-foreground font-inter">{milestone.title}</h3>
            </div>
            <div className="flex items-center mb-2">
              {isCompleted && (
                <Badge variant="default" className="bg-roadmap-success/10 text-roadmap-success border-black bg-adult-green text-white">
                  Completed
                </Badge>
              )}
            </div>
            {milestone.description && (
              <p className="text-muted-foreground text-sm">{milestone.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <ProgressRing progress={progress} size={48} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="bordered" 
                  size="sm" 
                  className="cursor-pointer border-[#211f1f] border-2 hover:bg-white transition-color px-2 w-10 min-w-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => setIsEditing(true)} className="hover:bg-gray-200">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteMilestone(milestone.id)}
                  className="text-destructive focus:text-destructive hover:bg-gray-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow space-y-3">
        <div className="flex-grow flex flex-col space-y-px">
          {milestone.tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
        <div>
          <AddTaskForm
            onAdd={handleAddTask}
            disabled={milestone.tasks.length >= 5}
          />
          {milestone.tasks.length >= 5 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              Maximum 5 tasks per milestone
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneCard;