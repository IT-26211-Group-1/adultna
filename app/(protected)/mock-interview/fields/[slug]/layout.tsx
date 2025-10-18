"use client";
import { Card, CardHeader, CardBody } from "@heroui/card";
import React from "react";
import ProtectedPageWrapper from "@/components/ui/ProtectedPageWrapper";
import { useSelectedLayoutSegments } from "next/navigation";

// Layout component for the [slug] route under mock-interview/fields
export default function FieldsSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const segments = useSelectedLayoutSegments();
  const hasRoleActive = segments && segments.length > 0; // when viewing /[slug]/[role]
  const backHref = hasRoleActive
    ? params.slug === "general"
      ? "/mock-interview"
      : `/mock-interview/fields/${params.slug}`
    : "/mock-interview";

  return (
    <ProtectedPageWrapper>
      {({ sidebarCollapsed }: { sidebarCollapsed: boolean }) => (
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "ml-10" : "ml-2"
          }`}
        >
          <main
            className={`transition-all duration-300 ${
              sidebarCollapsed
                ? "w-[calc(100%-40px)]"
                : "w-[calc(100%-30px)]"
            }`}
          >
            <div className="mt-5">
              <Card className="p-6 h-full flex flex-col">
                <CardHeader className="flex items-center gap-2">
                  <a
                    href={backHref}
                    className="inline-flex items-center px-3 py-1.5 mr-3 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    aria-label="Back to mock interview"
                  >
                    <svg
                      className="w-6 h-6 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </a>
                </CardHeader>
                <CardBody className="flex-1">
                  {hasRoleActive ? (
                    <div>
                      <h1 className="text-5xl font-medium text-center my-10 font-playfair">
                        Let’s Get You <span className="text-adult-green">Interview-Ready</span>
                      </h1>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-5xl font-medium text-center my-10 font-playfair">
                        Select Your Target <span className="text-adult-green">Job Role</span>
                      </h1>
                    </div>
                  )}
                  {children}
                </CardBody>
              </Card>
            </div>
          </main>
        </div>
      )}
    </ProtectedPageWrapper>
  );
}
