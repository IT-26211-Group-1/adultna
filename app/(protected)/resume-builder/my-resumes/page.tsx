import { MyResumesPageContent } from "./_components/MyResumesPageContent";

export default function MyResumesPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <MyResumesPageContent />
        </main>
      </div>
    </div>
  );
}
