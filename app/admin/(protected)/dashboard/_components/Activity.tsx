"use client";

import { Card, CardHeader, CardBody, Divider } from "@heroui/react";

export function Activity() {
  const activityData = [
    // Example activity data - replace with real data fetching logic as needed
    {
      id: 1,
      description: "User JohnDoe updated profile",
      subtext: "Profile picture changed",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      description: "New content added by Admin",
      subtext: "Blog post on React",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      description: "System backup completed",
      subtext: "Backup saved to cloud",
      timestamp: "3 days ago",
    },
  ];

  return (
    <div className="mt-5 px-20">
      <Card className="h-full px-5 py-3">
        <CardHeader className="text-xl font-bold flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-md font-bold">Recent Activity</p>
            <p className="text-sm font-medium text-gray-600">
              Latest content updates and System Events
            </p>
          </div>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody className="flex items-start justify-center h-full">
          <ul className="w-full space-y-4">
            {activityData.map((activity) => (
              <li
                key={activity.id}
                className="p-4 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.subtext}</p>
                  </div>
                  <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {activity.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
