import { cn } from "@/lib/utils";

interface AgentWelcomeProps {
  className?: string;
}

export function AgentWelcome({ className }: AgentWelcomeProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-8", className)}>
      <div className="mb-8 text-gray-600">
        Hi! I&apos;m your AI Gabay Agent!
      </div>

      <h1 className="text-4xl font-bold mb-6 text-adult-green">
        What would you like to know?
      </h1>

      <p className="text-gray-500 max-w-md">
        Use one of the most common prompts below<br />
        or use your own to begin
      </p>
    </div>
  );
}
