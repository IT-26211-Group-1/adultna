import GuideDetailClient from "../_components/GuideDetailClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return [];
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GuideDetailClient slug={slug} />
    </div>
  );
}
