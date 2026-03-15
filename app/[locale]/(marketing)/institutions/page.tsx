import { getTranslations } from 'next-intl/server';

export default async function InstitutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">For Institutions</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Partner with Study Frontier to connect with qualified Moroccan students ready to study in the USA.
        </p>
      </div>

      <div className="prose prose-lg mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold">Partnership Opportunities</h2>
        <p className="text-muted-foreground">
          We work closely with US universities and colleges to facilitate the recruitment of high-quality international students from Morocco.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">Our Value Proposition</h2>
        <ul className="text-muted-foreground">
          <li>Pre-screened, motivated students with strong academic backgrounds</li>
          <li>Comprehensive application support ensuring complete, quality submissions</li>
          <li>Cultural preparation to help students succeed on your campus</li>
          <li>Ongoing support to improve retention and student success</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">Get in Touch</h2>
        <p className="text-muted-foreground">
          Interested in partnering with us? Contact our institutional partnerships team to learn more about how we can work together.
        </p>
      </div>
    </div>
  );
}
