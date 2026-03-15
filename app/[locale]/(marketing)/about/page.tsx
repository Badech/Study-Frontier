import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">About Study Frontier</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground">
          Study Frontier is a premium educational consulting service dedicated to helping Moroccan students achieve their dreams of studying in the United States.
        </p>
        <p className="mt-4 text-muted-foreground">
          With years of experience and deep knowledge of both the US education system and the unique needs of Moroccan students, we provide clear, confusion-free guidance through every step of the journey.
        </p>
      </div>
    </div>
  );
}
