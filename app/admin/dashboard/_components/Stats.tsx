import { Card, CardHeader, CardBody, Divider } from "@heroui/react";

export function Stats() {
    //sample static data, replace with real data fetching logic as needed
    const statsData = {
        totalUsers: 420,
        activeSessions: 300,
    };

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 px-20">
        <Card className="h-50 px-5 py-3">
            <CardHeader className="text-xl font-bold flex items-center justify-between">
                Total Users
                <button
                    type="button"
                    className="ml-2 p-1 rounded hover:bg-gray-100"
                    title="View details"
                    aria-label="View details"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </CardHeader>
            <Divider className="my-3"/>
            <CardBody className="flex items-start justify-center h-full">
                <p className="text-4xl font-bold text-adult-green">{statsData.totalUsers}</p>
            </CardBody>
        </Card> 

        <Card className="h-50 px-5 py-3">
            <CardHeader className="text-xl font-bold flex items-center justify-between">
                Active Sessions
                <button
                    type="button"
                    className="ml-2 p-1 rounded hover:bg-gray-100"
                    title="View details"
                    aria-label="View details"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                </button>   
            </CardHeader>
            <Divider className="my-3"/>
            <CardBody className="flex items-start justify-center h-full">
                <p className="text-4xl font-bold text-adult-green">{statsData.activeSessions}</p>
            </CardBody>
        </Card>
    </div>


    );
}