# Execution Workflow & Phase Gates

### Phase 0: Project Shell & Data Foundations
- Setup Next.js App Router, Tailwind CSS, and shadcn/ui.
- Setup `lib/data/country-rules.json` containing the 10 target countries (Latvia, Malta, Finland, Lithuania, Germany, UK, Ireland, Cyprus, Malaysia, Dubai).
- Configure responsive header, counselor workspace layout, and navigation tabs.

### Phase 1: Rapid 3-Minute Triage Engine (Client-Side Filter)
- Build 3-question filter drawer:
  1. Highest Qual & Gap (O/L, A/L Passes, Degree GPA).
  2. English Qualification (None, Duolingo, IELTS, MOI).
  3. Available Liquid Funds (< €5k, €7k, €10k, €12k+).
- Immediate calculation returning:
  - **Direct Match** (Green badge)
  - **Conditional Match** (Amber badge - e.g. requires interview or entrance exam)
  - **Ineligible** (Red badge)

### Phase 2: Instant Call Pitch & Document Checklists
- Clicking any matched country displays a split-view drawer:
  - Script hook to book an appointment in Nugegoda office.
  - Critical caveats (AIC clearance for Latvia, 12-week work rule for Malta, etc.).
  - Document checklist needed from the student.

### Phase 3: Counselor Lead Pipeline & Number Tracker
- 6-Stage visual Kanban board (`New Lead`, `Triaged`, `Appointment Booked`, `File Opened`, `Lodged`, `Closed`).
- Lead card with one-click WhatsApp launcher, status tags, and appointment time.
- Read views for daily follow-up lists and missed callbacks.

### Phase 4: Verification & Readiness
- TypeScript validation (`tsc --noEmit`).
- Verify complete offline functionality with fallback mock leads.
