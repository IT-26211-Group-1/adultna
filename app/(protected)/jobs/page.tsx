import JobBoard from "./_components/JobBoard";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Job Board - AdultNa | Find Jobs in the Philippines",
  description:
    "Discover job opportunities in the Philippines. Search for full-time, part-time, contract, and remote positions. Find your next career opportunity with AdultNa job board.",
  keywords:
    "jobs Philippines, remote jobs, job search, career opportunities, employment Philippines",
  openGraph: {
    title: "Job Board",
    description: "Find your next opportunity in the Philippines",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = 'https://jsearch.p.rapidapi.com';
                document.head.appendChild(link);
              });
            }
          `,
        }}
        id="jsearch-dns-prefetch"
        strategy="lazyOnload"
      />
      <div className="p-6">
        <JobBoard />
      </div>
    </>
  );
}
