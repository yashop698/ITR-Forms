# ITR-Forms
# UI/UX SPECIFICATION: FY 2025-26 ITR Filing Knowledge Base
## Interactive Web Page Architecture & Design Requirements

---

## NAVIGATION STRUCTURE (I'VE DECIDED THIS FOR YOU)

### Primary Navigation Flow
```
HOME PAGE
├── Quick ITR Form Selector (Decision Tree)
├── Browse All Forms (ITR-1 to ITR-7)
├── Scenario Search/Filter
├── Post-Filing Procedures
├── Reference & Downloads
└── Help & FAQs
```

### Detailed Information Hierarchy

#### 1. LANDING PAGE (Hero Section)
- Title: "FY 2025-26 Income Tax Return (ITR) Filing Guide — Complete Knowledge Base"
- Subtitle: "All ITR Forms, Scenarios, Procedures & Compliance for AY 2026-27"
- Tagline: "Professional. Comprehensive. Up-to-date with CBDT Changes."
- **Call-to-Action Buttons**:
  - "Start ITR Selector" (Decision Tree)
  - "Browse All Forms"
  - "Search Scenarios"
  - "View Deadlines & Important Dates"

---

## SECTION 1: QUICK ITR FORM SELECTOR (Decision Tree)
**Purpose**: Help users find the correct ITR form in 3-4 questions

### Structure
```
Step 1: "What is your status?"
  → Resident Individual
  → Non-Resident Individual (NRI)
  → Hindu Undivided Family (HUF)
  → Partnership Firm
  → Company
  → Charitable Trust / Registered Organization
  → Political Party

Step 2: "What are your primary income sources?" (Multi-select)
  → Salary/Wages
  → House Property (Rental/Self-occupied)
  → Capital Gains
  → Business/Professional Income
  → Foreign Income
  → Dividends/Interest
  → Other Sources

Step 3: "Do you have any of these?" (Conditional based on Step 2)
  → Business turnover > ₹2.5 Crore
  → Presumptive income (44AD/44ADA/44AE/44B)
  → Multiple house properties (if applicable)
  → Foreign assets/remittance
  → Capital losses to carry forward

Result: Recommended ITR Form(s) with brief explanation
```

**UI Design**:
- Single-page form or multi-step wizard
- Progress bar showing current step
- Back button to revise answers
- Color-coded results (e.g., green for recommended, yellow for alternative)
- "Read More About [Form Name]" button on result

---

## SECTION 2: ALL ITR FORMS (ITR-1 to ITR-7)

### Individual Form Page Structure (Each Form Gets This Layout)

#### Tab 1: OVERVIEW
- **Form Name & Code** (e.g., "ITR-1 (Sahaj)")
- **One-line Description**
- **Who Can File** (checklist format)
- **Who Cannot File** (bullet list)
- **Resident vs. NRI Treatment**
- **HUF Eligibility** (if applicable)
- **Common Misconceptions** (callout box)

#### Tab 2: APPLICABILITY & ELIGIBILITY
- **Decision Tree**: "Can I file this form?" with step-by-step yes/no questions
- **Income Source Limits** (table format):
  | Income Source | Limit | Example |
  |---|---|---|
  | Salary | No limit | ₹10 Lakh salary ✓ |
  | Capital Gains | No limit | ₹2 Lakh LTCG ✓ |
  | Business | Not more than ₹5 Lakh | ₹3 Lakh ✓ |
  
- **Turnover/Profit Thresholds** (if applicable)
- **Mandatory vs. Optional Cases**
- **Scenarios Chart**: Can/Cannot file in various situations

#### Tab 3: SCHEDULES GUIDE
- **List of All Schedules** in this form (compulsory vs. optional)
- **Schedule-by-Schedule Breakdown**:
  - Schedule name and ID (e.g., Schedule BP)
  - What it covers
  - When it's compulsory
  - When it's optional
  - Key fields and what each means
  - Common mistakes
  - Cross-references to other schedules

- **Schedule Dependency Diagram** (visual):
  ```
  Schedule S (Summary)
  ├── Schedule 1A (Income Details)
  ├── Schedule 2 (Deductions)
  ├── Schedule BP (Business Particulars) [Links to Schedule S]
  └── Schedule CG (Capital Gains) [Links to Schedule S]
  ```

#### Tab 4: WORKED EXAMPLES (5-6 Scenarios Per Form)
- **Expandable Cards** for each scenario:
  ```
  SCENARIO 1: Salaried Individual, No Other Income
  ├── Taxpayer Profile
  │   ├── Name: (Sample Name)
  │   ├── Age: 35
  │   ├── Status: Resident Individual
  │   ├── Occupation: IT Professional
  │   ├── Income: ₹12 Lakh salary
  │   └── Other: NIL
  ├── Which Schedules to Fill (checklist)
  ├── Step-by-Step Filling
  │   ├── Schedule 1A: [Sample filled values]
  │   ├── Schedule S: [Sample summary]
  │   └── Schedule 2: [Deductions claimed]
  ├── Filled Form Preview (table or screenshot)
  ├── Expected Output
  │   ├── Gross Total Income: ₹12,00,000
  │   ├── Total Deductions: ₹1,50,000
  │   ├── Taxable Income: ₹10,50,000
  │   ├── Tax Payable: ₹1,60,200
  │   ├── Surcharge: NIL
  │   └── Health & Education Cess: ₹11,522
  ├── Red Flags in This Scenario
  ├── Common Mistakes to Avoid
  └── [Expand to View Detailed Schedule Values]
  ```

- **Scenario Titles** (searchable, filterable):
  1. Basic salaried individual
  2. Salaried + house property
  3. Salaried + capital gains (long-term)
  4. Salaried + capital gains (short-term) with loss
  5. Non-salaried (business/freelance only)
  6. With special circumstances (NRI, foreign income, etc.)

- **Visual Form Preview**: Sample PDF or screenshot of filled form (optional but helpful)

#### Tab 5: RED FLAGS & COMMON MISTAKES
- **Critical Mistakes** (boxed in red):
  - Mistake 1: Description → Consequence → How to Avoid
  - Mistake 2: ...
  - Mistake 3: ...

- **Validation Errors** (Common form validation failures)
  - Error: "Total Income doesn't match sum of schedules"
  - Solution: ...

- **Assessment Triggers** (Scenarios that increase audit risk)
  - High cash transactions without documentation
  - Inconsistent house property reporting
  - Large deductions without supporting docs

---

## SECTION 3: CROSS-CUTTING INCOME & DEDUCTION GUIDES

### Tab Structure: Income Types Submenu
```
├── SALARY INCOME
│   ├── Components (Basic, DA, HRA, Transport, etc.)
│   ├── TDS rules and ITR reporting
│   ├── Tax-free allowances u/s 10
│   ├── Arrears handling
│   └── Worked examples
│
├── HOUSE PROPERTY
│   ├── Self-occupied vs. let-out
│   ├── Deduction of interest u/s 24
│   ├── Loss carry-forward (up to 8 years)
│   ├── Capital gains on sale
│   ├── Two properties scenario (NEW for FY 2025-26)
│   └── Worked examples
│
├── CAPITAL GAINS
│   ├── LTCG u/s 112A (₹1.25 lakh exempt)
│   ├── Indexation benefit
│   ├── Holding periods
│   ├── Loss carry-forward
│   ├── New ITR-4 integration (NEW for FY 2025-26)
│   └── Worked examples
│
├── BUSINESS/PROFESSIONAL INCOME
│   ├── Profit computation
│   ├── Depreciation and allowances
│   ├── Working capital adjustments
│   ├── Presumptive income schemes (44AD, 44ADA, 44AE, 44B)
│   ├── ITR-3 vs. ITR-4 choice
│   └── Worked examples
│
├── FOREIGN INCOME
│   ├── Remittance vs. accrual basis
│   ├── TDS paid abroad
│   ├── Foreign tax credit
│   ├── Conversion rates and documentation
│   └── Worked examples
│
└── OTHER INCOME
    ├── Interest, dividends
    ├── Rental income from movable property
    ├── Pension and annuities
    └── Worked examples
```

### Tab Structure: Deductions Submenu
```
├── SECTION 80C (Limit: ₹1.5 Lakh)
│   ├── Life insurance premiums
│   ├── EPF contributions
│   ├── 5-year fixed deposits
│   ├── ELSS funds
│   └── Documentation required
│
├── SECTION 80CCD (NPS - No limit + 80C component)
│   ├── Employee contribution (80CCD(1))
│   ├── Employer contribution (80CCD(2))
│   ├── Self-employed NPS (80CCD(1)(b) - ₹50k limit)
│   └── Tax impact and worked examples
│
├── SECTION 80CCD(1)(b) (NPS Tier-II - ₹50,000)
│   ├── Additional NPS contribution
│   ├── Filing requirements
│   └── Worked examples
│
├── SECTION 80E (Education Loan Interest)
│   ├── Eligibility
│   ├── Limit (₹50,000 or actual, whichever is less)
│   ├── Documentation
│   └── Worked examples
│
├── SECTION 80EE (Home Loan Interest for 1st-time Buyers)
│   ├── Eligibility criteria (NEW changes for FY 2025-26)
│   ├── Limit (₹2,00,000)
│   ├── Interaction with 80EEA
│   └── Worked examples
│
├── SECTION 80EEA (Home Loan for Affordable Housing)
│   ├── Eligibility (₹45 Lakh home value limit)
│   ├── Limit (₹3,50,000)
│   ├── Interaction with 80EE
│   └── Worked examples
│
├── SECTION 80EEB (Health Insurance Premium)
│   ├── Eligibility and conditions
│   ├── Limit (₹1,00,000 senior citizens, ₹50,000 others)
│   ├── Documentation
│   └── Worked examples
│
├── SECTION 80G (Donations)
│   ├── 50% and 100% donation categories
│   ├── Limit (50% of adjusted gross total income)
│   ├── Applicable donors
│   └── Worked examples
│
└── OTHER DEDUCTIONS
    ├── 80GG (Rent paid)
    ├── 80U (Disability)
    ├── 80AC (Deduction before assessment)
    └── Worked examples
```

---

## SECTION 4: POST-FILING PROCEDURES & COMPLIANCE

### Tab Navigation
```
├── E-VERIFICATION (Verification of ITR)
│   ├── When mandatory vs. optional
│   ├── Types of e-verification
│   │   ├── OTP-based (via email/SMS)
│   │   ├── DSC-based (Digital Signature Certificate)
│   │   ├── Offline verification (Forms 3, 4, 5, 6, 7)
│   │   └── Bank verification
│   ├── Step-by-step e-verification process
│   ├── Timeline and deadlines
│   ├── Consequences of non-verification
│   └── Troubleshooting common issues
│
├── PROCESSING & ASSESSMENT
│   ├── ITR processing timeline (when refund/demand issued)
│   ├── What happens during processing
│   ├── Notice of Processing (if any)
│   ├── E-assessment procedures
│   ├── Assessment orders and tax demands
│   ├── Scrutiny selection criteria and red flags
│   └── Worked examples
│
├── DEFECT NOTICES
│   ├── Common defects issued by tax department
│   │   ├── Missing mandatory fields
│   │   ├── Inconsistent information
│   │   ├── Missing e-verification
│   │   └── Other procedural defects
│   ├── Time limit to respond (typically 15 days)
│   ├── How to respond (online via e-filing portal)
│   ├── Form to use (Form 142 or reply letter)
│   ├── Examples of defects and responses
│   └── Consequences of non-response
│
├── REVISED RETURN FILING
│   ├── When to file (within 1 year from AY end)
│   ├── Reasons for revised return (error, omission, new income)
│   ├── How to file (Form 139)
│   ├── Differences from original return (highlighted)
│   ├── Support documentation required
│   ├── Processing timeline
│   ├── Worked examples
│   └── Common mistakes in revised returns
│
├── BELATED RETURN FILING
│   ├── Timeline (before assessment completion)
│   ├── Penalty implications
│   ├── Form and process
│   ├── Documentation required
│   └── Worked examples
│
├── INTEREST & PENALTIES
│   ├── Interest u/s 234A (Late filing interest)
│   │   ├── Rate and calculation
│   │   ├── Due date for interest payment
│   │   └── Worked example
│   ├── Interest u/s 234B & 234C (Advance tax shortfall)
│   ├── Interest u/s 234D (Post-order interest)
│   ├── Penalty u/s 271G (Failure to verify)
│   ├── Penalty u/s 271H (Failure to furnish ITR)
│   ├── Penalty u/s 271J (Incorrect information)
│   └── Total impact on tax liability (calculation example)
│
├── NOTICE RESPONSE PROCEDURES
│   ├── Types of notices (Assessment u/s 143(2), Defect, Query, etc.)
│   ├── Time limits for response (15/30 days depending on notice)
│   ├── How to respond (online portal, email, or physical)
│   ├── Documentation checklist for each notice type
│   ├── Sample response letter templates
│   └── Do's and Don'ts
│
├── REFUND PROCESSING
│   ├── When refund is issued (after assessment)
│   ├── Timeline for refund
│   ├── Interest on refund (u/s 244A, 244AA)
│   ├── Refund modes (NEFT, cheque, adjustment against demand)
│   ├── Tracking refund status
│   └── Delay handling and complaints
│
└── RECTIFICATION & MODIFICATION
    ├── Rectification u/s 154 (correction of mistakes)
    ├── Modification u/s 155 (correction by AO)
    ├── Time limits
    ├── Procedures
    └── Worked examples
```

---

## SECTION 5: REFERENCE & DOWNLOADS

### Subsections
```
├── IMPORTANT DATES & DEADLINES (FY 2025-26)
│   ├── ITR Filing Deadline: July 31, 2026
│   ├── E-Verification Deadline: [Date]
│   ├── Revised Return: 1 year from AY end (March 31, 2027)
│   ├── Belated Return: Before assessment completion
│   ├── Interest Payment Dates
│   └── Calendar view with all important dates
│
├── FORM APPLICABILITY MATRIX (Table)
│   └── [Assessee Type × Income Source → Recommended Form]
│
├── SCHEDULE FILING MATRIX (Table)
│   └── [Form × Schedule Name → Compulsory/Optional/Linked Schedule]
│
├── DEDUCTION APPLICABILITY MATRIX (Table)
│   └── [Deduction Section × ITR Form → Applicable/Not Applicable]
│
├── DOWNLOADABLE RESOURCES
│   ├── Pre-Filing Checklists (PDF per form)
│   │   ├── ITR-1 Checklist
│   │   ├── ITR-2 Checklist
│   │   └── [Etc. for ITR-3 to ITR-7]
│   │
│   ├── Schedule-Filling Templates (Excel)
│   │   ├── Schedule BP Template
│   │   ├── Schedule CA Template
│   │   └── [Etc.]
│   │
│   ├── Required Documentation Checklists (PDF)
│   │   ├── Salaried Individual
│   │   ├── House Property
│   │   ├── Business Income
│   │   └── [Etc.]
│   │
│   ├── Scenario Decision Tree (Flowchart PDF)
│   │   └── Visual guide to selecting correct ITR form
│   │
│   ├── Important Sections & Rules Summary (PDF)
│   │   ├── Sections 10 (Exemptions)
│   │   ├── Sections 14 (Heads of Income)
│   │   ├── Sections 44AD-44AE (Presumptive Income)
│   │   └── [Etc.]
│   │
│   └── ITR Forms (Links to Official PDFs)
│       ├── ITR-1 Form
│       ├── ITR-2 Form
│       └── [Etc.]
│
├── REFERENCE TABLES & CHARTS
│   ├── Income Recognition Rules (by source)
│   ├── Tax Rates & Slabs for FY 2025-26
│   ├── Deduction Limits Summary
│   ├── TDS Rates on Different Payments
│   └── [Etc.]
│
├── EXTERNAL LINKS
│   ├── Income-tax India e-filing portal
│   ├── CBDT Official Website
│   ├── Income-tax Act, 1961 (Full text)
│   ├── Income-tax Rules, 1962 (Full text)
│   └── Recent CBDT Circulars & Notifications
│
└── HELP & CONTACT
    ├── e-Filing Portal Help Number
    ├── Income-tax Helpline
    └── For queries on this knowledge base
```

---

## DESIGN & UI ELEMENTS

### Color Scheme (Professional & Lucrative)
- **Primary**: Deep Blue (#1F3A93) — Trust, professionalism
- **Accent**: Gold (#D4AF37) — Lucrative, premium feel
- **Success**: Green (#27AE60) — Correct/approved status
- **Warning/Alert**: Orange (#E67E22) — Red flags, caution
- **Error**: Red (#E74C3C) — Critical issues
- **Background**: Off-white (#F8F9FA) — Clean, readable
- **Text**: Dark Gray (#2C3E50) — High contrast, readable

### Typography
- **Headers**: Bold, sans-serif (e.g., Inter, Roboto)
- **Body**: Regular sans-serif for readability
- **Code/Data**: Monospace for form values and examples

### Interactive Components
- **Accordion Tabs**: For form sections, scenarios, procedures
- **Expandable Cards**: For scenario details (click to expand full example)
- **Toggle Switches**: For optional/compulsory schedule visibility
- **Checkboxes**: For scenario eligibility checks, pre-filing checklists
- **Dropdown Menus**: For filtering (form, scenario type, income source)
- **Search Bar**: Global search across all content (forms, scenarios, procedures)
- **Breadcrumb Navigation**: Show current location in the structure
- **Progress Indicators**: For decision tree wizard
- **Callout Boxes**: For critical info, red flags, common mistakes (color-coded)
- **Tables**: For data matrices (form applicability, schedules, deductions)
- **Code Snippets/Data Blocks**: For form values and calculations (monospace, highlighted)

### Responsive Design (Mobile-First)
- **Desktop**: Full sidebar navigation + main content area
- **Tablet**: Collapsible sidebar, stacked sections
- **Mobile**: Hamburger menu, single-column layout, accordion-based navigation

### Accessibility
- Alt text for all images
- High contrast ratios (WCAG AA minimum)
- Keyboard navigation support
- Screen reader friendly
- Clear focus indicators

---

## CONTENT DENSITY & INFORMATION ARCHITECTURE

### Homepage
- Hero section with tagline
- 4 main CTA buttons (Quick Selector, Browse Forms, Search, Deadlines)
- Brief introduction
- Quick links to most-used sections

### Form Pages
- Compact tabs at the top (Overview, Eligibility, Schedules, Examples, Red Flags)
- Clean hierarchy with collapsible sections
- Sticky header for easy tab switching
- Back to Top button for long pages

### Scenario Details
- Expandable card format (summary visible, details on click)
- Visual form preview (screenshot or table)
- Highlighted key takeaways
- Related scenarios (similar cases) links

### Post-Filing Sections
- Sequential accordion (Step 1 → Step 2 → Step 3)
- Visual timeline for procedures
- Estimated timelines
- Contact info for escalation

---

## SEARCH & FILTERING

### Global Search
- Search across all forms, scenarios, procedures, deductions
- Auto-complete suggestions as user types
- Results grouped by type (Form, Scenario, Procedure, Deduction)
- Highlight matching keywords in results

### Filters (Sidebar)
- **By Form**: ITR-1, ITR-2, ... ITR-7
- **By Assessee Type**: Individual, HUF, Partnership, Company, etc.
- **By Income Source**: Salary, Property, Capital Gains, Business, Foreign, Other
- **By Scenario Complexity**: Basic, Intermediate, Advanced
- **By Recent Updates**: Mark "NEW for FY 2025-26"

---

## PERFORMANCE & LOADING

- Page load time < 2 seconds
- Lazy load images and large content sections
- Progressive disclosure (expand on click)
- Offline access for critical sections (using service workers)

---

## ANALYTICS & TRACKING (OPTIONAL)

- Track most-visited forms
- Track user paths (decision tree → form → scenario)
- Track search queries
- Track downloads
- Use for future content optimization

---

## BUILD TECHNOLOGY STACK (For Developer)

As specified by user:
- **Frontend**: React with Tailwind CSS (utility-first styling)
- **Backend**: Node.js (if needed for search, download generation)
- **Styling**: Tailwind CSS for rapid, professional UI development
- **Icons**: Lucide-react or similar for clean, minimal icons
- **Data Structure**: JSON for all content (forms, scenarios, procedures)
- **Hosting**: Vercel, Netlify, or self-hosted Node.js server

---

## DELIVERABLE CHECKLIST FOR DEVELOPER

- [ ] Decision tree wizard (3-4 steps, form recommendation)
- [ ] All 7 ITR form pages with 5-6 scenarios each
- [ ] Income & deduction guides (cross-cutting content)
- [ ] Post-filing procedures (e-verification, assessment, defects, revised, etc.)
- [ ] Reference section with downloadable resources
- [ ] Global search with filters
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Professional color scheme and typography
- [ ] Smooth navigation and no broken links
- [ ] Accessibility compliance (WCAG AA)
- [ ] Performance optimized (< 2s load time)
- [ ] All content data in structured JSON format (ready for API integration)

---

## SUGGESTED DEVELOPMENT PHASES

**Phase 1**: Homepage, Decision Tree, ITR-1 & ITR-4 forms (most commonly used)
**Phase 2**: ITR-2, ITR-3, ITR-5 forms + Income & Deduction guides
**Phase 3**: ITR-6, ITR-7, Post-Filing Procedures, Reference section
**Phase 4**: Search, Filters, Download functionality, Analytics

---

## FINAL VISION

A **professional, comprehensive, mobile-friendly ITR knowledge base** that:
- Helps users select the correct ITR form instantly
- Provides step-by-step guidance for every scenario
- Serves as an internal firm reference
- Looks premium and authoritative (gold accents, clean design)
- Is fast, accessible, and easy to navigate
- Contains everything a CA needs for FY 2025-26 ITR filing

**User Outcome**: "I don't need to Google anything — everything I need is here."
