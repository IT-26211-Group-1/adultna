export default function Bsman() {
	// List of business roles for mock interviews - samples only
	const roles = [
		{ id: "project-manager", name: "Project Manager" },
		{ id: "business-analyst", name: "Business Analyst" },
		{ id: "operations-manager", name: "Operations Manager" },
		{ id: "hr-specialist", name: "HR Specialist" },
		{ id: "marketing-manager", name: "Marketing Manager" },
		{ id: "sales-manager", name: "Sales Manager" },
		{ id: "financial-analyst", name: "Financial Analyst" },
		{ id: "general-interview", name: "General Interview" },
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
			{/* displays the roles in a grid layout for users to choose from */}
			{roles.map((role) => (
				<a
					key={role.id}
					href={`/mock-interview/fields/bsman/${role.id}`}
					className="flex items-center justify-center p-20 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:bg-periwinkle/40 transition-colors text-center"
					aria-label={`Select ${role.name}`}
				>
					<span className="text-sm font-medium text-gray-700">{role.name}</span>
				</a>
			))}
		</div>
	);
}
