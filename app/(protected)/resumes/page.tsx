
import { ResumeDashboard } from "./_components/ResumeDashboard";

export default function Page() {
  return (
    <div className="flex h-screen w-full">

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <ResumeDashboard />
        </main>
      </div>
    </div>
  )
}
