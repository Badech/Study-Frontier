import Link from "next/link";

/**
 * Main navigation component
 * Placeholder for Sprint 00 - will be enhanced in Sprint 01 with full navigation
 */
export function Navigation() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Study Frontier
            </Link>
          </div>

          {/* Navigation Links - Placeholder */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              About
            </Link>
            <Link href="/services" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Services
            </Link>
            <Link href="/contact" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Contact
            </Link>
          </div>

          {/* CTA Button - Placeholder */}
          <div className="flex items-center gap-4">
            <Link
              href="/assessment"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get Assessed
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
