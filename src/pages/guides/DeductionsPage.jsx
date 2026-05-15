import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ShieldCheck, Heart, GraduationCap, Home, Car, Gift,
  Users, Landmark, MoreHorizontal, ChevronDown, BookOpen,
  AlertTriangle, CheckCircle, FileText, Layers, Star,
  AlertCircle, Info, Coins,
} from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Callout from '../../components/ui/Callout'

/* ── Static JSON imports (Vite requires static paths) ─────────────────────── */
import data80C from '../../../data/deduction-guides/section-80C.json'
import data80CCD from '../../../data/deduction-guides/section-80CCD.json'
import data80D from '../../../data/deduction-guides/section-80D.json'
import data80E from '../../../data/deduction-guides/section-80E.json'
import data80EE from '../../../data/deduction-guides/section-80EE.json'
import data80EEA from '../../../data/deduction-guides/section-80EEA.json'
import data80EEB from '../../../data/deduction-guides/section-80EEB.json'
import data80G from '../../../data/deduction-guides/section-80G.json'
import dataOther from '../../../data/deduction-guides/other-deductions.json'

/* ── Section registry ─────────────────────────────────────────────────────── */
const SECTIONS = {
  '80C': {
    label: '80C — Life Insurance / PPF / ELSS',
    shortLabel: '80C',
    icon: ShieldCheck,
    data: data80C,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  '80CCD': {
    label: '80CCD — NPS Contributions',
    shortLabel: '80CCD',
    icon: Coins,
    data: data80CCD,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  '80D': {
    label: '80D — Health Insurance',
    shortLabel: '80D',
    icon: Heart,
    data: data80D,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  '80E': {
    label: '80E — Education Loan Interest',
    shortLabel: '80E',
    icon: GraduationCap,
    data: data80E,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  '80EE': {
    label: '80EE — Home Loan (2016-17)',
    shortLabel: '80EE',
    icon: Home,
    data: data80EE,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  '80EEA': {
    label: '80EEA — Affordable Housing Loan',
    shortLabel: '80EEA',
    icon: Home,
    data: data80EEA,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  '80EEB': {
    label: '80EEB — Electric Vehicle Loan',
    shortLabel: '80EEB',
    icon: Car,
    data: data80EEB,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  '80G': {
    label: '80G — Donations',
    shortLabel: '80G',
    icon: Gift,
    data: data80G,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  other: {
    label: 'Other Deductions',
    shortLabel: 'Other',
    icon: MoreHorizontal,
    data: dataOther,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
}

const SECTION_KEYS = Object.keys(SECTIONS)

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function BadgeNew() {
  return <span className="badge-new ml-2 align-middle">NEW FY 2025-26</span>
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold text-text-main mb-3 mt-6">
      {Icon && <Icon size={18} className="text-primary flex-shrink-0" />}
      {children}
    </h2>
  )
}

/* ── Regime badge helper ──────────────────────────────────────────────────── */
function RegimeBadge({ regime }) {
  const r = (regime || '').toLowerCase()
  const isOld = r === 'old'
  const isBoth = r === 'both' || r.includes('both')
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        isBoth
          ? 'bg-green-100 text-green-700'
          : isOld
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {isBoth ? 'Both Regimes' : isOld ? 'Old Regime Only' : regime}
    </span>
  )
}

/* ── Eligible Investments / Items ─────────────────────────────────────────── */
function EligibleInvestmentsSection({ investments }) {
  if (!investments?.length) return null
  return (
    <div>
      <SectionHeading icon={Layers}>Eligible Investments / Items</SectionHeading>
      <div className="space-y-3">
        {investments.map((inv, i) => (
          <div
            key={inv.investmentId || i}
            className="card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-text-main text-sm">
                {inv.name}
                {inv.isNewForFY202526 && <BadgeNew />}
              </h3>
              {inv.limit && (
                <span className="text-xs font-medium text-accent flex-shrink-0">
                  {inv.limit}
                </span>
              )}
            </div>
            {inv.notes && (
              <p className="text-text-muted text-sm">{inv.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Conditions / Eligibility ─────────────────────────────────────────────── */
function ConditionsSection({ conditions, eligibleAssessees, notEligible }) {
  const hasEligibility = eligibleAssessees?.length || notEligible?.length
  const hasConditions = conditions?.length
  if (!hasEligibility && !hasConditions) return null
  return (
    <div>
      <SectionHeading icon={CheckCircle}>Eligibility & Conditions</SectionHeading>
      <div className="grid sm:grid-cols-2 gap-3">
        {eligibleAssessees?.length > 0 && (
          <div className="card p-4 border-l-4 border-success">
            <p className="text-xs font-bold text-success uppercase tracking-wide mb-2">
              Who Can Claim
            </p>
            <ul className="space-y-1">
              {eligibleAssessees.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                  <CheckCircle size={13} className="text-success flex-shrink-0 mt-0.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
        {notEligible?.length > 0 && (
          <div className="card p-4 border-l-4 border-error">
            <p className="text-xs font-bold text-error uppercase tracking-wide mb-2">
              Not Eligible
            </p>
            <ul className="space-y-1">
              {notEligible.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                  <AlertCircle size={13} className="text-error flex-shrink-0 mt-0.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {hasConditions && (
        <div className="mt-3 card p-4">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
            Conditions
          </p>
          <ul className="space-y-1.5">
            {conditions.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                <Info size={13} className="text-primary flex-shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ── Documentation Required ───────────────────────────────────────────────── */
function DocumentationSection({ docs }) {
  if (!docs?.length) return null
  return (
    <div>
      <SectionHeading icon={FileText}>Documentation Required</SectionHeading>
      <div className="card p-4">
        <ul className="space-y-1.5">
          {docs.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-main">
              <FileText size={13} className="text-primary flex-shrink-0 mt-0.5" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ── Key Rules ────────────────────────────────────────────────────────────── */
function KeyRulesSection({ rules }) {
  if (!rules?.length) return null
  const newRules = rules.filter((r) => r.isNewForFY202526)
  const regularRules = rules.filter((r) => !r.isNewForFY202526)
  return (
    <div>
      <SectionHeading icon={Landmark}>Key Rules & Legal References</SectionHeading>
      {newRules.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-bold text-accent uppercase tracking-wide mb-2 flex items-center gap-1">
            <Star size={12} /> New for FY 2025-26
          </p>
          {newRules.map((rule) => (
            <div key={rule.ruleId} className="card p-3 border-l-4 border-accent">
              <div className="flex items-start gap-2">
                <BadgeNew />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-main">{rule.rule}</p>
                  <p className="text-xs text-text-muted mt-1">
                    Ref: <span className="data-value">{rule.legalReference}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {regularRules.map((rule, i) => (
          <div key={rule.ruleId || i} className="card p-3">
            <p className="text-sm text-text-main">{rule.rule}</p>
            {rule.legalReference && (
              <p className="text-xs text-text-muted mt-1">
                Ref: <span className="data-value">{rule.legalReference}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Worked Example ───────────────────────────────────────────────────────── */
function WorkedExampleSection({ example }) {
  if (!example) return null
  return (
    <div>
      <SectionHeading icon={BookOpen}>Worked Example</SectionHeading>
      <div className="card p-4">
        <p className="text-sm font-semibold text-primary mb-3">{example.profile}</p>
        {example.deductionClaimed != null && (
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-text-muted">Deduction Claimed:</span>
            <span className="data-value">
              ₹{Number(example.deductionClaimed).toLocaleString('en-IN')}
            </span>
          </div>
        )}
        {example.taxSaving && (
          <div className="text-sm mb-2">
            <span className="text-text-muted">Tax Saving: </span>
            <span className="text-success font-medium">{example.taxSaving}</span>
          </div>
        )}
        {example.note && (
          <Callout variant="info" title="Note">
            {example.note}
          </Callout>
        )}
      </div>
    </div>
  )
}

/* ── Related Sections ─────────────────────────────────────────────────────── */
function RelatedSectionsSection({ related }) {
  if (!related?.length) return null
  return (
    <div>
      <SectionHeading icon={Users}>Related Sections</SectionHeading>
      <div className="card p-4">
        <ul className="space-y-1.5">
          {related.map((r, i) => (
            <li key={i} className="text-sm text-text-muted flex items-start gap-2">
              <span className="text-primary font-bold flex-shrink-0">→</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ── Common Mistakes ──────────────────────────────────────────────────────── */
function CommonMistakesSection({ mistakes }) {
  if (!mistakes?.length) return null
  return (
    <div>
      <SectionHeading icon={AlertTriangle}>Common Mistakes to Avoid</SectionHeading>
      <Callout variant="warning" title="Watch Out">
        <ul className="space-y-1.5 mt-1">
          {mistakes.map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-warning font-bold flex-shrink-0">•</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </Callout>
    </div>
  )
}

/* ── Main Page Component ──────────────────────────────────────────────────── */
export default function DeductionsPage() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Resolve active section: default to 80C
  const activeKey = useMemo(() => {
    if (sectionId && SECTIONS[sectionId]) return sectionId
    return '80C'
  }, [sectionId])

  const activeSection = SECTIONS[activeKey]
  const section = activeSection.data

  function handleSelect(key) {
    setMobileOpen(false)
    navigate(`/deductions/${key}`)
  }

  /* Max limit display helper */
  function formatLimit(limit) {
    if (limit == null) return null
    if (typeof limit === 'number') return `₹${Number(limit).toLocaleString('en-IN')}`
    return String(limit)
  }

  /* ── Sidebar tab item ─────────────────────────────────────────────────── */
  function SidebarItem({ sKey }) {
    const { shortLabel, icon: Icon, color, bg } = SECTIONS[sKey]
    const isActive = sKey === activeKey
    return (
      <button
        onClick={() => handleSelect(sKey)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
          isActive
            ? `${bg} ${color} shadow-sm`
            : 'text-text-muted hover:text-text-main hover:bg-gray-100'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={16} className={isActive ? color : 'text-text-muted'} />
        <span>{shortLabel}</span>
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
        )}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Deduction Guides', to: '/deductions/80C' },
            { label: section.sectionName || activeSection.label },
          ]}
        />

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="section-title mb-0">Chapter VI-A Deductions</h1>
            <span className="badge-new">FY 2025-26</span>
          </div>
          <p className="section-subtitle">
            Comprehensive deduction guides for Assessment Year 2026-27. Available only under the
            old tax regime unless stated otherwise.
          </p>
        </div>

        {/* New-regime callout */}
        <div className="mb-4">
          <Callout variant="warning" title="Old Tax Regime Only">
            Most Chapter VI-A deductions (80C, 80D, 80E, etc.) are{' '}
            <strong>not available</strong> under the new tax regime (Section 115BAC). The only
            exceptions are 80CCD(2) — employer NPS contribution — and 80CCH (Agniveer). Verify
            the regime column for each section.
          </Callout>
        </div>

        {/* Mobile dropdown */}
        <div className="lg:hidden mb-4 relative">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 card px-4 py-3 text-sm font-medium text-text-main"
            aria-expanded={mobileOpen}
          >
            <span className="flex items-center gap-2">
              <activeSection.icon size={16} className={activeSection.color} />
              {activeSection.shortLabel} — {section.sectionName || activeSection.label}
            </span>
            <ChevronDown
              size={16}
              className={`text-text-muted transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {mobileOpen && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 card shadow-lg p-1">
              {SECTION_KEYS.map((key) => (
                <SidebarItem key={key} sKey={key} />
              ))}
            </div>
          )}
        </div>

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card p-2 sticky top-4">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide px-3 py-2">
                Sections
              </p>
              <nav className="space-y-0.5">
                {SECTION_KEYS.map((key) => (
                  <SidebarItem key={key} sKey={key} />
                ))}
              </nav>
            </div>
          </aside>

          {/* Content area */}
          <main className="flex-1 min-w-0 space-y-0">
            {/* Section title card */}
            <div className="card p-5 border-l-4 border-primary mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activeSection.bg} flex-shrink-0`}>
                  <activeSection.icon size={22} className={activeSection.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-text-main">
                      Section {section.sectionId}
                    </h2>
                    <RegimeBadge regime={section.regime} />
                  </div>
                  <p className="text-text-muted text-xs mb-1 font-medium">
                    {section.sectionName}
                  </p>
                  <p className="text-text-muted text-sm mt-1 leading-relaxed">
                    {section.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
                      FY {section.fyApplicable}
                    </span>
                    {section.maxLimit != null && (
                      <span className="text-xs bg-accent/10 text-accent-dark font-medium px-2 py-0.5 rounded">
                        Max: {formatLimit(section.maxLimit)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility & Conditions */}
            <ConditionsSection
              conditions={section.conditions}
              eligibleAssessees={section.eligibleAssessees}
              notEligible={section.notEligible}
            />

            {/* Eligible Investments */}
            <EligibleInvestmentsSection investments={section.eligibleInvestments} />

            {/* Documentation */}
            <DocumentationSection docs={section.documentationRequired} />

            {/* Key Rules */}
            <KeyRulesSection rules={section.keyRules} />

            {/* Worked Example */}
            <WorkedExampleSection example={section.workedExample} />

            {/* Common Mistakes */}
            <CommonMistakesSection mistakes={section.commonMistakes} />

            {/* Related Sections */}
            <RelatedSectionsSection related={section.relatedSections} />

            {/* Footer note */}
            <div className="mt-6">
              <Callout variant="info" title="Disclaimer">
                This guide is for educational purposes based on Income Tax Act provisions as
                applicable to FY 2025-26 (AY 2026-27). Always verify with a qualified tax
                professional before filing. Deduction limits and conditions may change per
                Finance Act amendments.
              </Callout>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
