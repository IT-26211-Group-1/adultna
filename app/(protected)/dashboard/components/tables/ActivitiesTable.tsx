export default function ActivitiesTable() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden"
      style={{ backgroundColor: "rgba(241, 111, 51, 0.06)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 pointer-events-none">
        ⚡
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Recent Activities
      </h2>
      <div className="divide-y divide-white/20">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Completed Financial Planning Module
              </h3>
              <p className="text-xs text-gray-600">
                Finished budgeting and savings course
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-600">2 hours ago</span>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Submitted Job Application
              </h3>
              <p className="text-xs text-gray-600">
                Applied for Software Developer position
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-600">5 hours ago</span>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Updated Resume
              </h3>
              <p className="text-xs text-gray-600">
                Added new skills and certifications
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-600">1 day ago</span>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Networking Event
              </h3>
              <p className="text-xs text-gray-600">
                Attended tech meetup and made connections
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-600">2 days ago</span>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Completed Tax Workshop
              </h3>
              <p className="text-xs text-gray-600">
                Learned about filing taxes as a young adult
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-600">3 days ago</span>
        </div>
      </div>
    </div>
  );
}
