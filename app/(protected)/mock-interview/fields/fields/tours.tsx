export default function Tours() {
	// List of tourism roles for mock interviews - samples only
	const roles = [
		{ id: "hotel-manager", name: "Hotel Manager" },
		{ id: "tour-guide", name: "Tour Guide" },
		{ id: "event-coordinator", name: "Event Coordinator" },
		{ id: "travel-agent", name: "Travel Agent" },
		{ id: "restaurant-manager", name: "Restaurant Manager" },
		{ id: "customer-service-representative", name: "Customer Service Representative" },
		{ id: "concierge", name: "Concierge" },
		{ id: "general-interview", name: "General Interview" },
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
			{/* displays the roles in a grid layout for users to choose from */}
			{roles.map((role) => (
				<a
					key={role.id}
					href={`/mock-interview/fields/tours/${role.id}`}
					className="flex items-center justify-center p-20 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:bg-periwinkle/40 transition-colors text-center"
					aria-label={`Select ${role.name}`}
				>
					<span className="text-sm font-medium text-gray-700">{role.name}</span>
				</a>
			))}
		</div>
	);
}
