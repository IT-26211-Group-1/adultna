"use client";
import { Accordion, AccordionItem } from "@heroui/react";
export function FAQAccordion() {
  // Sample questions and answers (to be replaced with actual FAQ data - to be connected to a database or API)
  const questionTitles = [
    "What is AdultNa?",
    "How does AdultNa work?",
    "Is AdultNa free to use?",
    "Can I use AdultNa on my mobile device?",
    "Would AdultNa still be useful if I am not a young adult?",
    "Is AdultNa designed for a specific region or country?",
    "How often is the content on AdultNa updated?",
    "Can I contribute to the content on AdultNa?",
    "Is my personal information safe with AdultNa?",
    "What should I do if I encounter a problem while using AdultNa?"
  ];
  const faqAnswers = [
    "AdultNa is a comprehensive platform designed to assist young adults in navigating various aspects of adulthood, including government services, financial literacy, career development, and personal growth.",
    "AdultNa works by providing a user-friendly interface that connects young adults with the resources and information they need to make informed decisions.",
    "Yes, AdultNa is completely free to use. We believe in providing accessible resources for all young adults.",
    "Absolutely! AdultNa is designed to be mobile-friendly, allowing you to access information and resources on the go.",
    "Yes, AdultNa is beneficial for individuals of all ages, as it covers a wide range of topics relevant to adulthood.",
    "AdultNa is designed to for Manila residents, but we are working on expanding our resources to cover other regions in the future.",
    "AdultNa is committed to regularly updating its content to ensure that users have access to the most current and relevant information.",
    "Yes, we welcome contributions from users who want to share their knowledge and expertise to help others in the community.",
    "AdultNa takes user privacy and data security seriously. We implement strict measures to protect your personal information.",
    "If you encounter any issues while using AdultNa, please reach out to our support team for assistance."
  ];
  return (
    <>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight font-playfair text-center mx-auto mb-6 sm:mb-8">
        Here&#39;s <span className="italic underline font-medium text-ultra-violet/80">Everything</span> You Need To Know...
      </h1>
      <Accordion variant="splitted">
        <AccordionItem
          key="1"
          aria-label="Accordion 1"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[0]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[0]}</div>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Accordion 2"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[1]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[1]}</div>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Accordion 3"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[2]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[2]}</div>
        </AccordionItem>
        <AccordionItem
          key="4"
          aria-label="Accordion 4"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[3]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[3]}</div>
        </AccordionItem>
        <AccordionItem
          key="5"
          aria-label="Accordion 5"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[4]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[4]}</div>
        </AccordionItem>
        <AccordionItem
          key="6"
          aria-label="Accordion 6"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[5]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[5]}</div>
        </AccordionItem>
        <AccordionItem
          key="7"
          aria-label="Accordion 7"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[6]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[6]}</div>
        </AccordionItem>
        <AccordionItem
          key="8"
          aria-label="Accordion 8"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[7]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[7]}</div>
        </AccordionItem>
        <AccordionItem
          key="9"
          aria-label="Accordion 9"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[8]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[8]}</div>
        </AccordionItem>
        <AccordionItem
          key="10"
          aria-label="Accordion 10"
          title={<span className="font-semibold text-ultra-violet">{questionTitles[9]}</span>}
        >
          <div className="text-sm sm:text-base text-black leading-relaxed py-2">{faqAnswers[9]}</div>
        </AccordionItem>
      </Accordion>
    </>
  );
}