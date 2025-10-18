export default function Infotech() {
	// sample roles for the Infotech field
	const roles = [
		{ id: "web-developer", label: "Web Developer" },
		{ id: "software-engineer", label: "Software Engineer" },
		{ id: "cybersecurity-specialist", label: "Cybersecurity Specialist" },
		{ id: "data-analyst", label: "Data Analyst" },
		{ id: "it-support", label: "IT Support" },
		{ id: "ui-ux-designer", label: "UI/UX Designer" },
		{ id: "project-management", label: "Project Management" },
		{ id: "general-interview", label: "General Interview" },
	];

  return (
	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
		{/* displays the roles in a grid layout for users to choose from */}
	  {roles.map((role) => (
		<a
		  key={role.id}
		  href={`/mock-interview/fields/infotech/${role.id}`}
		  className="flex items-center justify-center p-20 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:bg-periwinkle/40 transition-colors text-center"
		  aria-label={`Select ${role.label}`}
		>
		  <span className="text-sm font-medium text-gray-700">{role.label}</span>
		</a>
	  ))}
	</div>
  );
}
