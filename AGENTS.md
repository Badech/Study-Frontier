# Study Frontier - Developer Agent Memory

## Project Overview

**Study Frontier** is a premium, USA-first educational consulting platform for Moroccan students pursuing studies in the USA.

**Core Promise:** Clear Process. No Confusion.

### Product Architecture

This is a full-stack platform with 4 distinct user-facing layers:

1. **Public marketing website** - Trust-building, lead generation, partner credibility
2. **Student portal** - Document management, progress tracking, appointments, payments, visa workflow
3. **Admin dashboard** - Lead management, student operations, workflow control, payments, reporting
4. **Parent/sponsor view** - Read-only access to student progress

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5+ (strict mode enabled)
- **Runtime:** React 19.2.3
- **Styling:** Tailwind CSS 4.x (PostCSS-based, no config file)
- **Backend:** Supabase (auth, database, storage)
- **Forms:** React Hook Form 7.x + Zod 4.x validation
- **i18n:** next-intl 4.8.3 (English, French, Arabic with RTL support)
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge
- **Deployment:** Vercel
- **Package Manager:** pnpm (with workspace support)

## Project Structure

```
/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── page.tsx           # Homepage
│   └── globals.css        # Tailwind imports and CSS variables
├── docs/                   # Product and technical documentation
│   ├── PRD.md             # Complete Product Requirements Document
│   ├── architecture.md    # Technical architecture (empty, to be filled)
│   ├── roadmap.md         # Product roadmap (empty, to be filled)
│   └── sprints/           # Sprint-by-sprint implementation plans
├── public/                 # Static assets
├── .rovodev/              # Agent configuration
└── AGENTS.md              # This file - developer instructions
```

### Future Structure (Not Yet Created)

As per sprint 00-bootstrap.md, the following should be created:

- `lib/` - Shared utilities, Supabase client, API helpers
- `types/` - TypeScript type definitions
- `components/` - Reusable React components
- Route groups in `app/` for marketing, student portal, admin dashboard

## Development Guidelines

### Build Rules

- **Plan before coding** - Understand requirements fully before implementation
- **One major feature per session** - Focus on single vertical slice
- **Never mix critical systems** - Don't combine auth, payments, and portal changes unless explicitly required
- **Design → Implement → Test → Document** - Follow this flow for every feature
- **Use typed validation** - Zod schemas for all form inputs and API boundaries
- **Keep components reusable** - Extract common patterns into shared components
- **Add tests for business logic** - Critical flows must have test coverage
- **Stop and report blockers** - Never guess or make assumptions on unclear requirements

### Code Standards

- **TypeScript strict mode** - No `any` types, proper type safety
- **Path aliases** - Use `@/*` for absolute imports from root
- **Functional components** - React function components with hooks
- **CSS-in-Tailwind** - Use Tailwind classes, avoid custom CSS unless necessary
- **Form validation** - Always use Zod + React Hook Form together
- **Error handling** - Graceful error states with clear user messaging

### Styling Conventions

- **Tailwind CSS 4.x** - Uses PostCSS plugin, no `tailwind.config.js` file
- **CSS Variables** - Defined in `app/globals.css` with `@theme inline`
- **Dark mode** - Supports `prefers-color-scheme` media query
- **Fonts** - Geist Sans and Geist Mono from `next/font/google`
- **Mobile-first** - All UI must work on mobile first, then scale up
- **Premium aesthetic** - Clean, minimal, professional - not flashy

### Component Organization

When creating components:

- Use `clsx` or `tailwind-merge` for conditional classes
- Extract repeated patterns into reusable components
- Keep components small and focused (single responsibility)
- Use TypeScript interfaces for props
- Add JSDoc comments for complex logic

### Form Handling

Standard pattern for forms:

```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  // Define schema
});

type FormData = z.infer<typeof schema>;

// Use zodResolver in useForm
```

## User Roles and Access Control

### Role Definitions

1. **Student** - Primary user, manages own profile, documents, applications
2. **Parent/Sponsor** - Read-only view of student's progress (no editing)
3. **Admin** - Full access to all students, lead management, operations
4. **Future: Counselor** - Staff role for multi-admin workflows

### Access Rules

- **Mobile-first:** Website and student portal must be mobile-optimized
- **Desktop-first admin:** Admin dashboard optimized for desktop but mobile-usable for quick actions
- **Strong RBAC:** Enforce role-based access control at API and UI levels
- **Parent view is read-only:** Parents/sponsors cannot modify anything

## Internationalization (i18n)

- **Languages:** English, French, Arabic
- **RTL Support:** Full right-to-left layout for Arabic
- **Key pages in all languages:** Homepage, core marketing pages, portal UI
- **Implementation:** Using next-intl 4.8.3

## Payment Integration

### Current (MVP)

- **Provider:** PayPal Business
- **Flow:** Manual invoice generation by admin
- **Reason:** Fast launch, no complex integration needed

### Future

- **Architecture:** Payment provider abstraction layer
- **Target:** Moroccan payment gateway integration
- **Features:** Installment tracking, automated invoicing

## Business Logic Rules

### Non-Negotiables

- ✅ Mobile-first website and student portal
- ✅ Desktop-first admin (but mobile-usable)
- ✅ English, French, Arabic on key pages with RTL support
- ✅ Strong role-based access control
- ❌ No fake testimonials
- ❌ No public exact pricing
- ❌ Parent/sponsor role cannot edit or modify
- ❌ DS-160 is intake/review workflow only, NOT direct government submission

### Student Progress Workflow

Students move through defined stages (see PRD.md section 14):

1. Initial Assessment
2. Profile Building
3. Document Collection
4. Applications
5. Visa Preparation
6. Pre-Departure

Each stage has specific tasks, documents, and next actions.

### Document Management

- Students upload documents
- Admin reviews and marks status (pending, approved, needs revision)
- Version control for resubmissions
- Acceptance criteria and feedback system

### DS-160 Module

- **Important:** This is NOT a direct government submission tool
- Students fill DS-160 form data in the portal
- Admin reviews and provides guidance
- Student manually submits to actual government system
- Portal tracks completion status only

## UX Principles

In order of priority:

1. **Trust first** - Users must feel confident in the service
2. **Clarity second** - Every step should be crystal clear
3. **Premium but not flashy** - Professional, elegant, not over-designed
4. **Human guidance + modern system** - Technology enables, humans guide

### Voice and Tone

- 70% clear and informative
- 30% premium and minimal
- No jargon or confusing terminology
- Realistic advice, no false promises

## Development Workflow

### Sprint Organization

Follow the sprint plans in `docs/sprints/`:

- **Sprint 00:** Bootstrap (structure, layout, theme)
- **Sprint 01:** Marketing site (public pages)
- **Sprint 02:** Supabase and schema
- **Sprint 03:** Auth and roles
- **Sprint 04:** Student portal
- **Sprint 05:** Admin dashboard
- **Sprint 06:** Documents and applications
- **Sprint 07:** DS-160 and visa workflow
- **Sprint 08:** Payments and notifications
- **Sprint 09:** CMS and i18n
- **Sprint 10:** Hardening and release

### Before Starting Work

1. Read relevant sprint documentation in `docs/sprints/`
2. Review PRD.md for product requirements
3. Check existing code patterns
4. Plan the implementation approach
5. Identify test scenarios

### Git Workflow

- Use descriptive commit messages
- Reference sprint numbers when relevant
- Keep commits focused and atomic
- Don't commit `.env` files (already in .gitignore)

## Environment Setup

### Required Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# PayPal (temporary)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Add others as needed
```

### Running the Project

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Common Patterns

### Supabase Integration

- Use `@supabase/ssr` for server-side rendering
- Use `@supabase/supabase-js` for client operations
- Always handle auth state properly
- Use Row Level Security (RLS) policies

### Route Organization

When implementing route groups:

- `(marketing)/` - Public website pages
- `(student)/` - Student portal pages (requires auth)
- `(admin)/` - Admin dashboard pages (requires admin role)
- `(parent)/` - Parent view pages (read-only)

### Data Fetching

- Use Server Components by default
- Client Components only when needed (interactivity, hooks)
- Handle loading and error states
- Use Suspense boundaries appropriately

## Key Documentation

- **Full Product Requirements:** `docs/PRD.md`
- **Sprint Plans:** `docs/sprints/*.md`
- **Architecture:** `docs/architecture.md` (to be filled)
- **Roadmap:** `docs/roadmap.md` (to be filled)

## Important Reminders

### What This Platform Is

- A premium, organized, tech-enabled consulting service
- A tool to enable human guidance, not replace it
- A trust-building system for families making big decisions

### What This Platform Is NOT

- A self-service DIY application tool
- A direct government submission system
- A marketplace or comparison site
- A promise of guaranteed admission or visa approval

## Testing Strategy

When implementing features:

- Unit tests for utility functions and validation schemas
- Integration tests for critical user flows
- Manual testing on mobile devices (mobile-first!)
- Test all three languages when i18n is implemented
- Test RTL layout for Arabic
- Test all user roles and access controls

## Performance Considerations

- Optimize images with Next.js Image component
- Lazy load non-critical components
- Use proper caching strategies
- Monitor Core Web Vitals
- Keep bundle size reasonable

## Security Checklist

- ✅ Never expose service role keys to client
- ✅ Implement proper RLS policies in Supabase
- ✅ Validate all user inputs with Zod
- ✅ Sanitize user-generated content
- ✅ Use HTTPS only (enforced by Vercel)
- ✅ Implement CSRF protection for forms
- ✅ Rate limit sensitive endpoints

## Questions or Blockers?

If you encounter unclear requirements:

1. Check `docs/PRD.md` first
2. Review relevant sprint documentation
3. Look for patterns in existing code
4. Ask specific questions rather than making assumptions
5. Document decisions and alternatives considered
