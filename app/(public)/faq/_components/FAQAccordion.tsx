"use client";

import { Accordion, AccordionItem } from "@heroui/react";

export function FAQAccordion() {
  const faqItems = [
    {
      question: "What is AdultNa?",
      answer: "AdultNa is an all-in-one platform designed to simplify essential life processes for young adults. We provide step-by-step guidance, tools, and resources to help you navigate government services and career development with ease."
    },
    {
      question: "How does AdultNa work?",
      answer: "AdultNa works by providing personalized guidance through our various tools including GovGuides for government services, Mock Interview Coach for career preparation, Smart Resume Builder, and our AI-powered assistant. Simply choose the service you need and follow our step-by-step process."
    },
    {
      question: "Is AdultNa secure?",
      answer: "Yes, AdultNa takes security seriously. We use industry-standard encryption and security measures to protect your personal information. Your data is stored securely and we never share your information with third parties without your consent."
    },
    {
      question: "What is the Storage Limit for the Adulting Filebox?",
      answer: "You will have plenty of room to store your files with AdultNa! Every account includes up to 100 MB of free storage for your documents, so you can securely keep your resumes, IDs, and other important files organized and easy to access anytime."
    }
  ];

  return (
    <div className="space-y-3 pt-16 md:pt-20 lg:pt-24">
      <Accordion
        variant="splitted"
        className="px-0"
        itemClasses={{
          base: "py-2 px-4 rounded-lg border border-gray-100 bg-olivine/10 shadow-xs",
          title: "font-medium text-gray-900 text-sm",
          trigger: "py-3 px-0 hover:bg-transparent",
          content: "text-gray-600 text-sm leading-relaxed pt-1 pb-2 text-justify",
          indicator: "text-ultra-violet"
        }}
      >
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index + 1}
            aria-label={item.question}
            title={item.question}
            indicator={({ isOpen }) => (
              <div className="flex items-center justify-center w-8 h-8 bg-ultra-violet rounded-full text-white">
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-270' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          >
            <div className="max-w-none">
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
