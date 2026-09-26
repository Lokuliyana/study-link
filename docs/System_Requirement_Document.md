# System Requirements Document: Study Link Counselor OS
**Target User**: Sri Lankan Overseas Study Counselors (Study Link Nugegoda)
**Primary Function**: Rapid In-Call Eligibility Evaluation & Lead Pipeline Management
**Stack**: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui

---

### 1. Functional System Overview
The system provides study counselors with an instantaneous rule-evaluation engine while handling 3–5 minute phone calls from social media leads. It eliminates counselor hesitation by matching candidate qualifications to country guidelines and tracking student contact numbers across a standard conversion pipeline.

---

### 2. Directory Architecture (Next.js Only)

```text
├── app/
│   ├── layout.tsx                     # Main layout with counselor header
│   ├── page.tsx                       # Dashboard: Quick Triage + Lead Pipeline
│   ├── countries/
│   │   └── page.tsx                   # 10-Country full reference matrix
│   ├── pipeline/
│   │   └── page.tsx                   # Visual Kanban lead tracker
│   └── api/
│       └── leads/
│           └── route.ts               # Local file persistence for student leads
├── components/
│   ├── triage/
│   │   ├── QuickTriageEngine.tsx      # 3-field instant eligibility calculator
│   │   ├── CountryCard.tsx            # Result card with badge match indicators
│   │   └── CallScriptModal.tsx        # Call pitch and appointment-booking closing
│   ├── pipeline/
│   │   ├── KanbanBoard.tsx            # Multi-stage lead drag/drop or select
│   │   ├── LeadCard.tsx               # Phone number, matched country, next action
│   │   └── NewLeadModal.tsx           # Quick student intake capture form
│   └── ui/                            # shadcn/ui primitives
├── lib/
│   ├── types.ts                       # TypeScript interfaces for rules and leads
│   ├── data/
│   │   ├── country-rules.json         # Static qualification criteria for 10 countries
│   │   └── initial-leads.json         # Sample mock data for pipeline demo
│   └── matcher.ts                     # Deterministic eligibility matching function
└── config/
    └── countries.ts                   # Country configurations and intake schedules
```

---

### 3. Data Contracts & Rule Schema

```typescript
// lib/types.ts

export type StudyLevel = 'UG' | 'PG' | 'Foundation';
export type EnglishTest = 'NONE' | 'IELTS' | 'PTE' | 'DUOLINGO' | 'MOI';

export interface CountryRule {
  id: string;
  country: string;
  flag: string;
  ugAgeLimit: number;
  pgAgeLimit: number;
  maxStudyGapYears: number;
  minAcademicUG: string;
  minAcademicPG: string;
  englishReqs: Record<EnglishTest, string>;
  proofOfFundsEur: number;
  proofOfFundsNote: string;
  workRights: string;
  intakes: string[];
  callScriptPitch: string;
  appointmentHook: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  whatsapp: string;
  age: number;
  highestQualification: 'OL' | 'AL' | 'DEGREE';
  alResultsSummary?: string; // e.g. "3C", "2C 1S", "3S"
  gpa?: number;
  gapYears: number;
  englishTest: EnglishTest;
  englishScore?: string;
  liquidFundsLkr: number;
  targetCountry?: string;
  stage: 'NEW' | 'TRIAGED' | 'APPOINTMENT_SET' | 'FILE_OPENED' | 'LODGED' | 'CLOSED';
  appointmentDate?: string;
  notes?: string;
  createdAt: string;
}
```

---

### 4. Matching Engine Logic

```typescript
// lib/matcher.ts
import rules from '@/lib/data/country-rules.json';
import { CountryRule, StudentProfile } from './types';

export interface MatchResult {
  country: CountryRule;
  status: 'QUALIFIED' | 'CONDITIONAL' | 'INELIGIBLE';
  reasons: string[];
}

export function evaluateEligibility(profile: Partial<StudentProfile>): MatchResult[] {
  return rules.map((country: CountryRule) => {
    const reasons: string[] = [];
    let status: 'QUALIFIED' | 'CONDITIONAL' | 'INELIGIBLE' = 'QUALIFIED';

    // Age Check
    if (profile.age && profile.age > country.ugAgeLimit) {
      if (profile.highestQualification === 'DEGREE' && profile.age <= country.pgAgeLimit) {
        // PG age permitted
      } else {
        status = 'INELIGIBLE';
        reasons.push(`Exceeds UG age limit of ${country.ugAgeLimit}`);
      }
    }

    // Gap Check
    if (profile.gapYears && profile.gapYears > country.maxStudyGapYears) {
      status = 'CONDITIONAL';
      reasons.push(`Study gap (${profile.gapYears} yrs) requires verifiable service letters.`);
    }

    // English Test Waiver Check
    if (profile.englishTest === 'NONE') {
      if (country.englishReqs['NONE']) {
        reasons.push(`English waiver possible: ${country.englishReqs['NONE']}`);
      } else {
        status = 'CONDITIONAL';
        reasons.push('Requires university entrance test or internal interview.');
      }
    }

    return { country, status, reasons };
  });
}
```

---

### 5. 10 Country Rules Master Dataset Reference

```json
[
  {
    "id": "latvia",
    "country": "Latvia",
    "ugAgeLimit": 30,
    "pgAgeLimit": 45,
    "maxStudyGapYears": 8,
    "minAcademicUG": "3C passes (2C 1S accepted)",
    "minAcademicPG": "Recognized 3-Year Bachelor (GPA 2.5+)",
    "englishReqs": {
      "NONE": "Internal University Skype/Teams Test",
      "DUOLINGO": "100+ points",
      "IELTS": "6.0 overall",
      "MOI": "Accepted for Master's if completed in English"
    },
    "proofOfFundsEur": 7200,
    "proofOfFundsNote": "€7,200 living costs + AIC verification approval needed",
    "workRights": "20 hrs/week part-time during studies",
    "intakes": ["September", "February"],
    "callScriptPitch": "Direct European Schengen country with recognized state universities and low upfront fees.",
    "appointmentHook": "AIC processing takes 4 weeks. Let's inspect your certificates tomorrow at Nugegoda office to lock the intake."
  },
  {
    "id": "malta",
    "country": "Malta",
    "ugAgeLimit": 40,
    "pgAgeLimit": 45,
    "maxStudyGapYears": 10,
    "minAcademicUG": "O/L for Level 5 Diploma, 3S in A/L for Level 6 Degree",
    "minAcademicPG": "Bachelor degree completed",
    "englishReqs": {
      "NONE": "Internal English interview accepted",
      "DUOLINGO": "Accepted",
      "IELTS": "6.0 (waives €300 English fee), 6.5 (fully waived)",
      "MOI": "Accepted"
    },
    "proofOfFundsEur": 9500,
    "proofOfFundsNote": "Approx. €9,000–€10,000 bank statement",
    "workRights": "20 hrs/week after first 12 weeks",
    "intakes": ["January", "April", "June", "October"],
    "callScriptPitch": "English-speaking EU Schengen destination with flexible entry levels starting straight from O/Ls.",
    "appointmentHook": "Rolling intakes are open now. Can you come in Wednesday or Saturday to start your application?"
  },
  {
    "id": "finland",
    "country": "Finland",
    "ugAgeLimit": 45,
    "pgAgeLimit": 50,
    "maxStudyGapYears": 15,
    "minAcademicUG": "3 A/L Passes + UAS Entrance Exam",
    "minAcademicPG": "Bachelor + 2 Years relevant work experience",
    "englishReqs": {
      "NONE": "Entrance examination evaluates English",
      "DUOLINGO": "105+",
      "IELTS": "6.0",
      "MOI": "Conditional"
    },
    "proofOfFundsEur": 6720,
    "proofOfFundsNote": "€6,720/year living cost in student's account",
    "workRights": "30 hrs/week legal work permission",
    "intakes": ["September (Joint Application in Jan)"],
    "callScriptPitch": "Premier Nordic education with world-leading post-study stayback and family residence permits.",
    "appointmentHook": "Joint application windows open once a year. Bring your transcripts to verify eligibility immediately."
  },
  {
    "id": "lithuania",
    "country": "Lithuania",
    "ugAgeLimit": 28,
    "pgAgeLimit": 40,
    "maxStudyGapYears": 5,
    "minAcademicUG": "3 Passes in A/L",
    "minAcademicPG": "Bachelor's degree",
    "englishReqs": {
      "NONE": "University Skype test",
      "DUOLINGO": "95+",
      "IELTS": "5.5 - 6.0",
      "MOI": "Accepted for PG"
    },
    "proofOfFundsEur": 6000,
    "proofOfFundsNote": "€5,000–€6,000 living funds",
    "workRights": "20 hrs/week permitted",
    "intakes": ["September", "February"],
    "callScriptPitch": "High visa grant track record, reasonable tuition fees, and complete Schengen mobility.",
    "appointmentHook": "Visa slots are limited. Let's open your file this week to confirm your slot."
  },
  {
    "id": "germany",
    "country": "Germany (Private/Dual)",
    "ugAgeLimit": 26,
    "pgAgeLimit": 35,
    "maxStudyGapYears": 4,
    "minAcademicUG": "13 Years schooling required or Studienkolleg",
    "minAcademicPG": "4-Year Bachelor or 3-Year + 1-Year Master",
    "englishReqs": {
      "NONE": "Rare (Private university interview only)",
      "DUOLINGO": "105+ (Private)",
      "IELTS": "6.0 - 6.5",
      "MOI": "Accepted by select private universities"
    },
    "proofOfFundsEur": 11904,
    "proofOfFundsNote": "Blocked Account (€11,904) required",
    "workRights": "120 full days or 240 half days/year",
    "intakes": ["October", "April"],
    "callScriptPitch": "Industrial powerhouse of Europe with 18-month job search visa post graduation.",
    "appointmentHook": "Blocked account and APS certification can take time. An in-person consultation is vital."
  },
  {
    "id": "uk",
    "country": "United Kingdom",
    "ugAgeLimit": 25,
    "pgAgeLimit": 38,
    "maxStudyGapYears": 5,
    "minAcademicUG": "A/L passes or Foundation",
    "minAcademicPG": "Degree (Pass or 2.2 minimum)",
    "englishReqs": {
      "NONE": "O/L English Credit 'C' or 'B' gives direct waiver",
      "DUOLINGO": "Accepted by select universities",
      "IELTS": "6.0 (UG), 6.5 (PG)",
      "MOI": "Medium of Instruction letter accepted by partner unis"
    },
    "proofOfFundsEur": 12500,
    "proofOfFundsNote": "28-day bank balance: Remaining Tuition + £10,230 (outside London)",
    "workRights": "20 hrs/week during term",
    "intakes": ["September", "January"],
    "callScriptPitch": "Fast 1-year Master's, 2-year Graduate Route post-study work visa, and straightforward O/L English waiver.",
    "appointmentHook": "You don't need IELTS if your O/L English is a C or B. Come in tomorrow to select your university."
  },
  {
    "id": "ireland",
    "country": "Ireland",
    "ugAgeLimit": 24,
    "pgAgeLimit": 35,
    "maxStudyGapYears": 3,
    "minAcademicUG": "High A/L results (B/C average)",
    "minAcademicPG": "2.1 or high 2.2 Bachelor's Degree",
    "englishReqs": {
      "NONE": "Not accepted",
      "DUOLINGO": "110+ accepted by select institutes",
      "IELTS": "6.5 overall (minimum 6.0 in bands)",
      "MOI": "Not accepted for visa"
    },
    "proofOfFundsEur": 10000,
    "proofOfFundsNote": "€10,000 living expenses shown across 6 months",
    "workRights": "20 hrs/week during term, 40 hrs in holidays",
    "intakes": ["September"],
    "callScriptPitch": "European headquarters of global tech giants offering 2-year stayback work rights.",
    "appointmentHook": "Ireland seats fill 8 months in advance. Bring your marksheets to evaluate university admission."
  },
  {
    "id": "cyprus",
    "country": "Cyprus",
    "ugAgeLimit": 32,
    "pgAgeLimit": 40,
    "maxStudyGapYears": 7,
    "minAcademicUG": "O/L or A/L simple passes",
    "minAcademicPG": "Recognized Bachelor's",
    "englishReqs": {
      "NONE": "Internal college test on arrival",
      "DUOLINGO": "Accepted",
      "IELTS": "5.0 - 5.5",
      "MOI": "Accepted"
    },
    "proofOfFundsEur": 7000,
    "proofOfFundsNote": "€5,000–€7,000 verifiable funds",
    "workRights": "20 hrs/week after 6 months",
    "intakes": ["February", "June", "October"],
    "callScriptPitch": "Most budget-friendly Mediterranean study destination with straightforward documentation.",
    "appointmentHook": "Visas process within 3 weeks. Let's arrange a time to submit your passport copy."
  },
  {
    "id": "malaysia",
    "country": "Malaysia",
    "ugAgeLimit": 40,
    "pgAgeLimit": 45,
    "maxStudyGapYears": 10,
    "minAcademicUG": "5 O/L passes (Foundation) or 2 A/L passes (Degree)",
    "minAcademicPG": "Bachelor degree",
    "englishReqs": {
      "NONE": "University English placement course",
      "DUOLINGO": "Accepted",
      "IELTS": "5.0 - 5.5",
      "MOI": "Accepted"
    },
    "proofOfFundsEur": 5000,
    "proofOfFundsNote": "Approx. LKR 3–4 Million bank letter",
    "workRights": "Restricted during semester",
    "intakes": ["January", "April", "July", "September"],
    "callScriptPitch": "UK & Australian dual degrees completed close to Sri Lanka at a third of the standard tuition cost.",
    "appointmentHook": "No embassy interview required. Visit our Nugegoda branch this week to review branch campuses."
  },
  {
    "id": "dubai",
    "country": "Dubai (UAE)",
    "ugAgeLimit": 50,
    "pgAgeLimit": 55,
    "maxStudyGapYears": 20,
    "minAcademicUG": "O/L or A/L passes",
    "minAcademicPG": "Bachelor or Diploma",
    "englishReqs": {
      "NONE": "Direct entry with internal assessment",
      "DUOLINGO": "Accepted",
      "IELTS": "Not mandatory",
      "MOI": "Accepted"
    },
    "proofOfFundsEur": 4000,
    "proofOfFundsNote": "Low financial documentation (Tuition payment primary)",
    "workRights": "Unrestricted part-time work allowed on student visa",
    "intakes": ["Rolling (Every 2 Months)"],
    "callScriptPitch": "Fastest 2-week student visa issuance, zero English barriers, and massive global job market exposure.",
    "appointmentHook": "You can be enrolled and flying out within 4 weeks. Let's get your passport registered."
  }
]
```

---

### 6. Pipeline Progression & Numbers Tracking

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────┐
│ 1. NEW LEAD     │ ────▶ │ 2. TRIAGED      │ ────▶ │ 3. APPOINTMENT SET  │
│ (WhatsApp/Call) │       │ (Matched to Uni)│       │ (Nugegoda / Zoom)   │
└─────────────────┘       └─────────────────┘       └─────────────────────┘
                                                               │
                                                               ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────┐
│ 6. CLOSED / VISA│ ◀──── │ 5. LODGED / VFS │ ◀──── │ 4. FILE OPENED      │
│ (Enrolled)      │       │ (Awaiting Visa) │       │ (Docs + Adv. Paid)  │
└─────────────────┘       └─────────────────┘       └─────────────────────┘
```

#### Metrics Tracked on Dashboard:

1. **Total Inquiries Today**: Inbound call count.
2. **Triaged %**: Calls that converted into identified country fits.
3. **Appointment Conversion Rate**: `(Appointments Booked / Total Calls) * 100` (Benchmark: > 40%).
4. **Country Breakdown**: Distribution chart showing demand (e.g. 45% Latvia, 30% Malta, 15% UK).
