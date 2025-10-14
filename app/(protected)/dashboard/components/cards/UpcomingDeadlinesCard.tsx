import { memo } from "react";

function UpcomingDeadlinesCard() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(172, 189, 111, 0.3)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        ⏰
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Upcoming Deadlines
          </h3>
          <p className="text-gray-700 mb-3 text-sm">
            Never miss important dates
          </p>
          <p className="text-xs text-gray-600">
            <span className="text-green-600 font-semibold">92%</span> on-time
            completion
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="w-12 h-1.5 bg-red-200 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="w-8 h-1.5 bg-yellow-200 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="w-6 h-1.5 bg-green-200 rounded-full" />
              </div>
            </div>
            <div className="text-xs text-gray-600 text-center">
              priority levels
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(UpcomingDeadlinesCard);
