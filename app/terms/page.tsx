"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              ADULTNA — TERMS AND CONDITIONS OF USE
            </h1>
            <p className="text-sm text-gray-600">
              Last Updated: December 1, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-800">
            <p className="mb-6 text-base leading-relaxed">
              These Terms and Conditions (&quot;Terms&quot;) govern your access
              to and use of AdultNa (the &quot;Platform&quot;), a
              career-readiness and adulting support system operated by the
              AdultNa Development Team, College of Information and Computing
              Sciences, University of Santo Tomas (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;). By creating an account,
              accessing any feature, or using the Platform in any capacity, you
              agree to be bound by these Terms. If you do not agree, you must
              discontinue use immediately.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                1. About AdultNa
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                AdultNa is an educational, career-preparation, and adulting
                assistance platform designed to help graduating students, fresh
                graduates, and young adults develop essential job readiness
                skills. The Platform provides digital tools such as:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Smart Resume Builder and Resume Grader</li>
                <li>Cover Letter Builder</li>
                <li>AI Gabay conversational assistant</li>
                <li>Personalized Roadmap and Milestone Tracker</li>
                <li>Mock Interview Coach</li>
                <li>Adulting Filebox document storage</li>
                <li>Government Guides (GovGuides)</li>
                <li>Integrated Job Board (via external API)</li>
              </ul>
              <p className="text-base">
                Features may be updated or enhanced at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                2. Eligibility
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                To use AdultNa, you must:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Be at least 18 years old;</li>
                <li>
                  Have the legal capacity to enter into a binding agreement; and
                </li>
                <li>
                  Provide accurate, complete, and truthful information when
                  registering your account.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                Users below 18 years old (&quot;Minors&quot;) may use the
                Platform only with the consent and supervision of a
                parent/guardian. By allowing a minor to use the Platform, the
                parent/guardian accepts responsibility for the minor&apos;s
                account and activities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                3. Account Registration and Security
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                By registering an account, you agree to:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Provide accurate and updated personal information;</li>
                <li>Maintain the confidentiality of your login credentials;</li>
                <li>
                  Notify us immediately if you suspect unauthorized access; and
                </li>
                <li>
                  Accept full responsibility for all actions taken through your
                  account.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                We reserve the right to suspend or terminate any account found
                to contain false information or to be involved in suspicious or
                harmful activity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                4. Features and Data Collected
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                Each feature of AdultNa collects only the data needed for it to
                function properly. Below is a clear breakdown:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.1 Account Registration & Onboarding
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>Full name, email address, password</li>
                    <li>Age range, education level, skills, and interests</li>
                    <li>Verification data (email confirmation)</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To create your profile,
                    personalize the onboarding experience, and secure your
                    account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.2 Smart Resume Builder & Resume Grader
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>Employment history, education, skills, achievements</li>
                    <li>Uploaded resume files (PDF, DOCX)</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To generate resume drafts, store
                    resume versions, and provide automated feedback.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.3 Cover Letter Builder
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>
                      Cover letter inputs (background, job role, experience)
                    </li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To create structured, editable
                    cover letter drafts tailored to user job roles.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.4 Mock Interview Coach
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>
                      Selected job role, audio responses, recorded answers,
                      timestamps
                    </li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To generate interview questions,
                    evaluate communication patterns, and store results for
                    review.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.5 AI Gabay (AI Assistant)
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>User-submitted queries, conversation history</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To answer questions, provide
                    career guidance, and maintain chat records for user
                    reference.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.6 Personalized Roadmap & Milestone Tracker
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>
                      User-chosen goals, tasks, deadlines, progress updates
                    </li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To generate and update
                    personalized career/adulting roadmaps.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.7 Adulting Filebox
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>
                      Uploaded files (valid IDs, certificates, important
                      personal documents)
                    </li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To allow users to store, preview,
                    search, and download personal documents securely.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.8 GovGuides
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>Search keywords and chosen government topics</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To display government service
                    information, requirements, and office locations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.9 Job Board
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>Search queries, selected job listings</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To retrieve job listings from
                    third-party APIs and redirect users to external job portals.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-adult-green mb-2">
                    4.10 Administrator & System Logs
                  </h3>
                  <p className="mb-2">
                    <strong>Collects:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-2 text-sm">
                    <li>Admin activities, changes to content, audit logs</li>
                    <li>User feedback, error reports</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Purpose:</strong> To maintain security, validate
                    content, and improve system performance.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                5. Acceptable Use Policy
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Upload harmful, malicious, or illegal content</li>
                <li>Use the Platform to harass, threaten, or exploit others</li>
                <li>
                  Misuse AI Gabay or attempt prompt manipulation/jailbreaking
                </li>
                <li>Upload copyrighted files without permission</li>
                <li>
                  Attempt to breach security, modify the system, or gain
                  unauthorized access
                </li>
                <li>
                  Use automated tools or bots that disrupt Platform operations
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                Violations may result in account suspension or permanent
                banning.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                6. Intellectual Property
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                All Platform content—including text, graphics, icons, mockups,
                code, algorithms, and instructional materials—is owned by the
                AdultNa Development Team or licensed to us.
              </p>
              <p className="mb-4 text-base leading-relaxed">
                You may use Platform-generated content (e.g., resume drafts,
                cover letters) for personal, career, or academic purposes.
                However, you may not:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Copy or reproduce the Platform&apos;s design or code</li>
                <li>Reverse-engineer or extract proprietary systems</li>
                <li>
                  Sell or redistribute Platform materials without permission
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                7. Third-Party Services
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                Some AdultNa features rely on third-party tools and APIs (e.g.,
                job listing providers, AI model services). By using these
                features, you agree to the respective third-party terms.
              </p>
              <p className="mb-4 text-base leading-relaxed">
                We are not responsible for:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>The accuracy of job listings from external APIs</li>
                <li>The content of third-party websites</li>
                <li>Data submitted directly to external sites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                8. Disclaimer of Warranties
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                AdultNa is provided &quot;as is&quot; and &quot;as
                available.&quot;
              </p>
              <p className="mb-4 text-base leading-relaxed">
                We do not guarantee:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Perfect accuracy of AI-generated responses</li>
                <li>Error-free or uninterrupted access</li>
                <li>
                  That job listings or career suggestions guarantee employment
                </li>
                <li>
                  That stored files will never experience technical issues
                  (although we implement safeguards)
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                Users should exercise judgment and verify critical information
                independently.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-olivine mb-4 font-playfair">
                9. Limitation of Liability
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                To the maximum extent permitted by law, the AdultNa Development
                Team shall not be liable for:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Loss of data, employment opportunities, or income</li>
                <li>
                  Damages resulting from reliance on AI-generated suggestions
                </li>
                <li>Unauthorized access caused by user negligence</li>
                <li>Third-party website actions or content</li>
              </ul>
              <p className="text-base leading-relaxed">
                Our total liability, if any, is limited to the amount paid by
                the user (AdultNa is currently free, so liability is zero).
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              For questions about these Terms, contact us at{" "}
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
