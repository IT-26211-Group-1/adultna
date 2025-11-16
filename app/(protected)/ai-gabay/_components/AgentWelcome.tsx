import { cn } from "@/lib/utils";

interface AgentWelcomeProps {
  className?: string;
}

export function AgentWelcome({ className }: AgentWelcomeProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-2 sm:py-4 lg:py-8 px-4 sm:px-6 lg:px-8", className)}>
      <div className="mb-4 sm:mb-6 mt-8 sm:mt-12 lg:mt-15 text-gray-600 text-sm sm:text-base lg:text-md">
        Great to see you here! I'm <span className={cn("font-bold")}>AI Gabay</span>, your personal guide to navigating adulthood.
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-adult-green">
        What can I help you with today?
      </h1>

      {/* <p className="text-gray-600 max-w-lg leading-relaxed mb-4">
        Navigating adulthood doesn&apos;t come with a manual, but that&apos;s what I&apos;m here for.
        Let&apos;s figure this out together.
      </p> */}

      {/* <p className="text-gray-500 max-w-xs sm:max-w-sm lg:max-w-md leading-relaxed text-sm sm:text-base">
        Choose from the suggestions below or ask me anything you need help with.
      </p> */}
    </div>
  );
}
