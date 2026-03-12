import Link from "next/link";
import { useTranslations } from 'next-intl';
import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileCheck, Users, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        subtitle={t('hero.subtitle')}
        title={t('hero.title')}
        description={t('hero.description')}
        cta={
          <>
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{t('hero.startJourney')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/${locale}/process`}>{t('hero.howItWorks')}</Link>
            </Button>
          </>
        }
      />

      {/* Trust Indicators */}
      <section className="border-y border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-primary">100+</div>
              <p className="mt-2 text-sm text-muted-foreground">{t('trustIndicators.studentsGuided')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50+</div>
              <p className="mt-2 text-sm text-muted-foreground">{t('trustIndicators.partnerUniversities')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">95%</div>
              <p className="mt-2 text-sm text-muted-foreground">{t('trustIndicators.visaSuccessRate')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('whyChooseUs.title')}</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<GraduationCap className="h-6 w-6" />}
              title={t('whyChooseUs.expertGuidance.title')}
              description={t('whyChooseUs.expertGuidance.description')}
            />
            <FeatureCard
              icon={<FileCheck className="h-6 w-6" />}
              title={t('whyChooseUs.clearProcess.title')}
              description={t('whyChooseUs.clearProcess.description')}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title={t('whyChooseUs.personalizedSupport.title')}
              description={t('whyChooseUs.personalizedSupport.description')}
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title={t('whyChooseUs.usaFocus.title')}
              description={t('whyChooseUs.usaFocus.description')}
            />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('services.title')}</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-4 text-2xl font-semibold">{t('services.universitySelection.title')}</h3>
              <ul className="mb-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.universitySelection.features.matching')}</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.universitySelection.features.strategy')}</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.universitySelection.features.review')}</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}/services`}>
                  {t('services.universitySelection.learnMore')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-8">
              <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {t('services.completeJourney.badge')}
              </div>
              <h3 className="mb-4 text-2xl font-semibold">{t('services.completeJourney.title')}</h3>
              <ul className="mb-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.completeJourney.features.application')}</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.completeJourney.features.visa')}</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.completeJourney.features.preDeparture')}</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href={`/${locale}/services`}>
                  {t('services.completeJourney.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-4 text-2xl font-semibold">{t('services.visaSupport.title')}</h3>
              <ul className="mb-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.visaSupport.features.ds160')}</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.visaSupport.features.interview')}</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{t('services.visaSupport.features.verification')}</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}/services`}>
                  {t('services.visaSupport.learnMore')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('cta.title')}</h2>
            <p className="mb-8 text-lg opacity-90">
              {t('cta.description')}
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}/contact`}>{t('cta.bookConsultation')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
