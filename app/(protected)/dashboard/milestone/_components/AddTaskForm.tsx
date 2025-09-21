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
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    onAdd(title.trim());
    setTitle("");
    setIsExpanded(false);
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
        className="border-2 rounded-lg"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (showWarning && e.target.value.trim()) setShowWarning(false);
        }}
        placeholder="Enter milestone task..."
        maxLength={100}
      />
      {showWarning && (
        <div className="text-xs text-red-500 mt-1">Please enter a task.</div>
      )}
      <div className="flex gap-2">
        <Button className="border-2 rounded-lg border-[#2e2c29] bg-adult-green text-white" type="submit" size="sm">
          Add
        </Button>
        <Button 
          className="border-2 rounded-lg border-[#2e2c29]"
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