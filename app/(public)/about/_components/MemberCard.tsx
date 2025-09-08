export function MemberCard({ name, description, linkedin, github, bg = "bg-white" }) {
    return (
        <div className={`${bg} border p-4 rounded-lg shadow-md`}>
            <div className="flex justify-center mb-3">
            <div className="w-50 h-50 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <img
                src="/member.jpg" // Replace with actual member image URL
                alt={`${name} profile`}
                className="w-full h-full object-cover"
                />
            </div>
            </div>
            
            <h3>{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="flex space-x-2 mt-2">
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="24" height="24" fill="black" className="text-blue-700 hover:text-blue-900">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47s-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
                </svg>
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="24" height="24" fill="black" className="text-gray-800 hover:text-black">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.762-1.604-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
            </a>
            </div>
        </div>
    );
}