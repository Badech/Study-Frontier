/**
 * Marketing Homepage
 * Sprint 00: Basic placeholder - will be enhanced in Sprint 01
 */
export default function MarketingHomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Clear Process. No Confusion.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Premium educational consulting for Moroccan students pursuing studies in the USA.
            Structured guidance, honest advice, and serious preparation.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/assessment"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Free Eligibility Assessment
            </a>
            <a
              href="/contact"
              className="text-sm font-semibold leading-6 text-foreground"
            >
              Contact Us <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
              For Bachelor&apos;s, Master&apos;s & Affordable Pathways
            </p>
            <p className="text-sm text-muted-foreground">
              Guidance for Moroccan Students
            </p>
            <p className="text-sm text-muted-foreground">
              English • Français • العربية
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Sprint 00 Bootstrap Complete - Full marketing content coming in Sprint 01
          </p>
        </div>
      </section>
    </div>
  );
}
