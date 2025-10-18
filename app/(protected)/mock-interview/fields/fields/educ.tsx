export default function Educ() {
	// List of education roles for mock interviews - samples only
	const roles = [
		{ id: "elementary-teacher", name: "Elementary Teacher" },
		{ id: "high-school-teacher", name: "High School Teacher" },
		{ id: "college-professor", name: "College Professor" },
		{ id: "school-counselor", name: "School Counselor" },
		{ id: "librarian", name: "Librarian" },
		{ id: "education-administrator", name: "Education Administrator" },
		{ id: "special-education-teacher", name: "Special Education Teacher" },
		{ id: "general-interview", name: "General Interview" },
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
			{/* displays the roles in a grid layout for users to choose from */}
			{roles.map((role) => (
				<a
					key={role.id}
					href={`/mock-interview/fields/educ/${role.id}`}
					className="flex items-center justify-center p-20 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:bg-periwinkle/40 transition-colors text-center"
					aria-label={`Select ${role.name}`}
				>
					<span className="text-sm font-medium text-gray-700">{role.name}</span>
				</a>
			))}
		</div>
	);
}
