"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();
  const locale = useLocale();

  const footerLinks = {
    company: [
      { href: `/${locale}/about`, label: t('navigation.about') },
      { href: `/${locale}/services`, label: t('navigation.services') },
      { href: `/${locale}/process`, label: t('navigation.process') },
      { href: `/${locale}/institutions`, label: t('navigation.institutions') },
    ],
    resources: [
      { href: `/${locale}/study-usa`, label: t('navigation.studyUsa') },
      { href: `/${locale}/contact`, label: t('navigation.contact') },
    ],
    legal: [
      { href: `/${locale}/privacy`, label: t('footer.privacy') },
      { href: `/${locale}/terms`, label: t('footer.terms') },
      { href: `/${locale}/refund`, label: t('footer.refund') },
    ],
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Study Frontier</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">{t('navigation.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@studyfrontier.com" className="hover:text-primary">
                  info@studyfrontier.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="tel:+212600000000" className="hover:text-primary">
                  +212 6XX XXX XXX
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Casablanca, Morocco</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>&copy; {currentYear} Study Frontier. {t('footer.rights')}</p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
