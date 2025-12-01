"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RESUME_LINKS } from "@/constants/resume-links";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FileText, Upload } from "lucide-react";
import ResumeGrader from "../grader/_components/ResumeGrader";

type TabType = "create" | "my-resumes" | "grade";

export function ResumeDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [showingResults, setShowingResults] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab && ["create", "my-resumes", "grade"].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  const tabs = [
    { id: "create", label: "Create" },
    { id: "my-resumes", label: "My Resumes" },
    { id: "grade", label: "Grade Resume" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-50/30 via-yellow-50/20 to-gray-50">
      {/* Breadcrumb - Always visible except when showing results */}
      {!showingResults && (
        <div
          className="bg-transparent w-full"
          style={{
            minHeight: "auto",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overflow: "visible",
          }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
                <Breadcrumb
                  items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Resume Builder", current: true },
                  ]}
                />

                {/* Tabs - Always visible on sm+ screens */}
                <div className="hidden sm:flex gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-emerald-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => {
                        if (tab.id === "my-resumes") {
                          router.push("/resume-builder/my-resumes");

                          return;
                        }
                        setActiveTab(tab.id as TabType);

                        const newUrl = new URL(window.location.href);

                        newUrl.searchParams.set("tab", tab.id);
                        window.history.pushState({}, "", newUrl);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {tab.label}
                      </span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 animate-[slideIn_0.3s_ease-out]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tabs - Closer to content on small screens */}
          <div className="sm:hidden px-4 py-2">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-1 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-2 py-2 text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-emerald-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      if (tab.id === "my-resumes") {
                        router.push("/resume-builder/my-resumes");

                        return;
                      }
                      setActiveTab(tab.id as TabType);

                      const newUrl = new URL(window.location.href);

                      newUrl.searchParams.set("tab", tab.id);
                      window.history.pushState({}, "", newUrl);
                    }}
                  >
                    <span className="flex items-center gap-1">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 animate-[slideIn_0.3s_ease-out]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Create Tab */}
        {activeTab === "create" && (
          <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
            {/* Hero Section */}
            <div className="text-center space-y-2.5 max-w-2xl mx-auto">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                Start <span className="text-emerald-600">Building</span> Your
                Resume
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                First impressions start here. Choose your path to create an
                outstanding resume that gets noticed.
              </p>
            </div>

            {/* Action Cards */}
            <div>
              <h2 className="text-base font-medium text-gray-900 mb-5 text-center">
                How would you like to start?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* My Resumes */}

                {RESUME_LINKS.slice(0, 2).map((link, index) => {
                  const icons = [FileText, Upload];
                  const IconComponent = icons[index];
                  const isPrimary = index === 0;

                  return (
                    <NextLink key={index} href={link.href}>
                      <button
                        className={`group rounded-xl p-6 hover:shadow-md transition-all duration-300 text-left w-full ${
                          isPrimary
                            ? "bg-emerald-50 border border-emerald-200 hover:border-emerald-300"
                            : "bg-white border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300 ${
                            isPrimary ? "bg-emerald-100" : "bg-gray-50"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isPrimary ? "text-emerald-600" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                          {link.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {link.description}
                        </p>
                      </button>
                    </NextLink>
                  );
                })}
              </div>

              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                  Need help choosing?{" "}
                  <span className="text-emerald-600 font-medium">
                    Build a Resume
                  </span>{" "}
                  is perfect for beginners.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GRADE TAB */}
        {activeTab === "grade" && (
          <div className="animate-[fadeIn_0.4s_ease-out]">
            <ResumeGrader onResultsChange={setShowingResults} />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
