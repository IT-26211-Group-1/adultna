'use client'

import NextLink from "next/link"
import { Card, CardBody } from "@heroui/react"

export function ResumeDashboard() {
  const options = [
    {
      title: "Build a Resume",
      description: "Choose from our templates then we’ll guide you through each section.",
      href: "/resumes/editor",
    },
    {
      title: "Upload your Existing Resume",
      description: "Transfer your current resume’s details to one of our templates.",
      href: "/resumes/import",
    },
    {
      title: "Grade Your Resume",
      description: "Get AI recommendations to improve your resume.",
      href: "/resumes/grader",
    },
    {
      title: "My Resumes",
      description: "Manage your saved resumes or continue where you left off.",
      href: "/resumes",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Start <span className="text-green-700">Building</span> Your Resume
        </h1>
        <p className="text-gray-600 text-lg">First impressions start here.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">How would you like to start?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {options.map((option, idx) => (
            <NextLink key={idx} href={option.href} passHref>
              <Card
                isPressable
                shadow="none"
                className="h-full border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
              >
                <CardBody className="p-6 flex flex-col items-center justify-center text-center min-h-[180px]">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                </CardBody>
              </Card>
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  )
}
