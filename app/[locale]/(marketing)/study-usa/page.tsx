import { getTranslations } from 'next-intl/server';

export default async function StudyUsaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Study in the USA</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Discover why thousands of international students choose American universities for their higher education.
        </p>
      </div>

      <div className="prose prose-lg mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold">Why Study in the USA?</h2>
        <p className="text-muted-foreground">
          The United States is home to some of the world's most prestigious universities and offers unparalleled opportunities for academic growth, research, and career development.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">Academic Excellence</h2>
        <p className="text-muted-foreground">
          American universities are consistently ranked among the best in the world, offering cutting-edge research facilities, renowned faculty, and diverse academic programs.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">Cultural Experience</h2>
        <p className="text-muted-foreground">
          Studying in the USA provides a unique opportunity to experience American culture, build international networks, and develop a global perspective.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">Career Opportunities</h2>
        <p className="text-muted-foreground">
          A US degree is highly valued worldwide and can open doors to exciting career opportunities both in the United States and internationally.
        </p>
      </div>
    </div>
  );
}
