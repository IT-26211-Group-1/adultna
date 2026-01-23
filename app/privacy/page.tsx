"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            as={NextLink}
            className="text-olivine hover:text-adult-green"
            href="/"
            startContent={<ArrowLeft className="w-4 h-4" />}
            variant="light"
          >
            Back to Home
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-olivine mb-4 font-playfair">
              ADULTNA PRIVACY POLICY
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              Compliant with the Data Privacy Act of 2012 (RA 10173) and NPC IRR
            </p>
            <p className="text-sm text-gray-600">
              Last Updated: December 1, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-800">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                Introduction
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                AdultNa (&quot;we&quot;, &quot;our&quot;, &quot;the
                platform&quot;) is committed to protecting the privacy and
                security of your personal data in accordance with the Data
                Privacy Act of 2012 (RA 10173), its Implementing Rules and
                Regulations (IRR), and all applicable National Privacy
                Commission (NPC) issuances. This Privacy Policy explains what
                information we collect, how we use it, how we protect it, and
                the rights of data subjects.
              </p>
              <p className="mb-6 text-base leading-relaxed">
                By using AdultNa, you acknowledge that you have read and
                understood this Privacy Policy and consent to the collection and
                processing of your personal data as described herein.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                AdultNa collects personal data that you voluntarily provide, as
                well as certain information automatically generated through
                system logs, cookies, and analytics tools. Collection varies
                depending on the feature you access.
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-adult-green mb-3">
                  A. Personal Information You Provide
                </h3>
                <p className="mb-4 text-base leading-relaxed">
                  You may be asked to submit personal information to access
                  specific AdultNa services. Failure to provide required data
                  may limit platform functionality.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      1. Registration & Account Management
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Collected upon registration, login, onboarding, or when
                      updating your profile:
                    </p>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Full Name</li>
                      <li>Email Address</li>
                      <li>Password (encrypted)</li>
                      <li>Profile Photo (optional)</li>
                      <li>
                        Onboarding responses (skills, job interests, goals)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      2. Resume Builder & Cover Letter Builder
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Education and work history</li>
                      <li>Skills and certifications</li>
                      <li>Uploaded résumé documents</li>
                      <li>Generated résumé/cover letter drafts</li>
                      <li>Résumé Grader results and feedback</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      3. Mock Interview Coach
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Audio recordings of answers</li>
                      <li>Selected job role</li>
                      <li>Date/time of sessions</li>
                      <li>AI-generated scoring and feedback</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      4. AI Gabay Agent (Chatbot)
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Chat messages and conversation history</li>
                      <li>User queries</li>
                      <li>System logs related to AI usage</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      5. Goal Roadmap & Milestones
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Goals and milestones</li>
                      <li>Deadlines</li>
                      <li>Personal notes and progress updates</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      6. Adulting FileBox
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>
                        Uploaded documents (IDs, certificates, requirements)
                      </li>
                      <li>File metadata (filename, type, upload timestamp)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      7. GovGuides
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Government offices and services viewed</li>
                      <li>Requirements pages accessed</li>
                    </ul>
                    <p className="text-sm text-gray-600 italic">
                      (We do not collect personal data directly through this
                      feature.)
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      8. Job Board
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Job searches and filters</li>
                      <li>Job categories viewed</li>
                    </ul>
                    <p className="text-sm text-gray-600 italic">
                      (We do not store your external job applications.)
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      9. Feedback and Reports
                    </h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Email (if provided)</li>
                      <li>Feedback content</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      10. Admin Panel (Authorized Admins Only)
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Admins may access:
                    </p>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>User information</li>
                      <li>Audit logs</li>
                      <li>Uploaded content for verification</li>
                      <li>System analytics</li>
                    </ul>
                    <p className="text-sm text-gray-600 italic">
                      All admin activities are logged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-adult-green mb-3">
                  B. Credentials
                </h3>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Passwords (hashed/encrypted)</li>
                  <li>OAuth tokens for Google login</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-adult-green mb-3">
                  C. Social Media Login Data
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  If you sign in using Google:
                </p>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Profile photo (publicly available)</li>
                </ul>
                <p className="text-sm text-gray-600 italic">
                  Used only for authentication.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-adult-green mb-3">
                  D. Automatically Collected Information
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Collected through cookies, logs, or analytics:
                </p>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>IP address</li>
                  <li>Browser and device information</li>
                  <li>Usage logs</li>
                  <li>Pages accessed</li>
                  <li>General location (IP-based)</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-adult-green mb-3">
                  E. Information from Third Parties
                </h3>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Google OAuth</li>
                  <li>Job API data (non-personal)</li>
                  <li>Analytics tools</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                2. HOW DO WE USE YOUR INFORMATION?
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                Your personal data is processed for legitimate purposes,
                including:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    A. Providing and improving AdultNa features
                  </h3>
                  <p className="text-sm">
                    Resume tools, roadmap generation, mock interview coaching,
                    chatbot services, FileBox management, and job board results.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    B. Processing your account and registration
                  </h3>
                  <p className="text-sm">
                    Account creation, authentication, email verification, and
                    profile updates.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    C. Enhancing user experience
                  </h3>
                  <p className="text-sm">
                    Personalized recommendations, dashboard improvements, and
                    performance analytics.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    D. Communicating with you
                  </h3>
                  <p className="text-sm">
                    Notifications, updates, support responses, and policy
                    announcements.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    E. Ensuring platform security
                  </h3>
                  <p className="text-sm">
                    Activity monitoring, fraud prevention, and unauthorized
                    access detection.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    F. Compliance with legal and institutional requirements
                  </h3>
                  <p className="text-sm">
                    Including academic evaluation for capstone purposes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                3. LEGAL BASIS FOR PROCESSING
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                AdultNa processes personal data based on:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Your consent (upon registration and use)</li>
                <li>Contractual necessity (accessing platform services)</li>
                <li>
                  Legitimate interests (security, analytics, service
                  improvement)
                </li>
                <li>Compliance with legal and academic obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                4. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
              </h2>
              <p className="mb-4 text-base leading-relaxed font-medium">
                We do not sell, rent, or trade your personal information.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    A. Service Providers
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">Used for:</p>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Hosting</li>
                    <li>Email verification</li>
                    <li>Analytics</li>
                    <li>AI processing</li>
                  </ul>
                  <p className="text-sm text-gray-600 italic">
                    All service providers act as data processors and must comply
                    with the Data Privacy Act.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    B. Academic Requirements
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    As part of the AdultNa capstone project, we may present
                    anonymized, aggregated, or non-identifiable data to:
                  </p>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Academic panels</li>
                    <li>Faculty evaluators</li>
                  </ul>
                  <p className="text-sm text-gray-600 italic">
                    Identifiable personal data will not be shared unless
                    necessary and with prior consent.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                5. DO WE USE COOKIES?
              </h2>
              <p className="mb-4 text-base leading-relaxed">Yes, for:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Session management</li>
                <li>Analytics</li>
                <li>Preferences</li>
              </ul>
              <p className="text-base leading-relaxed">
                You may disable cookies, but some functions may not work
                properly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                6. HOW DO WE HANDLE SOCIAL MEDIA LOGINS?
              </h2>
              <p className="text-base leading-relaxed">
                Google Login is optional and used only for authentication and
                account setup.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                7. HOW LONG DO WE KEEP YOUR INFORMATION?
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                We retain data only for as long as necessary for:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Your active use of AdultNa</li>
                <li>Academic evaluation</li>
                <li>Compliance with legal obligations</li>
              </ul>
              <p className="text-base leading-relaxed">
                Afterwards, personal data will be securely deleted, anonymized,
                or archived. Users may request deletion at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                8. HOW DO WE KEEP YOUR INFORMATION SAFE?
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                We apply security measures such as:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Encryption</li>
                <li>Role-based access control</li>
                <li>Secure servers</li>
                <li>Audit logs</li>
                <li>Regular system checks</li>
              </ul>
              <p className="text-base leading-relaxed">
                While no system is completely risk-free, we take reasonable
                steps to protect personal data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                9. YOUR RIGHTS AS A DATA SUBJECT
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                Under RA 10173, you have the right to:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Be informed</li>
                <li>Access your personal data</li>
                <li>Object to processing</li>
                <li>Correct or update data</li>
                <li>Withdraw consent</li>
                <li>Request deletion or blocking</li>
                <li>File a complaint with the National Privacy Commission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                10. DATA BREACH RESPONSE
              </h2>
              <p className="text-base leading-relaxed">
                In the event of a data breach, AdultNa will notify affected
                users and the National Privacy Commission, following NPC
                Circular No. 16-03.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              For questions about this Privacy Policy or to exercise your
              rights, contact us at{" "}
              <Link
                className="text-adult-green hover:underline"
                href="mailto:adultna.org@gmail.com"
              >
                adultna.org@gmail.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
