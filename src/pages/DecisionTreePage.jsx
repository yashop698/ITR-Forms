import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, RotateCcw, CheckCircle2, AlertTriangle,
  Info, ExternalLink, User, Building2, Users, Landmark, Globe,
  FileText, ArrowRight, BadgeCheck, Lightbulb, ListChecks, ShieldAlert,
  Sparkles, HelpCircle, GitBranch,
} from 'lucide-react'
import Breadcrumb from '../components/ui/Breadcrumb'

// ---------------------------------------------------------------------------
// Hardcoded fallback decision tree – mirrors the JSON file so the component
// works even when the fetch fails (offline / local dev without a static server).
// ---------------------------------------------------------------------------
const FALLBACK_TREE = {
  version: 'FY 2025-26',
  ayApplicable: '2026-27',
  startNodeId: 'Q1',
  nodes: [
    {
      nodeId: 'Q1', type: 'question', step: 1,
      questionText: 'What is your legal status as a taxpayer?',
      helpText: 'Select the category that best describes you. This determines which family of ITR forms is applicable.',
      options: [
        { optionId: 'Q1-A', label: 'Resident Individual (Indian citizen living in India)', helpText: 'An individual who satisfies residential conditions u/s 6(1) — present in India for 182+ days in the FY.', nextNodeId: 'Q2' },
        { optionId: 'Q1-B', label: 'Non-Resident Individual (NRI / Seafarer / Indian Abroad)', helpText: 'An individual who does NOT satisfy residential conditions u/s 6(1). Includes RNOR for some income types.', nextNodeId: 'Q2-NRI' },
        { optionId: 'Q1-C', label: 'Hindu Undivided Family (HUF)', helpText: 'A joint family with a Karta. HUF is a distinct tax entity from individual members.', nextNodeId: 'Q2-HUF' },
        { optionId: 'Q1-D', label: 'Partnership Firm or LLP', helpText: 'A registered partnership firm or Limited Liability Partnership (LLP) under the Partnership Act / LLP Act.', nextNodeId: 'RESULT-ITR5' },
        { optionId: 'Q1-E', label: 'Company (Private, Public, or Foreign)', helpText: 'Any company incorporated under Companies Act 2013 or foreign company with income in India.', nextNodeId: 'Q1-E-COMPANY' },
        { optionId: 'Q1-F', label: 'Trust, Society, or Institution (Charitable/Religious)', helpText: 'Any person registered u/s 12A/12AB or claiming exemption u/s 11/12.', nextNodeId: 'RESULT-ITR7' },
        { optionId: 'Q1-G', label: 'AOP, BOI, or Artificial Juridical Person', helpText: 'Association of Persons, Body of Individuals, or entities like universities, statutory corporations.', nextNodeId: 'Q1-G-AOP' },
      ],
    },
    {
      nodeId: 'Q1-E-COMPANY', type: 'question', step: 2,
      questionText: 'Is this company claiming exemption under Section 11 or 12 (as a charitable/religious institution)?',
      options: [
        { optionId: 'Q1-E-A', label: 'No — regular company (business, investment, etc.)', nextNodeId: 'RESULT-ITR6' },
        { optionId: 'Q1-E-B', label: 'Yes — company registered u/s 12A/12AB and claiming u/s 11/12', nextNodeId: 'RESULT-ITR7' },
      ],
    },
    {
      nodeId: 'Q1-G-AOP', type: 'question', step: 2,
      questionText: 'Is this AOP/BOI registered as a charitable institution (claiming exemption u/s 11/12)?',
      options: [
        { optionId: 'Q1-G-A', label: 'No — ordinary AOP/BOI with business or investment income', nextNodeId: 'RESULT-ITR5' },
        { optionId: 'Q1-G-B', label: 'Yes — registered u/s 12A/12AB and claiming exemption', nextNodeId: 'RESULT-ITR7' },
      ],
    },
    {
      nodeId: 'Q2', type: 'question', step: 2,
      questionText: 'Do you have business or professional income?',
      helpText: 'Business income includes trade, shop, manufacturing, trading. Professional income includes CA, doctor, lawyer, architect, engineer, consultant services.',
      options: [
        { optionId: 'Q2-A', label: 'Yes — and I use a presumptive income scheme (44AD, 44ADA, 44AE, or 44B)', helpText: '44AD: Small businesses; 44ADA: Specified professionals; 44AE: Goods vehicle operators; 44B: Shipping business', nextNodeId: 'Q3-PRESUMPTIVE' },
        { optionId: 'Q2-B', label: 'Yes — I maintain regular books of accounts (actual profit/loss)', helpText: 'You prepare a Profit & Loss Account and Balance Sheet', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q2-C', label: 'No — I have no business or professional income', helpText: 'Income is only from salary, house property, capital gains, or other sources', nextNodeId: 'Q3-INDIVIDUAL' },
      ],
    },
    {
      nodeId: 'Q2-NRI', type: 'question', step: 2,
      questionText: 'As an NRI, do you have business or professional income in India?',
      options: [
        { optionId: 'Q2-NRI-A', label: 'Yes — business/professional income in India', helpText: 'Business operated through a branch/agent in India, or professional services rendered in India', nextNodeId: 'RESULT-ITR3', note: 'NRIs with business income typically use ITR-3.' },
        { optionId: 'Q2-NRI-B', label: 'No — only salary, capital gains, property, or other India-sourced income', nextNodeId: 'RESULT-ITR2-NRI' },
      ],
    },
    {
      nodeId: 'Q2-HUF', type: 'question', step: 2,
      questionText: 'What type of income does the HUF have?',
      options: [
        { optionId: 'Q2-HUF-A', label: 'Presumptive business income (44AD or 44AE)', nextNodeId: 'Q3-HUF-PRESUMPTIVE' },
        { optionId: 'Q2-HUF-B', label: 'Regular business income (maintains books of accounts)', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q2-HUF-C', label: 'No business income (investments, capital gains, house property, etc.)', nextNodeId: 'Q3-HUF-NOINCOME' },
      ],
    },
    {
      nodeId: 'Q3-HUF-PRESUMPTIVE', type: 'question', step: 3,
      questionText: 'Does the HUF have any of these disqualifying factors?',
      options: [
        { optionId: 'Q3-HUF-A', label: 'More than 2 house properties', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3-HUF-B', label: 'Capital gains of any type (other than LTCG 112A within ₹1.25L)', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3-HUF-C', label: 'Foreign income or foreign assets', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3-HUF-D', label: 'None of the above', nextNodeId: 'RESULT-ITR4' },
      ],
    },
    {
      nodeId: 'Q3-HUF-NOINCOME', type: 'question', step: 3,
      questionText: 'Does the HUF have capital gains or more than 1 house property?',
      options: [
        { optionId: 'Q3-HUF-NI-A', label: 'Yes — has capital gains or multiple house properties', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3-HUF-NI-B', label: 'No — only house property income (1 property) and other sources', nextNodeId: 'RESULT-ITR2', note: 'HUFs cannot file ITR-1. They must use ITR-2 minimum.' },
      ],
    },
    {
      nodeId: 'Q3-PRESUMPTIVE', type: 'question', step: 3,
      questionText: 'Do any of these conditions apply to you? (Select the first that applies)',
      helpText: 'These are disqualifying factors that prevent use of the simpler ITR-4 form.',
      options: [
        { optionId: 'Q3P-A', label: 'I own more than 2 house properties', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3P-B', label: 'I have capital gains other than LTCG u/s 112A within ₹1.25 lakh', helpText: 'Includes STCG on equity, LTCG on property, capital losses being carried forward, or LTCG u/s 112A above ₹1.25 lakh', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3P-C', label: 'I am a Director in any company', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3P-D', label: 'I held unlisted equity shares at any time during FY 2025-26', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3P-E', label: 'I have foreign income, foreign assets, or signing authority in foreign accounts', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3P-F', label: 'My total income (all sources) exceeds ₹50 lakh', nextNodeId: 'RESULT-ITR3' },
        { optionId: 'Q3P-G', label: "None of the above — I'm eligible for ITR-4", nextNodeId: 'RESULT-ITR4' },
      ],
    },
    {
      nodeId: 'Q3-INDIVIDUAL', type: 'question', step: 3,
      questionText: 'Which of these apply to you? (Select the first that applies)',
      helpText: 'We need to determine if you need ITR-2 or can use the simpler ITR-1.',
      options: [
        { optionId: 'Q3I-A', label: 'I am a Director in any company', helpText: 'Even a nominee director of any company disqualifies ITR-1', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3I-B', label: 'I held unlisted equity shares at any point during FY 2025-26', helpText: 'Even holding 1 share in an unlisted company for 1 day disqualifies ITR-1', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3I-C', label: 'I have any capital gains (long-term or short-term) or capital losses', helpText: 'Any amount of capital gain — including LTCG u/s 112A even within the exempt limit', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3I-D', label: 'I own more than 1 house property', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3I-E', label: 'I have foreign income or foreign assets', helpText: 'Includes foreign bank accounts, overseas investments, foreign salary, etc.', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3I-F', label: 'My total income exceeds ₹50 lakh', nextNodeId: 'RESULT-ITR2' },
        { optionId: 'Q3I-G', label: 'None of the above — I have only salary, 1 house property (or none), and other sources', nextNodeId: 'RESULT-ITR1' },
      ],
    },
    // ---- Results ----
    {
      nodeId: 'RESULT-ITR1', type: 'result',
      recommendedForm: 'ITR-1', popularName: 'Sahaj', confidence: 'high', color: 'green',
      explanation: 'You are a resident individual with simple income sources. ITR-1 (Sahaj) is the correct and simplest form for you.',
      eligibilitySummary: [
        'Resident Individual only',
        'Salary or pension income (any amount)',
        'Maximum 1 house property',
        'Other sources (savings interest, dividends, etc.)',
        'Agricultural income up to ₹5,000',
        'Total income must not exceed ₹50 lakh',
      ],
      warnings: [
        'Confirm you are NOT a director in any company',
        'Confirm you did NOT hold unlisted equity shares at any time in FY 2025-26',
        'Confirm you have NO capital gains of any type',
      ],
      nextSteps: [
        'Collect Form 16 from employer',
        'Check Form 26AS and AIS on income tax portal',
        'File by July 31, 2026',
      ],
      fy202526Notes: [
        'Default regime is NEW tax regime — evaluate old vs new regime before filing',
        'Standard deduction under new regime: ₹75,000',
        'Zero tax up to ₹12,75,000 income (new regime, salaried with standard deduction)',
      ],
    },
    {
      nodeId: 'RESULT-ITR2', type: 'result',
      recommendedForm: 'ITR-2', popularName: null, confidence: 'high', color: 'blue',
      explanation: 'You need ITR-2 because you have capital gains, multiple house properties, are a director/shareholder of an unlisted company, or have foreign income.',
      eligibilitySummary: [
        'Resident Individuals AND NRIs',
        'HUFs',
        'Capital gains (LTCG, STCG, or capital losses)',
        'Multiple house properties',
        'Directors in companies',
        'Holders of unlisted equity shares',
        'Foreign income or foreign assets',
      ],
      warnings: [
        'If you also have business/professional income (books of accounts), you need ITR-3 instead',
        'If you have presumptive income (44AD/44ADA) with no disqualifying factors, check ITR-4 eligibility',
      ],
      fy202526Notes: [
        'LTCG u/s 112A: Taxed at 12.5% above ₹1.25 lakh exemption',
        'STCG u/s 111A: Taxed at 20% flat',
        'Schedule FA mandatory if foreign assets or foreign accounts',
      ],
    },
    {
      nodeId: 'RESULT-ITR2-NRI', type: 'result',
      recommendedForm: 'ITR-2', popularName: null, confidence: 'high', color: 'blue',
      explanation: 'As an NRI with India-sourced income (salary, property, capital gains, etc.), you must file ITR-2. NRIs cannot use ITR-1.',
      eligibilitySummary: [
        'NRI with salary/pension from India',
        'NRI with house property income in India',
        'NRI with capital gains on Indian assets',
        'NRI with NRO account interest (taxable)',
      ],
      warnings: [
        'NRE account interest is exempt u/s 10(4) — do not include as taxable income',
        'FCNR account interest is exempt — report in Schedule EI (exempt income)',
        'DTAA benefits may apply depending on the country of residence — consult a tax advisor',
      ],
    },
    {
      nodeId: 'RESULT-ITR3', type: 'result',
      recommendedForm: 'ITR-3', popularName: null, confidence: 'high', color: 'orange',
      explanation: 'You need ITR-3 because you have business or professional income (maintaining books of accounts), or additional income types that disqualify ITR-4.',
      eligibilitySummary: [
        'Individual or HUF with business/professional income (regular books)',
        'Individual who switched from presumptive (44AD) to regular books',
        'Individual with business income + multiple house properties + capital gains',
        'Partners in partnership firms (for their individual ITR)',
        'Equity F&O traders (speculative + non-speculative business)',
      ],
      warnings: [
        'Must prepare Profit & Loss Account and Balance Sheet if turnover > ₹1 Crore (or professional receipts > ₹50L)',
        'Tax audit u/s 44AB may be required',
        'F&O trading loss can be set off against business income but not against salary',
      ],
      fy202526Notes: [
        'Employer NPS contribution u/s 80CCD(2) deduction raised to 14% (available in both regimes)',
      ],
    },
    {
      nodeId: 'RESULT-ITR4', type: 'result',
      recommendedForm: 'ITR-4', popularName: 'Sugam', confidence: 'high', color: 'green',
      explanation: 'You qualify for ITR-4 (Sugam) — the simplified form for presumptive income taxpayers. No need to maintain detailed books of accounts.',
      eligibilitySummary: [
        'Resident Individual or HUF using presumptive income scheme',
        'Section 44AD: Small businesses with turnover ≤ ₹3 Crore (digital-heavy) or ≤ ₹2 Crore (otherwise)',
        'Section 44ADA: Specified professionals with gross receipts ≤ ₹75 lakh',
        'Section 44AE: Goods transport operators (≤ 10 vehicles)',
        'Total income ≤ ₹50 lakh',
        'Up to 2 house properties (NEW for FY 2025-26)',
        'LTCG u/s 112A within ₹1.25 lakh (NEW for FY 2025-26)',
      ],
      warnings: [
        'If you opt out of presumptive scheme, you cannot re-enter for 5 years (44AD)',
        'If cash transactions exceed 5% of turnover, the higher ₹3 Crore limit does not apply for 44AD',
      ],
      fy202526Notes: [
        'NEW: Mandatory disclosure of cash balance and bank balance in Schedule BP as on March 31, 2026',
        'NEW: Up to 2 house properties allowed in ITR-4',
        'NEW: LTCG u/s 112A up to ₹1.25 lakh can be reported in ITR-4',
      ],
    },
    {
      nodeId: 'RESULT-ITR5', type: 'result',
      recommendedForm: 'ITR-5', popularName: null, confidence: 'high', color: 'purple',
      explanation: 'Partnership firms, LLPs, AOPs, BOIs, and similar entities file ITR-5.',
      eligibilitySummary: [
        'Partnership firms (registered or unregistered)',
        'Limited Liability Partnerships (LLPs)',
        'Association of Persons (AOP)',
        'Body of Individuals (BOI)',
        'Cooperative Societies',
        'Artificial Juridical Persons (not covered elsewhere)',
      ],
      warnings: [
        'Partners file their individual ITRs separately (ITR-2 or ITR-3) for personal income including share from firm',
        'Share of profit from a partnership firm is EXEMPT in the hands of partner u/s 10(2A)',
      ],
    },
    {
      nodeId: 'RESULT-ITR6', type: 'result',
      recommendedForm: 'ITR-6', popularName: null, confidence: 'high', color: 'purple',
      explanation: 'All companies (domestic and foreign) not claiming exemption u/s 11 must file ITR-6.',
      eligibilitySummary: [
        'Domestic companies (Private, Public, OPC, Section 8, etc.)',
        'Foreign companies with income sourced from India',
        'Excludes companies claiming exemption u/s 11 (those use ITR-7)',
      ],
      warnings: [
        'Section 8 companies that are charitable (registered u/s 12A/12AB) may use ITR-7 instead',
        'E-filing of ITR-6 is mandatory — no physical filing',
        'DSC (Digital Signature Certificate) is mandatory for companies',
      ],
    },
    {
      nodeId: 'RESULT-ITR7', type: 'result',
      recommendedForm: 'ITR-7', popularName: null, confidence: 'high', color: 'gray',
      explanation: 'Persons required to file under Sections 139(4A), 139(4B), 139(4C), or 139(4D) — including charitable trusts, political parties, research institutions, and universities.',
      eligibilitySummary: [
        'Trusts registered u/s 12A/12AB claiming exemption u/s 11/12',
        'Political parties u/s 139(4B)',
        'Scientific research associations, news agencies, trade unions u/s 139(4C)',
        'Universities, colleges, institutions u/s 10(23C)',
        'Mutual funds, securitization trusts u/s 139(4D)',
      ],
      warnings: [
        'Trust registration under FCRA may have additional compliance requirements',
        '85% income application rule must be met for exemption u/s 11',
        'Failure to comply with conditions u/s 13 leads to loss of exemption',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function buildNodeMap(nodes) {
  return nodes.reduce((map, node) => {
    map[node.nodeId] = node
    return map
  }, {})
}

// Color palette for result cards
const RESULT_PALETTE = {
  green:  { wrap: 'bg-green-50 border-green-400',   icon: 'text-success',    badge: 'bg-success text-white',     heading: 'text-green-800',  bullet: 'text-success'    },
  blue:   { wrap: 'bg-blue-50 border-blue-400',     icon: 'text-primary',    badge: 'bg-primary text-white',     heading: 'text-blue-900',   bullet: 'text-primary'    },
  orange: { wrap: 'bg-orange-50 border-orange-400', icon: 'text-warning',    badge: 'bg-warning text-white',     heading: 'text-orange-900', bullet: 'text-warning'    },
  purple: { wrap: 'bg-purple-50 border-purple-400', icon: 'text-purple-600', badge: 'bg-purple-600 text-white',  heading: 'text-purple-900', bullet: 'text-purple-600' },
  gray:   { wrap: 'bg-gray-50 border-gray-400',     icon: 'text-gray-600',   badge: 'bg-gray-600 text-white',    heading: 'text-gray-800',   bullet: 'text-gray-500'   },
}

// Icons for the first question (assessee type)
const ASSESSEE_ICONS = {
  'Q1-A': User,
  'Q1-B': Globe,
  'Q1-C': Users,
  'Q1-D': Landmark,
  'Q1-E': Building2,
  'Q1-F': BadgeCheck,
  'Q1-G': Landmark,
}

function formSlug(formName) {
  // 'ITR-1' → 'itr1'
  return formName.toLowerCase().replace('-', '')
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-muted">
          Step {current} of {total}
        </span>
        <span className="text-sm font-semibold text-primary">{pct}% complete</span>
      </div>
      {/* Track */}
      <div className="w-full h-2.5 bg-border-light rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2 px-[1px]">
        {Array.from({ length: total }, (_, i) => {
          const done  = i + 1 < current
          const active = i + 1 === current
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  done  ? 'bg-primary border-primary' :
                  active ? 'bg-white border-primary scale-125 shadow shadow-primary/30' :
                           'bg-white border-border-light'
                }`}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-text-muted'}`}>
                Step {i + 1}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HelpBubble({ text }) {
  const [open, setOpen] = useState(false)
  if (!text) return null
  return (
    <span className="relative inline-flex ml-1.5 align-middle">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="text-text-muted hover:text-primary transition-colors focus:outline-none"
        aria-label="More information"
      >
        <HelpCircle size={15} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-30 left-6 -top-1 w-64 bg-white border border-border-light rounded-xl shadow-lg p-3 text-xs text-text-muted leading-relaxed pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  )
}

function OptionCard({ option, index, isFirstQuestion, onClick }) {
  const Icon = isFirstQuestion ? (ASSESSEE_ICONS[option.optionId] ?? FileText) : null

  return (
    <button
      type="button"
      onClick={() => onClick(option)}
      className="w-full text-left group card p-4 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* Icon (Q1) or letter badge (other Qs) */}
        {isFirstQuestion ? (
          <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
            {Icon && <Icon size={20} className="text-primary" />}
          </span>
        ) : (
          <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-border-light group-hover:border-primary flex items-center justify-center text-xs font-bold text-text-muted group-hover:text-primary transition-colors mt-0.5">
            {String.fromCharCode(65 + index)}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-main group-hover:text-primary transition-colors leading-snug">
            {option.label}
          </p>
          {option.helpText && (
            <p className="mt-1 text-xs text-text-muted leading-relaxed">{option.helpText}</p>
          )}
          {option.note && (
            <p className="mt-1.5 text-xs text-warning font-medium flex items-center gap-1.5">
              <AlertTriangle size={12} className="flex-shrink-0" />
              {option.note}
            </p>
          )}
        </div>

        <ChevronRight
          size={18}
          className="flex-shrink-0 text-border-light group-hover:text-primary transition-colors mt-0.5"
        />
      </div>
    </button>
  )
}

function ResultCard({ node, onStartOver }) {
  const palette = RESULT_PALETTE[node.color] ?? RESULT_PALETTE.blue
  const slug = formSlug(node.recommendedForm)

  return (
    <div className={`rounded-2xl border-2 ${palette.wrap} overflow-hidden`}>
      {/* ---- Header ---- */}
      <div className="p-6 border-b border-black/5">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <CheckCircle2 size={30} className={palette.icon} />
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`text-3xl font-extrabold ${palette.heading}`}>
              {node.recommendedForm}
            </span>
            {node.popularName && (
              <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${palette.badge}`}>
                {node.popularName}
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent-dark">
              FY 2025-26 · AY 2026-27
            </span>
          </div>
        </div>
        <p className={`text-sm font-medium leading-relaxed ${palette.heading}`}>
          {node.explanation}
        </p>
      </div>

      {/* ---- Body ---- */}
      <div className="p-6 grid gap-6 sm:grid-cols-2">

        {/* Who should file */}
        <div>
          <h3 className="flex items-center gap-2 text-xs font-bold text-text-main uppercase tracking-widest mb-3">
            <ListChecks size={14} className={palette.icon} />
            Who should file this form
          </h3>
          <ul className="space-y-2">
            {node.eligibilitySummary.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                <CheckCircle2 size={14} className={`flex-shrink-0 mt-0.5 ${palette.bullet}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings + FY notes + next steps */}
        <div className="space-y-5">
          {node.warnings && node.warnings.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-text-main uppercase tracking-widest mb-3">
                <ShieldAlert size={14} className="text-warning" />
                Watch out for
              </h3>
              <ul className="space-y-2">
                {node.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                    <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-warning" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {node.fy202526Notes && node.fy202526Notes.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-text-main uppercase tracking-widest mb-3">
                <Sparkles size={14} className="text-accent" />
                FY 2025-26 updates
              </h3>
              <ul className="space-y-2">
                {node.fy202526Notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                    <Info size={13} className="flex-shrink-0 mt-0.5 text-accent" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {node.nextSteps && node.nextSteps.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-text-main uppercase tracking-widest mb-3">
                <ArrowRight size={14} className="text-success" />
                Next steps
              </h3>
              <ol className="space-y-2">
                {node.nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success/15 text-success text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* ---- CTA ---- */}
      <div className="px-6 pb-6 flex flex-wrap gap-3 items-center border-t border-black/5 pt-5">
        <Link to={`/forms/${slug}`} className="btn-primary">
          <FileText size={16} />
          Read more about {node.recommendedForm}
          <ExternalLink size={13} className="opacity-70" />
        </Link>
        <button type="button" onClick={onStartOver} className="btn-outline">
          <RotateCcw size={15} />
          Start over
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Answer trail shown below the active question card
// ---------------------------------------------------------------------------
function AnswerTrail({ history, nodeMap }) {
  if (history.length <= 1) return null
  const past = history.slice(0, -1).filter(nid => nodeMap[nid]?.type === 'question')
  if (past.length === 0) return null

  return (
    <div className="mt-5 p-4 rounded-xl bg-white border border-border-light">
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2.5">
        Your path so far
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {past.map((nid, idx) => {
          const n = nodeMap[nid]
          const label = n.questionText.length > 46 ? n.questionText.slice(0, 44) + '…' : n.questionText
          return (
            <span key={nid} className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {label}
              </span>
              {idx < past.length - 1 && (
                <ChevronRight size={12} className="text-text-muted" />
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DecisionTreePage() {
  const [nodeMap, setNodeMap] = useState(null)
  const [loadError, setLoadError] = useState(false)

  // Navigation history: stack of nodeIds visited
  const [history, setHistory] = useState(['Q1'])
  const [animDir, setAnimDir]     = useState('forward')  // 'forward' | 'back'
  const [animating, setAnimating] = useState(false)

  const currentNodeId = history[history.length - 1]
  const currentNode   = nodeMap ? nodeMap[currentNodeId] : null

  // ------------------------------------------------------------------
  // Load JSON data; fall back to FALLBACK_TREE on any error
  // ------------------------------------------------------------------
  useEffect(() => {
    fetch('/data/decision-tree/form-selector.json')
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then(data => setNodeMap(buildNodeMap(data.nodes)))
      .catch(() => {
        setLoadError(true)
        setNodeMap(buildNodeMap(FALLBACK_TREE.nodes))
      })
  }, [])

  // ------------------------------------------------------------------
  // Derive step info for progress bar
  // ------------------------------------------------------------------
  function getStepInfo(node) {
    if (!node) return { current: 1, total: 3 }
    if (node.type === 'result') return { current: 3, total: 3 }
    return { current: node.step ?? 1, total: 3 }
  }

  const stepInfo = getStepInfo(currentNode)
  const isResult       = currentNode?.type === 'result'
  const isFirstQuestion = currentNodeId === 'Q1'
  const canGoBack       = history.length > 1

  // ------------------------------------------------------------------
  // Animated transition helper
  // ------------------------------------------------------------------
  function transition(dir, callback) {
    if (animating) return
    setAnimDir(dir)
    setAnimating(true)
    // let CSS fade/slide start, then swap node, then re-enter
    setTimeout(() => {
      callback()
      setAnimating(false)
    }, 180)
  }

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  function handleOptionClick(option) {
    transition('forward', () => {
      setHistory(prev => [...prev, option.nextNodeId])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  function handleBack() {
    if (!canGoBack) return
    transition('back', () => {
      setHistory(prev => prev.slice(0, -1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  function handleStartOver() {
    transition('back', () => {
      setHistory(['Q1'])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // ------------------------------------------------------------------
  // Slide animation classes
  // ------------------------------------------------------------------
  const slideClass = animating
    ? animDir === 'forward'
      ? 'opacity-0 translate-x-3'
      : 'opacity-0 -translate-x-3'
    : 'opacity-100 translate-x-0'

  // ------------------------------------------------------------------
  // Loading state
  // ------------------------------------------------------------------
  if (!nodeMap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-text-muted">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading decision tree…</p>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------
  // Main render
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Tools', to: '/tools' },
            { label: 'ITR Form Selector' },
          ]}
        />

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <GitBranch size={22} className="text-primary" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main leading-tight">
              ITR Form Selector
            </h1>
          </div>
          <p className="text-text-muted text-sm sm:text-base ml-[52px]">
            Answer a few questions to find the right ITR form for{' '}
            <span className="font-semibold text-text-main">FY 2025-26 (AY 2026-27)</span>.
          </p>
          {loadError && (
            <p className="mt-2 ml-[52px] text-xs text-warning flex items-center gap-1.5">
              <AlertTriangle size={13} className="flex-shrink-0" />
              Running in offline mode — decision logic is built in.
            </p>
          )}
        </div>

        {/* Progress bar — only for question steps */}
        {!isResult && (
          <ProgressBar current={stepInfo.current} total={stepInfo.total} />
        )}

        {/* ============================================================ */}
        {/* Animated content area                                         */}
        {/* ============================================================ */}
        <div className={`transition-all duration-200 ease-out ${slideClass}`}>

          {/* ---------------------------------------------------------- */}
          {/* QUESTION node                                               */}
          {/* ---------------------------------------------------------- */}
          {!isResult && currentNode && (
            <div className="card p-6 sm:p-8">
              {/* Header row: step label + Back button */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                  {isFirstQuestion ? 'Start here' : `Question ${stepInfo.current}`}
                </span>
                {canGoBack && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-ghost text-sm py-1.5 px-3"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                )}
              </div>

              {/* Question text */}
              <h2 className="text-lg sm:text-xl font-bold text-text-main mb-1 leading-snug">
                {currentNode.questionText}
                {currentNode.helpText && (
                  <span className="hidden sm:inline">
                    <HelpBubble text={currentNode.helpText} />
                  </span>
                )}
              </h2>

              {/* Help text – visible inline on mobile */}
              {currentNode.helpText && (
                <p className="sm:hidden text-xs text-text-muted leading-relaxed mb-4">
                  {currentNode.helpText}
                </p>
              )}
              <div className="hidden sm:block mb-5" />

              {/* Options list */}
              <div className="space-y-2.5">
                {currentNode.options.map((opt, idx) => (
                  <OptionCard
                    key={opt.optionId}
                    option={opt}
                    index={idx}
                    isFirstQuestion={isFirstQuestion}
                    onClick={handleOptionClick}
                  />
                ))}
              </div>

              {/* Mobile: bottom Back link */}
              {canGoBack && (
                <div className="mt-6 pt-4 border-t border-border-light sm:hidden">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-ghost text-sm"
                  >
                    <ChevronLeft size={16} />
                    Back to previous question
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* RESULT node                                                 */}
          {/* ---------------------------------------------------------- */}
          {isResult && currentNode && (
            <div className="space-y-5">
              {/* Result heading */}
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
                  Your recommended form
                </p>
                <h2 className="text-2xl font-extrabold text-text-main">
                  We found your answer!
                </h2>
              </div>

              {/* Main result card */}
              <ResultCard node={currentNode} onStartOver={handleStartOver} />

              {/* Secondary controls */}
              <div className="flex flex-wrap gap-3 justify-center pt-1">
                <button type="button" onClick={handleBack} className="btn-outline text-sm">
                  <ChevronLeft size={16} />
                  Revise last answer
                </button>
                <button type="button" onClick={handleStartOver} className="btn-ghost text-sm">
                  <RotateCcw size={15} />
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Answer trail */}
        {!isResult && (
          <AnswerTrail history={history} nodeMap={nodeMap} />
        )}

        {/* Disclaimer footer */}
        <p className="mt-10 text-center text-xs text-text-muted leading-relaxed max-w-lg mx-auto">
          This tool provides guidance only. For complex tax situations consult a qualified
          Chartered Accountant. Data current as of{' '}
          <span className="font-semibold text-text-main">FY 2025-26 · AY 2026-27</span>.
        </p>
      </div>
    </div>
  )
}
