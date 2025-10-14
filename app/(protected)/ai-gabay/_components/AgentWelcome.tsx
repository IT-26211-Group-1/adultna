import { cn } from "@/lib/utils";

interface AgentWelcomeProps {
  className?: string;
}

export function AgentWelcome({ className }: AgentWelcomeProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-adultGreen text-white shadow-sm">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex-1 space-y-4">
        <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-black shadow-sm dark:bg-gray-800 dark:text-black">
          <p className="font-medium">Hi! I&apos;m your AI Gabay Agent!</p>
          <p className="mt-2">
            I&apos;m here to help you with all your adulting questions,
            especially about Filipino government documents and processes. What
            would you like to know?
          </p>
        </div>
        <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-black shadow-sm dark:bg-gray-800 dark:text-black">
          <p className="font-medium">Heads up!</p>
          <p className="mt-2">
            Our AI Gabay Agent is here to support you with tips and suggestions
            — but it&apos;s not a substitute for professional, legal, or medical
            advice. When in doubt, always check with a real expert!
          </p>
        </div>
      </div>
    </div>
  );
}
