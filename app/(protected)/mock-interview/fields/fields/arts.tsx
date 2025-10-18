export default function Arts() {
	// List of arts and design roles for mock interviews - samples only
	const roles = [
		{ id: "graphic-designer", name: "Graphic Designer" },
		{ id: "illustrator", name: "Illustrator" },
		{ id: "art-director", name: "Art Director" },
		{ id: "fashion-designer", name: "Fashion Designer" },
		{ id: "interior-designer", name: "Interior Designer" },
		{ id: "animator", name: "Animator" },
		{ id: "photographer", name: "Photographer" },
		{ id: "general-interview", name: "General Interview" },
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
			{/* displays the roles in a grid layout for users to choose from */}
			{roles.map((role) => (
				<a
					key={role.id}
					href={`/mock-interview/fields/arts/${role.id}`}
					className="flex items-center justify-center p-20 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:bg-periwinkle/40 transition-colors text-center"
					aria-label={`Select ${role.name}`}
				>
					<span className="text-sm font-medium text-gray-700">{role.name}</span>
				</a>
			))}
		</div>
	);
}
