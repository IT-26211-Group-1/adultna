export default function Comms() {
	// List of communications roles for mock interviews - samples only
	const roles = [
		{ id: "public-relations-specialist", name: "Public Relations Specialist" },
		{ id: "corporate-communications-manager", name: "Corporate Communications Manager" },
		{ id: "social-media-manager", name: "Social Media Manager" },
		{ id: "content-writer", name: "Content Writer" },
		{ id: "editor", name: "Editor" },
		{ id: "journalist", name: "Journalist" },
		{ id: "advertising-specialist", name: "Advertising Specialist" },
		{ id: "general-interview", name: "General Interview" },
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
			{/* displays the roles in a grid layout for users to choose from */}
			{roles.map((role) => (
				<a
					key={role.id}
					href={`/mock-interview/fields/comms/${role.id}`}
					className="flex items-center justify-center p-20 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:bg-periwinkle/40 transition-colors text-center"
					aria-label={`Select ${role.name}`}
				>
					<span className="text-sm font-medium text-gray-700">{role.name}</span>
				</a>
			))}
		</div>
	);
}
