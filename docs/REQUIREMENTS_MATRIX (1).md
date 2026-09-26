# Requirements Traceability Matrix: Study Link Counselor OS

| Screen / UI Component | Action Type | Read Source / Contract | Fallback & Guard |
| :--- | :--- | :--- | :--- |
| **Instant Triage Modal** | Read (Fast In-Memory) | `lib/data/country-rules.json` | Displays partial matches if criteria near boundary |
| **10-Country Comparison Matrix** | Read (Static Table) | `useCountryRules()` | Filterable by Age, Gap, Min Qual, English Test |
| **Country Detail Modal** | Read | `getCountryById(slug)` | Complete requirements breakdown & cost estimates |
| **Quick Call Script Overlay** | Read (Static Text) | `lib/data/call-scripts.json` | 3-minute structured appointment closing pitch |
| **Kanban Pipeline Board** | Read / Light Mutate | `useStudentPipeline()` | Drag/drop stage update, localStorage/JSON mock sync |
| **Student Profile Summary Drawer** | Read | `getStudentById(id)` | Tabbed view: Academics, Financials, Documents |
| **Daily Follow-Up Queue** | Read (Filtered List) | `useAppointments(today)` | Highlights leads needing calls within 24h |
| **Lead Generation Form** | Create (Light Sync) | `addStudentLead(payload)` | Real-time validation for WhatsApp format (`+94...`) |
