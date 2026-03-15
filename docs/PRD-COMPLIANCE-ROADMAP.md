# Study Frontier - PRD Compliance Roadmap

**Document Version:** 1.0  
**Created:** 2026-03-15  
**Current Status:** ~75% PRD Compliant  
**Target:** 100% Phase 1 Compliance

---

## Executive Summary

Study Frontier has a **solid, production-ready foundation** with complete technical infrastructure, secure authentication, and core functionality. However, several critical PRD requirements are missing, most notably the **Eligibility Assessment Form** (primary lead generation tool) and key **homepage content sections**.

### Current State:
- ✅ Technical Infrastructure: 100%
- ✅ Security & Auth: 95%
- ✅ Student Portal Backend: 90%
- ✅ Admin Portal Backend: 85%
- ❌ Public Website Content: 60%
- ❌ Lead Generation: 0% (Critical Gap)

### What We'll Build:
This roadmap breaks remaining work into **4 focused phases** that can be completed in **2-3 days** of development time.

---

## Phase 1: Critical Lead Generation (PRIORITY: HIGHEST) 🔴

**Estimated Time:** 4-6 hours  
**Objective:** Implement the primary website conversion mechanism  
**Status:** NOT STARTED

### Tasks:

#### 1.1 Create Eligibility Assessment Form (PRD Section 12)
- **File:** `app/[locale]/(marketing)/assessment/page.tsx`
- **Type:** 2-step detailed form
- **Step 1 Fields:**
  - Full name
  - WhatsApp number
  - Email
  - City
  - Nationality
  - Age
  - Preferred study destination
  - Desired intake
- **Step 2 Fields:**
  - Highest education completed
  - Current school/university
  - GPA/average
  - English level
  - Test status (TOEFL/IELTS)
  - Desired study level (Bachelor's/Master's)
  - Intended major
  - Budget range
  - Sponsor type
  - Prior U.S. visa refusal (yes/no)
  - Short goal statement (textarea)

#### 1.2 Create Assessment Validation Schema
- **File:** `lib/validations/assessment.ts`
- **Requirements:**
  - Zod schema for 2-step form
  - Email validation
  - Phone number validation (WhatsApp format)
  - Required vs optional field handling
  - Min/max length constraints

#### 1.3 Create Assessment API Endpoint
- **File:** `app/api/assessment/route.ts`
- **Functionality:**
  - POST endpoint to save lead to database
  - Create record in `leads` table
  - Return success/error response
  - Send confirmation (in-app notification for now)

#### 1.4 Create Assessment Success Component
- **File:** `components/marketing/assessment-success.tsx`
- **Content:**
  - Thank you message
  - "What happens next" explanation
  - CTA: Book a Consultation
  - CTA: Chat on WhatsApp
  - Expected response timeline

#### 1.5 Update Navigation
- **Files to modify:**
  - `components/layout/navigation.tsx` - Add "Get Assessed" CTA button
  - `app/[locale]/(marketing)/page.tsx` - Update hero CTAs to link to assessment

#### 1.6 Add to Translation Files
- **Files:** `messages/en.json`, `messages/fr.json`, `messages/ar.json`
- **Keys needed:**
  - assessment.step1.title
  - assessment.step2.title
  - assessment.fields.* (all form labels)
  - assessment.success.* (success page content)

### Acceptance Criteria:
- ✅ 2-step form functional with proper validation
- ✅ Form saves to database via API
- ✅ Success page displays after submission
- ✅ Mobile-responsive design
- ✅ Accessible (WCAG AA)
- ✅ Translated in all 3 languages
- ✅ "Get Assessed" CTA in navigation
- ✅ Homepage hero links to assessment

---

## Phase 2: Homepage Content Completion (PRIORITY: HIGH) 🟠

**Estimated Time:** 6-8 hours  
**Objective:** Complete PRD-required homepage sections for trust-building  
**Status:** NOT STARTED

### Tasks:

#### 2.1 Add "How It Works" Section (PRD Section 10.2)
- **File to modify:** `app/[locale]/(marketing)/page.tsx`
- **Component:** `components/marketing/process-step.tsx` (already exists)
- **Content:** 4 steps
  1. Eligibility Assessment
  2. Pathway & School Planning
  3. Application Preparation
  4. Visa & Next Steps
- **Design:** Icon + Title + Description for each step
- **Placement:** Immediately after hero section

#### 2.2 Add "Study Pathways" Section (PRD Section 10.3)
- **File to modify:** `app/[locale]/(marketing)/page.tsx`
- **Content:** 3 cards
  1. Bachelor's Programs
  2. Master's Programs
  3. Affordable Pathways & Community Colleges
- **Each card:**
  - Icon/illustration
  - Title
  - Short description (2-3 sentences)
  - "Learn More" link → `/study-usa` page
- **Placement:** After "How It Works" section

#### 2.3 Add "Packages Overview" Section (PRD Section 10.4)
- **File to modify:** `app/[locale]/(marketing)/page.tsx`
- **Content:** 3 package cards
  1. **Starter Package**
     - Who it's for: Early-stage planning
     - Included features: Profile assessment, pathway planning, initial guidance
     - CTA: Get Assessed
  2. **Application Package** (highlighted as "Most Popular")
     - Who it's for: Ready to apply
     - Included features: School selection, application support, document review
     - CTA: Get Assessed
  3. **Visa Ready Package**
     - Who it's for: Accepted students
     - Included features: DS-160 support, visa coaching, mock interviews
     - CTA: Get Assessed
- **Important:** No exact pricing (PRD requirement)
- **Text:** "Best-fit package recommended after profile assessment"
- **Placement:** After "Study Pathways" section

#### 2.4 Add "Founder Section" (PRD Section 10.5)
- **File to modify:** `app/[locale]/(marketing)/page.tsx`
- **Content:**
  - Founder photo (placeholder or real)
  - Balanced introduction
  - Real U.S. student experience mention
  - Mission statement
  - "Structured and honest guidance" positioning
  - **Tone:** Brand first, founder second (not overly personal)
- **Placement:** After services/packages section

#### 2.5 Add FAQ Section (PRD Section 10.6)
- **File to modify:** `app/[locale]/(marketing)/page.tsx`
- **Component:** Create `components/marketing/faq-accordion.tsx`
- **Content:** Mixed student/parent questions
  - **Student Questions:**
    - How does the process work?
    - When should I start applying?
    - What are the requirements for studying in the USA?
    - How long does the process take?
  - **Parent Questions:**
    - How do I know which package is right for my child?
    - What is included in the service?
    - Do you guarantee admission/visa approval? (Answer: No, honest positioning)
    - How do we communicate with you?
    - What are the payment options?
- **Design:** Expandable accordion component
- **Placement:** After founder section, before final CTA

#### 2.6 Update Translation Files
- **Files:** `messages/en.json`, `messages/fr.json`, `messages/ar.json`
- **Keys for all new sections:**
  - howItWorks.*
  - studyPathways.*
  - packages.*
  - founder.*
  - faq.*

### Acceptance Criteria:
- ✅ All 5 sections added to homepage
- ✅ Content matches PRD tone (70% clear, 30% premium)
- ✅ Mobile-first responsive design
- ✅ Smooth scrolling and visual hierarchy
- ✅ All content translated (EN/FR/AR)
- ✅ CTAs link to assessment page
- ✅ No exact pricing shown (PRD requirement)

---

## Phase 3: Admin UI Completion (PRIORITY: MEDIUM) 🟡

**Estimated Time:** 8-12 hours  
**Objective:** Complete admin dashboard interfaces (APIs already exist)  
**Status:** PLACEHOLDER PAGES EXIST

### Tasks:

#### 3.1 Complete Leads Management Page
- **File:** `app/[locale]/(admin)/admin/leads/page.tsx`
- **Components to create:**
  - `components/admin/leads-table.tsx` - Table with sorting/filtering
  - `components/admin/lead-qualification-labels.tsx` - Label assignment UI
- **Functionality:**
  - Display all leads from database
  - Filter by status (New, Contacted, Qualified, Not Qualified)
  - Assign qualification labels:
    - High Potential
    - Needs Follow-up
    - Budget Mismatch
    - Not Qualified Yet
    - Visa-Risk Profile
  - View lead details (expand/modal)
  - Convert lead to student action
  - Add notes to lead
  - Mark lead as contacted
- **Data source:** `lib/data/admin.ts` - `getLeads()` function (verify exists or create)

#### 3.2 Complete Students Management Page
- **File:** `app/[locale]/(admin)/admin/students/page.tsx`
- **Components:** Likely exists `components/admin/students-table.tsx` - enhance it
- **Functionality:**
  - Display all students with pagination
  - Filter by stage (Assessment, Planning, Documents, Applications, Visa Prep, Pre-Departure)
  - Filter by status (Active, Paused, Completed, Cancelled)
  - Search by name/email
  - Quick actions:
    - View student portal (link to student's dashboard)
    - Update stage
    - Add task
    - Send message
  - Click student → Detail view or redirect to individual student page
- **Data source:** `lib/data/admin.ts` - `getStudentsByStage()` already exists

#### 3.3 Complete Tasks Management Page
- **File:** `app/[locale]/(admin)/admin/tasks/page.tsx`
- **Components:** `components/admin/tasks-list.tsx` already exists - make it full-page
- **Functionality:**
  - Display all tasks across all students
  - Filter by:
    - Status (Pending, In Progress, Completed, Overdue)
    - Assigned to (for multi-admin future)
    - Due date range
    - Student
  - Sort by priority, due date
  - Mark tasks complete
  - Add new task
  - Edit task details
- **Data source:** `lib/data/admin.ts` - `getTasksNeedingAttention()` exists

#### 3.4 Complete CMS Content Management Page
- **File:** `app/[locale]/(admin)/admin/cms/page.tsx`
- **Component:** `components/admin/cms-editor.tsx` already exists - integrate fully
- **Functionality:**
  - Edit homepage content blocks
  - Edit about page content
  - Edit services/packages copy
  - Edit FAQ entries
  - Edit contact details
  - Manage translations (EN/FR/AR)
  - Preview changes
  - Publish/unpublish
- **Data source:** `/api/cms` endpoint already exists
- **Storage:** CMS content in `cms_content` table (verify schema)

#### 3.5 Add Admin Quick Stats Dashboard Cards
- **File to enhance:** `app/[locale]/(admin)/admin/page.tsx`
- **Add links from stat cards:**
  - "New Leads" card → link to `/admin/leads?filter=new`
  - "Active Students" card → link to `/admin/students?status=active`
  - "Pending Reviews" card → link to `/admin/documents?status=pending`
  - "Pending Tasks" card → link to `/admin/tasks?status=pending`

### Acceptance Criteria:
- ✅ All 4 admin pages fully functional (no "coming soon" messages)
- ✅ Real data from database displayed
- ✅ Filtering and search working
- ✅ Actions connect to existing API endpoints
- ✅ Mobile-usable (PRD: desktop-first but mobile-usable)
- ✅ Admin role protection verified
- ✅ Loading states and error handling

---

## Phase 4: Student Portal UI Polish (PRIORITY: MEDIUM) 🟡

**Estimated Time:** 6-8 hours  
**Objective:** Complete student-facing pages (backends exist)  
**Status:** PLACEHOLDER PAGES EXIST

### Tasks:

#### 4.1 Complete Documents Page
- **File:** `app/[locale]/(student)/dashboard/documents/page.tsx`
- **Components to use/create:**
  - `components/student/document-upload.tsx` (already exists)
  - Create organized layout by document category
- **Functionality:**
  - Display all required documents by category:
    - Personal Documents (Passport, ID, Photos)
    - Academic Documents (Transcripts, Diplomas, Certificates)
    - Financial Documents (Bank statements, Sponsor letters)
    - Test Scores (TOEFL, IELTS, SAT, GRE)
    - Other (Letters of recommendation, Resume/CV)
  - Show document status for each:
    - Missing (red) - upload button
    - Uploaded (yellow) - under review
    - Needs Correction (orange) - admin feedback + re-upload
    - Approved (green) - checkmark
  - Upload functionality inline (no separate page)
  - Version history per document
  - Admin feedback display
- **Data source:** `/api/documents` endpoint exists

#### 4.2 Complete Appointments Page
- **File:** `app/[locale]/(student)/dashboard/appointments/page.tsx`
- **Components:**
  - `components/student/appointments-card.tsx` (already exists) - enhance
  - Create `components/student/appointment-booking.tsx`
- **Functionality:**
  - Display upcoming appointments
  - Display past appointments
  - Appointment types:
    - Initial Consultation
    - Document Review Session
    - Visa Coaching Session (only visible in Visa Preparation stage)
  - Book new appointment (stage-aware permissions)
  - Reschedule appointment
  - Cancel appointment
  - Join video call link (if applicable)
  - Add to calendar (download .ics file)
- **Data source:** `/api/appointments` endpoint (verify exists or create)

#### 4.3 Complete Messages Page
- **File:** `app/[locale]/(student)/dashboard/messages/page.tsx`
- **Components:** Create `components/student/message-thread.tsx`
- **Functionality:**
  - Display message history with admin/counselor
  - Send new message
  - Message threads by topic/conversation
  - Mark messages as read
  - Attachment support (documents, images)
  - Real-time or periodic refresh
  - Notification badge on unread
- **Data source:** `/api/messages` endpoint (verify exists or create)

#### 4.4 Enhance Applications Page
- **File:** `app/[locale]/(student)/dashboard/applications/page.tsx` (already exists)
- **Verify/enhance:**
  - Display all school applications
  - Application statuses clearly shown
  - Document requirements per application
  - Admin recommendations displayed
  - Next action per application
  - Progress tracking per school

### Acceptance Criteria:
- ✅ Documents page fully functional with upload
- ✅ Appointments page with booking capability
- ✅ Messages page with conversation flow
- ✅ Applications page enhanced (if needed)
- ✅ All pages mobile-first responsive
- ✅ Real-time data from APIs
- ✅ Proper error handling and loading states

---

## Phase 5: Email Integration & Polish (PRIORITY: LOW) 🟢

**Estimated Time:** 4-6 hours  
**Objective:** Add email notifications and final touches  
**Status:** TODO TRACKED IN CODE

### Tasks:

#### 5.1 Email Service Integration
- **Provider:** SendGrid or Resend
- **File to modify:** `lib/notifications/index.ts`
- **Environment vars:** Add to `.env.local` and `.env.example`
- **Email templates to create:**
  - Welcome email (new student signup)
  - Assessment received confirmation
  - Document approved/needs correction
  - Stage changed notification
  - Payment due reminder
  - Appointment confirmation/reminder
  - New message notification

#### 5.2 Auto-Notification Triggers
- **File to enhance:** `lib/notifications/index.ts`
- **Triggers:**
  - New message → email + in-app
  - Document approved → email + in-app
  - Document needs correction → email + in-app
  - Stage changed → email + in-app
  - Payment due → email + in-app
  - Appointment booked → email + in-app
  - Appointment reminder (24h before) → email

#### 5.3 Translation File Completion Audit
- **Files:** `messages/en.json`, `messages/fr.json`, `messages/ar.json`
- **Task:** Verify all pages have complete translations
- **Priority pages:**
  - Homepage (all new sections)
  - Assessment form
  - Student dashboard
  - Admin dashboard
  - Legal pages

#### 5.4 Final Content Review
- **Review for PRD tone compliance:**
  - 70% clear and informative
  - 30% premium and minimal
  - No false promises
  - Realistic advice
  - Trust-building language

### Acceptance Criteria:
- ✅ Email service configured
- ✅ All notification types send emails
- ✅ Email templates professional and on-brand
- ✅ Translations complete for all key pages
- ✅ Content reviewed for tone

---

## Implementation Strategy

### Recommended Sequence:

**Week 1 (Days 1-2): Critical Path**
1. Phase 1: Eligibility Assessment (HIGHEST priority)
   - This is the #1 gap blocking lead generation
   - Est. 4-6 hours
2. Phase 2: Homepage Content (HIGH priority)
   - Required for trust-building and PRD compliance
   - Est. 6-8 hours

**Week 1 (Day 3): Admin Operations**
3. Phase 3: Admin UI (MEDIUM priority)
   - At minimum: Leads page (most critical for operations)
   - Students and Tasks pages can follow
   - Est. 8-12 hours total, can split across days

**Week 2: Polish & Launch Prep**
4. Phase 4: Student Portal Polish (MEDIUM priority)
   - Nice-to-have for launch, not blocking
   - Est. 6-8 hours
5. Phase 5: Email & Final Polish (LOW priority)
   - Post-launch is acceptable
   - Est. 4-6 hours

### Total Estimated Time:
- **Phases 1-2 (Critical):** 10-14 hours → **2 days**
- **Phase 3 (Admin UI):** 8-12 hours → **1-2 days**
- **Phases 4-5 (Polish):** 10-14 hours → **1-2 days**
- **Grand Total:** 28-40 hours → **3-5 days**

### Parallel Work Opportunities:
- Content writing for homepage sections can happen while building assessment form
- Translation work can happen in parallel with development
- Email templates can be designed while email integration is being coded

---

## Quality Gates

### After Phase 1:
- [ ] Assessment form tested end-to-end
- [ ] Lead successfully saves to database
- [ ] Form accessible and mobile-responsive
- [ ] All 3 languages working

### After Phase 2:
- [ ] Homepage feels complete and trust-building
- [ ] All PRD-required sections present
- [ ] Content reviewed by stakeholder
- [ ] No lorem ipsum or placeholder text

### After Phase 3:
- [ ] Admin can manage leads effectively
- [ ] Admin can view and filter students
- [ ] Admin can manage tasks
- [ ] CMS allows content updates

### After Phase 4:
- [ ] Students can upload documents
- [ ] Students can book appointments
- [ ] Students can send messages
- [ ] All student features tested

### Before Final Launch:
- [ ] All phases complete
- [ ] Security audit passed
- [ ] Accessibility tested (WCAG AA)
- [ ] Mobile testing on real devices
- [ ] Translations reviewed by native speakers
- [ ] Admin training completed
- [ ] Backup and rollback plan ready

---

## Risk Mitigation

### Potential Blockers:

1. **Content Availability**
   - **Risk:** Founder bio, package descriptions, FAQ answers not ready
   - **Mitigation:** Prepare content in parallel, use placeholders initially

2. **Translation Quality**
   - **Risk:** Auto-translations not accurate for Arabic/French
   - **Mitigation:** Native speaker review required for critical pages

3. **Email Service Setup**
   - **Risk:** SendGrid/Resend account approval delays
   - **Mitigation:** Start account setup early, can launch without email (in-app only)

4. **Scope Creep**
   - **Risk:** Adding features beyond PRD during implementation
   - **Mitigation:** Stick to roadmap, track "nice-to-haves" for Phase 2+

---

## Success Metrics

### PRD Compliance Target: 100%

After completing all phases:

- [x] Public website: 100% (currently 60%)
- [x] Student portal: 100% (currently 85%)
- [x] Admin dashboard: 100% (currently 80%)
- [x] Technical infrastructure: 100% (currently 100%)
- [x] Security & privacy: 100% (currently 95%)
- [x] Multilingual: 100% (currently 90%)

### Business Metrics to Track Post-Launch:

1. **Lead Generation:**
   - Assessment form submissions per week
   - Assessment completion rate
   - Lead-to-consultation conversion

2. **User Engagement:**
   - Student login frequency
   - Document upload completion rate
   - Appointment booking rate

3. **Operational Efficiency:**
   - Admin response time to leads
   - Average time per student stage
   - Task completion rate

---

## Recommendations & Questions

### Recommendations:

1. **Prioritize Phase 1 (Assessment Form) Immediately**
   - This is the #1 revenue-impacting gap
   - Without it, website cannot generate qualified leads
   - Recommend starting here even before other homepage content

2. **Consider Content Preparation Upfront**
   - Write homepage content (packages, founder bio, FAQ) before development
   - This prevents development delays waiting for copy
   - Can involve copywriter/content person in parallel

3. **Staged Launch Approach**
   - **Soft Launch:** After Phases 1-2 (basic lead gen working)
   - **Public Launch:** After Phase 3 (admin operations smooth)
   - **Full Launch:** After Phases 4-5 (all polish complete)

4. **Email Integration Can Wait**
   - Phase 5 email integration can be post-launch
   - In-app notifications work for MVP
   - Reduces initial complexity and timeline

### Questions for You:

1. **Content Readiness:**
   - Do you have founder bio written?
   - Are package descriptions finalized?
   - Are FAQ answers prepared?
   - Do you have professional photos/images for founder section?

2. **Design Preferences:**
   - Do you have brand guidelines for assessment form design?
   - Any specific UI/UX preferences for homepage sections?
   - Should we use illustrations, photos, or icons for pathways section?

3. **Operational Priorities:**
   - Which admin page is most critical: Leads, Students, or Tasks?
   - Can admin work without CMS editor initially (hardcode content)?
   - Is WhatsApp integration needed for Phase 1 or can it wait?

4. **Launch Timeline:**
   - Is there a specific launch date target?
   - Is there a marketing campaign planned around launch?
   - Do you want staged rollout or all-at-once launch?

5. **Resource Availability:**
   - Will content writing happen in parallel with development?
   - Is there a native French/Arabic speaker for translation review?
   - Who will test the platform before launch?

---

## Next Steps

**Option A: Start Immediately (Recommended)**
1. Begin Phase 1: Eligibility Assessment Form
2. I'll implement while you prepare homepage content
3. Review and iterate on assessment form
4. Move to Phase 2 with content ready

**Option B: Prepare Content First**
1. Finalize all homepage copy (founder, packages, FAQ)
2. Prepare translations
3. Then implement Phases 1-2 together
4. Faster implementation but delayed start

**Option C: Customize Roadmap**
1. Review this roadmap
2. Adjust priorities based on your needs
3. Reorder phases if needed
4. Then begin implementation

---

**Ready to proceed when you are. What's your preference?**

---

**Document Status:** Ready for Review  
**Next Action:** Await stakeholder decision on implementation approach
