import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "../_ui/Card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "../_ui/TextArea";

interface AddMilestoneCardProps {
  onAdd: (title: string, description?: string) => void;
  disabled?: boolean;
}

const AddMilestoneCard = ({ onAdd, disabled }: AddMilestoneCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTitle("");
    setDescription("");
  };

  if (!isExpanded) {
    return (
      <Card className="roadmap-card border-2 border-dashed cursor-pointer hover:border-roadmap-primary/50 transition-colors">
        <CardContent 
          className="flex items-center justify-center p-8"
          onClick={() => !disabled && setIsExpanded(true)}
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-roadmap-primary/10 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-roadmap-primary" />
            </div>
            <h3 className="font-medium text-foreground">Add New Milestone</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {disabled ? "Maximum 10 milestones reached" : "Create your next goal"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="roadmap-card">
      <CardHeader>
        <h3 className="font-semibold text-lg">New Milestone</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Milestone title..."
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="resize-none"
              rows={3}
              maxLength={300}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={!title.trim()}>
              Create Milestone
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMilestoneCard;