import { cn } from "@/lib/utils";

interface AgentWelcomeProps {
  className?: string;
}

export function AgentWelcome({ className }: AgentWelcomeProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-8", className)}>
      <div className="mb-6 mt-15 text-gray-600 text-md">
        Great to see you here! I'm AI Gabay, your personal guide to navigating adulthood.
      </div>

      <h1 className="text-4xl font-bold mb-6 text-adult-green">
        What can I help you with today?
      </h1>

      {/* <p className="text-gray-600 max-w-lg leading-relaxed mb-4">
        Navigating adulthood doesn&apos;t come with a manual, but that&apos;s what I&apos;m here for.
        Let&apos;s figure this out together.
      </p> */}

      <p className="text-gray-500 max-w-md leading-relaxed">
        Choose from the suggestions below or ask me anything you need help with.
      </p>
    </div>
  );
}
