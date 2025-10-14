"use client";

type Props = {
  id: string;
  onBack: () => void;
    onFindOffice?: () => void;
};

import {Tabs, Tab, Card, CardBody, Divider} from "@heroui/react";
import { sampleGuides } from "../_components/GovGuidesList";

export function GovGuideDetails({ id, onBack, onFindOffice }: Props) {
  const guide = sampleGuides.find(g => g.id === id);

  const reminders = [
    "Bring both original documents and photocopies.",
    "All documents must be clear and readable.",
    "Arrive early to avoid long queues.",
    "Expired IDs are not accepted.",
    "PSA Birth Certificates must be original copies.",
    "For minors, ensure to have parental consent forms if applicable.",
    "Check the validity of your supporting documents before submission.",
  ];

  return (
    <section className="w-full space-y-4 mt-10">
        <div className="flex items-center gap-5">
            <button onClick={onBack} className="px-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 transition-colors duration-300 flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h3 className="text-2xl sm:text-3xl font-bold">{id.replace(/-/g, " ").toUpperCase()}</h3>
        </div>

        <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h1 className="text-lg font-bold text-ultra-violet">Processing Fee</h1>
                <p className="text-2xl mt-5">{guide?.fee ?? "N/A"}</p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h1 className="text-lg font-bold text-ultra-violet">Processing Time</h1>
                <p className="text-2xl mt-5">{guide?.duration ?? "N/A"}</p>
            </div>
            <button
                className="flex-1 bg-white rounded-lg shadow p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-300 hover:border"
                type="button"
                onClick={() => onFindOffice?.()}
            >
                <div>
                    <h1 className="text-lg font-bold text-ultra-violet">Find Nearest Office</h1>
                    <p className="text-sm mt-2 text-gray-400 italic">Redirects you to GovMap</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pinned-icon lucide-map-pinned mr-5"><path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/></svg>
            </button>
        </div>

        <div>
            <Tabs
                fullWidth={true}
                size="lg"
                variant="underlined"
                classNames={{
                    cursor: "bg-adult-green"
                }}
            >
                {/* Guide Tab - data pulled from sample array in GovGuidesList */}
                <Tab key="Guide" title="Complete Guide">
                    <Card className="p-5">
                        <CardBody>
                            <div className="font-bold text-2xl">{guide?.title ?? "N/A"}</div>
                            <p className="text-sm mt-2 text-gray-500 italic">{guide?.description ?? "N/A"}</p>
                            {guide?.steps ? (
                                <ol className="list-disc ml-12 space-y-2 mt-4">
                                    {guide.steps.map((step, idx) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ol>
                            ) : (
                                <div>N/A</div>
                            )}
                        </CardBody>
                    </Card>
                </Tab>

                {/* Requirements Tab - data pulled from sample array in GovGuidesList */}
                <Tab key="Requirements" title="Requirements">
                    <Card className="p-5">
                        <CardBody>
                            <h1 className="font-bold text-2xl">Complete Document Checklist</h1>
                            <p className="text-sm mt-2 text-gray-500 italic">Ensure that you have all the documents before visiting the office to avoid delays.</p>
                            {guide?.steps ? (
                                <ol className="list-disc ml-12 space-y-2 mt-4">
                                    {guide.requirements.map((step, idx) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ol>
                            ) : (
                                <div>N/A</div>
                            )}
                            <Card className="mt-5 p-2 bg-amber-100 border-l-4 border-amber-200">
                                <CardBody>
                                    <p className="font-bold text-sm mb-2">Important Reminders:</p>
                                    {reminders ? (
                                        <ol className="list-disc ml-12 space-y-2 text-sm">
                                            {reminders.map((step, idx) => (
                                                <li key={idx}>{step}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <div>N/A</div>
                                    )}
                                </CardBody>
                            </Card>
                        </CardBody>
                    </Card>
                </Tab>
                
                {/* These tips are placeholders ONLY! -- hard-coded so not the final output */}
                <Tab key="Tips" title="General Tips">
                    <Card className="p-5">
                        <CardBody>
                            <h1 className="font-bold text-2xl mb-2">General Tips for a Smooth Processing</h1>
                            <p className="text-sm text-gray-500 italic">The following tips are based on government policies, public service guidelines, and official practices to help you prepare better when transacting with government offices.</p>
                            <Divider className="my-4" />
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h2 className="text-adult-green font-bold text-md">What to Prepare and Practice</h2>
                                    <ul className="list-decimal ml-12 space-y-2 text-md">
                                        <li>Double-check that you have all required documents before your visit.</li>
                                        <li>Make photocopies of all important documents to submit, if required.</li>
                                        <li>Arrive early to avoid long queues and ensure you have ample time for processing.</li>
                                        <li>Dress appropriately as some government offices may have dress codes.</li>
                                        <li>Be polite and patient with government staff; they are there to help you.</li>
                                        <li>Bring a pen and notebook to take notes if necessary.</li>
                                        <li>Have a valid ID with you for identity verification purposes.</li>
                                    </ul>
                                </div>
                                <Divider orientation="vertical" className="h-auto self-stretch mx-4" />
                                <div>
                                    <h2 className="text-red-800 font-bold text-md">What to Avoid</h2>
                                    <ul className="list-decimal ml-12 space-y-2 text-md">
                                        <li>Do not bring prohibited items such as weapons or illegal substances.</li>
                                        <li>Avoid using your phone or other electronic devices in restricted areas.</li>
                                        <li>Do not engage in disruptive behavior or arguments with staff.</li>
                                        <li>Avoid wearing inappropriate clothing that may violate dress codes.</li>
                                        <li>Do not provide false information or documents during your transaction.</li>
                                    </ul>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>

    </section>
  );
}