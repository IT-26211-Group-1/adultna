import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface AddTaskFormProps {
  onAdd: (title: string) => void;
  disabled?: boolean;
}

const AddTaskForm = ({ onAdd, disabled }: AddTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <Button
        variant="bordered"
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
        className="w-full justify-start border-[#2e2c29] hover:bg-[#242321] hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add task
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title..."
        maxLength={100}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!title.trim()}>
          Add
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setIsExpanded(false);
            setTitle("");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddTaskForm;