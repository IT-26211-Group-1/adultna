"use client";
import MilestoneTracker from './_components/MilestoneTracker';

export default function Page() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <MilestoneTracker />
        </section>
    );
}