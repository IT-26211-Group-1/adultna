import { Metadata } from "next";
import GuideDetailClient from "../_components/GuideDetailClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Guide = {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/guides/public/${slug}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return {
        title: "Guide Not Found",
        description: "The requested guide could not be found.",
      };
    }

    const data = await response.json();
    const guide: Guide = data.guide;

    return {
      title: `${guide.title} | AdultNa Government Guides`,
      description: guide.description,
      keywords: guide.keywords || [],
      openGraph: {
        title: guide.title,
        description: guide.description,
        type: "article",
        url: `https://adultna.com/gov-guides/${guide.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: guide.title,
        description: guide.description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      other: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    };
  } catch (error) {
    console.error("Error fetching guide metadata:", error);

    return {
      title: "Government Guides | AdultNa",
      description: "Your guide to adulting in the Philippines",
    };
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/guides/public`,
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const guides = data.guides || [];

    return guides.map((guide: any) => ({
      slug: guide.slug,
    }));
  } catch (error) {
    console.error("Error fetching guides for static generation:", error);

    return [];
  }
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GuideDetailClient slug={slug} />
    </div>
  );
}
