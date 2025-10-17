"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/react";

type Props = {
  onBack: () => void;
};

export function GovOfficeFinder({ onBack }: Props) {

    const suggestedLocations = [
        { id: 1, name: "SSS - Pasig Branch", officeHours: "8:00 AM - 5:00 PM" },
        { id: 2, name: "LTO - Pasig District Office", officeHours: "8:00 AM - 5:00 PM" },
        { id: 3, name: "PhilHealth - Pasig City", officeHours: "8:00 AM - 5:00 PM" },
    ];

    return (
        <section className="w-full space-y-6 mt-10 mx-auto px-4">
            {/* Header */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => onBack()}
                    className="px-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 transition-colors duration-300 flex items-center gap-1 text-sm"
                    type="button"
                    aria-label="Back to details"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left-icon lucide-chevron-left"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h3 className="text-2xl sm:text-3xl font-bold">Locate Government Offices</h3>
            </div>

            {/* Google maps API placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Map (spans 2 columns on large) */}
                <Card className="lg:col-span-2">
                    <CardBody className="p-2 sm:p-4">
                        <div className="relative w-full overflow-hidden rounded-md">
                            <iframe
                                allowFullScreen
                                className="w-full h-[420px] sm:h-[520px] rounded-md"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56110.41769111237!2d121.01814942122655!3d14.5821271338699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c86c5ce479af%3A0x4c3b65da72e604a6!2sLand%20Transportation%20Office%20(LTO)%20-%20Pasig%20District%20Office!5e0!3m2!1sen!2sph!4v1760457451154!5m2!1sen!2sph"
                                title="LTO Pasig District Office Map"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Suggestions sidebar + Search bar */}
                <div className="space-y-3">
                    <div className="relative">
                        <input
                        className="w-full border-2 rounded-md px-3 py-2 pl-10"
                        placeholder="Search for offices..."
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ultra-violet">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="#595880"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line
                                strokeLinecap="round"
                                strokeWidth="2"
                                x1="21"
                                x2="16.65"
                                y1="21"
                                y2="16.65"
                            />
                        </svg>
                    </span>
                    </div>

                    {/* Placeholder suggested locations - if user clicks, the google map API is called with the location to be viewed in the finder to the left */}
                    <div className="text-md font-semibold">Suggested Offices</div>
                        <div className="space-y-4">
                            {suggestedLocations.map((loc) => (
                                <button
                                    className="w-full text-left"
                                    type="button"
                                    key={loc.id}
                                >
                                    <div className="flex items-center gap-3 bg-white shadow rounded-md p-3 hover:bg-gray-50 hover:border transition">
                                        <span className="flex-shrink-0 text-adult-green">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-map-pin-icon lucide-map-pin"
                                            >
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </span>
                                        <div className="flex flex-col">
                                            <div className="text-base font-bold text-adult-green">{loc.name}</div>
                                            <div className="text-sm text-gray-600 italic">Office Hours: {loc.officeHours}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                </div>
            </div>
        </section>
    );
}