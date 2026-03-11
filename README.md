# Study Frontier

A premium, USA-first educational consulting platform for Moroccan students pursuing studies in the USA.

**Core Promise:** Clear Process. No Confusion.

---

## Overview

Study Frontier is a full-stack platform with three distinct user-facing layers:

1. **Public marketing website** - Trust-building, lead generation, partner credibility
2. **Student portal** - Document management, progress tracking, appointments, payments, visa workflow
3. **Admin dashboard** - Lead management, student operations, workflow control, payments, reporting
4. **Parent/sponsor view** - Read-only access to student progress

---

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5+ (strict mode)
- **Runtime:** React 19.2.3
- **Styling:** Tailwind CSS 4.x (PostCSS-based)
- **Backend:** Supabase (auth, database, storage)
- **Forms:** React Hook Form 7.x + Zod 4.x validation
- **i18n:** next-intl 4.8.3 (English, French, Arabic with RTL)
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Package Manager:** pnpm

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account and project
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-frontier
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # PayPal (temporary for MVP)
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   ```

4. **Set up the database**
   
   Follow the [Database Setup](#database-setup) section below.

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your project URL and API keys
3. Add them to `.env.local`

### Step 2: Run Database Migrations

Execute the SQL files in order using the Supabase SQL Editor:

1. **Schema Setup** - Run `lib/supabase/schema.sql`
   - Creates all tables with relationships
   - Sets up indexes and constraints
   - Adds triggers for automatic timestamps

2. **Storage Buckets** - Run `lib/supabase/storage.sql`
   - Creates storage buckets (documents, avatars, attachments)
   - Configures file size limits and allowed MIME types
   - Sets up storage policies (activated in Sprint 03)

3. **RLS Policies** (Sprint 03) - Review `lib/supabase/rls-policies.sql`
   - Row Level Security policies documented
   - Will be activated when authentication is implemented
   - Do NOT run yet - keep for Sprint 03

### Step 3: Verify Setup

Check that all tables are created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- profiles
- students
- parent_access
- leads
- documents
- document_uploads
- applications
- school_recommendations
- appointments
- payments
- payment_installments
- tasks
- messages
- notifications
- ds160_data
- visa_preparation
- student_stage_history
- activity_log
- cms_content

### Step 4: Generate TypeScript Types (Optional)

After setting up your Supabase project, generate types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

This creates type-safe database access in your application.

---

## Project Structure

```
study-frontier/
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin dashboard routes
│   ├── (marketing)/         # Public marketing pages
│   ├── (parent)/            # Parent/sponsor view routes
│   ├── (student)/           # Student portal routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── layout/             # Navigation, footer
│   ├── marketing/          # Marketing page components
│   └── ui/                 # Reusable UI components
├── docs/                    # Documentation
│   ├── PRD.md              # Product requirements
│   ├── database-schema.md  # Database documentation
│   └── sprints/            # Sprint implementation plans
├── lib/                     # Utilities and helpers
│   ├── supabase/           # Supabase client and SQL
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   ├── schema.sql      # Database schema
│   │   ├── storage.sql     # Storage configuration
│   │   └── rls-policies.sql # Security policies
│   └── validations/        # Zod validation schemas
├── types/                   # TypeScript type definitions
│   ├── index.ts            # Application types
│   └── database.ts         # Database-specific types
├── public/                  # Static assets
└── .rovodev/               # Agent configuration
```

---

## Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Type Checking
pnpm type-check   # Run TypeScript compiler check (add to package.json)
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) | `eyJhbG...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PAYPAL_CLIENT_ID` | PayPal client ID | `xxx` |
| `PAYPAL_CLIENT_SECRET` | PayPal secret | `xxx` |

**Security Note:** Never commit `.env.local` or expose service role keys to the client.

---

## Development Guidelines

### Code Standards

- **TypeScript strict mode** - No `any` types
- **Path aliases** - Use `@/*` for imports from root
- **Functional components** - React function components with hooks
- **CSS-in-Tailwind** - Use Tailwind classes, minimal custom CSS
- **Form validation** - Always use Zod + React Hook Form
- **Error handling** - Graceful error states with clear messaging

### Commit Guidelines

- Use descriptive commit messages
- Reference sprint numbers when relevant
- Keep commits focused and atomic

### Testing

- Unit tests for utility functions and validation schemas
- Integration tests for critical user flows
- Manual testing on mobile devices (mobile-first!)
- Test all three languages when i18n is implemented
- Test all user roles and access controls

---

## Database Documentation

Full database schema documentation is available in:
- **Documentation:** `docs/database-schema.md`
- **Schema SQL:** `lib/supabase/schema.sql`
- **RLS Policies:** `lib/supabase/rls-policies.sql`
- **Storage Config:** `lib/supabase/storage.sql`

### Key Tables

- **profiles** - User profiles extending Supabase auth
- **students** - Student-specific data and progress
- **documents** - Document requirements and status
- **applications** - School application tracking
- **appointments** - Consultations and coaching sessions
- **payments** - Payment and invoice management
- **tasks** - Workflow tasks and action items
- **messages** - Internal messaging system
- **ds160_data** - DS-160 visa form intake (review only, not government submission)

### Storage Buckets

- **documents** - Student document uploads (private, 10MB limit)
- **avatars** - Profile pictures (public, 2MB limit)
- **attachments** - Message attachments (private, 5MB limit)

---

## User Roles

1. **Student** - Primary user, manages profile, documents, applications
2. **Parent/Sponsor** - Read-only view of student progress (no editing)
3. **Admin** - Full access to all students, leads, operations
4. **Counselor** - Future staff role for multi-admin workflows

---

## Internationalization (i18n)

The platform supports three languages:

- **English** (en) - Primary language
- **French** (fr) - Secondary language
- **Arabic** (ar) - With full RTL (right-to-left) support

Implementation: next-intl 4.8.3

---

## Security

### Best Practices

- Row Level Security (RLS) enabled on all tables in production
- Service role key never exposed to client
- Parameterized queries (handled by Supabase)
- Audit trail via activity_log table
- File upload restrictions (size, MIME types)
- 2FA/MFA for admin accounts (Sprint 03)

### Data Privacy

The platform handles sensitive data:
- Academic documents and transcripts
- Passport and identity information
- Financial documents
- Visa-related information

All document storage is private with role-based access control.

---

## Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push to main

### Environment Setup

Add all environment variables from `.env.local` to Vercel:
- Project Settings → Environment Variables
- Add variables for Production, Preview, and Development

---

## Product Documentation

- **PRD:** `docs/PRD.md` - Complete product requirements
- **Architecture:** `docs/architecture.md` - Technical architecture
- **Roadmap:** `docs/roadmap.md` - Product roadmap
- **Sprint Plans:** `docs/sprints/` - Implementation plans

### Current Sprint Status

- ✅ **Sprint 00:** Bootstrap - COMPLETE
- ✅ **Sprint 01:** Marketing Site - COMPLETE  
- ✅ **Sprint 02:** Supabase and Schema - COMPLETE
- ⏳ **Sprint 03:** Auth and Roles - NEXT
- 📋 **Sprint 04:** Student Portal - PLANNED
- 📋 **Sprint 05:** Admin Dashboard - PLANNED
- 📋 **Sprint 06:** Documents and Applications - PLANNED
- 📋 **Sprint 07:** DS-160 and Visa Workflow - PLANNED
- 📋 **Sprint 08:** Payments and Notifications - PLANNED
- 📋 **Sprint 09:** CMS and i18n - PLANNED
- 📋 **Sprint 10:** Hardening and Release - PLANNED

---

## Support and Questions

For development questions or issues:

1. Check existing documentation in `docs/`
2. Review sprint plans in `docs/sprints/`
3. Consult `AGENTS.md` for development guidelines
4. Check the PRD for product requirements

---

## License

Proprietary - Study Frontier Platform

---

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Tailwind CSS

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta)
