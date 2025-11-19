import GuideDetailClient from "../_components/GuideDetailClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/guides/public`
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
