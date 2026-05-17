import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Briefcase, Home, TrendingUp, Building2, Globe, MoreHorizontal,
  ChevronDown, BookOpen, AlertTriangle, CheckCircle, Info,
  FileText, Layers, List, AlertCircle, Star, DollarSign, Zap,
} from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Callout from '../../components/ui/Callout'

/* ── Static JSON imports (Vite requires static paths) ─────────────────────── */
import salaryData from '../../../data/income-guides/salary.json'
import housePropertyData from '../../../data/income-guides/house-property.json'
import capitalGainsData from '../../../data/income-guides/capital-gains.json'
import businessProfData from '../../../data/income-guides/business-professional.json'
import foreignIncomeData from '../../../data/income-guides/foreign-income.json'
import otherSourcesData from '../../../data/income-guides/other-sources.json'
import taxSlabsData from '../../../data/meta/tax-slabs.json'

/* ── Guide registry ───────────────────────────────────────────────────────── */
const GUIDES = {
  salary: {
    label: 'Salary',
    shortLabel: 'Salary',
    icon: Briefcase,
    data: salaryData,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  'house-property': {
    label: 'House Property',
    shortLabel: 'House Property',
    icon: Home,
    data: housePropertyData,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  'capital-gains': {
    label: 'Capital Gains',
    shortLabel: 'Capital Gains',
    icon: TrendingUp,
    data: capitalGainsData,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  'business-professional': {
    label: 'Business / Professional',
    shortLabel: 'Business/Prof',
    icon: Building2,
    data: businessProfData,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  'foreign-income': {
    label: 'Foreign Income',
    shortLabel: 'Foreign Income',
    icon: Globe,
    data: foreignIncomeData,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  'other-sources': {
    label: 'Other Sources',
    shortLabel: 'Other Sources',
    icon: MoreHorizontal,
    data: otherSourcesData,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
}

const GUIDE_KEYS = Object.keys(GUIDES)

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function BadgeNew() {
  return (
    <span className="badge-new ml-2 align-middle">NEW FY 2025-26</span>
  )
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold text-text-main mb-3 mt-6">
      {Icon && <Icon size={18} className="text-primary flex-shrink-0" />}
      {children}
    </h2>
  )
}

/* ── Income Components Section ────────────────────────────────────────────── */
function IncomeComponentsSection({ components }) {
  if (!components?.length) return null
  return (
    <div>
      <SectionHeading icon={Layers}>Key Income Components</SectionHeading>
      <div className="overflow-x-auto rounded-lg border border-border-light">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-border-light">
              <th className="text-left px-3 py-2.5 font-semibold text-text-main">Component</th>
              <th className="text-left px-3 py-2.5 font-semibold text-text-main">Taxability</th>
              <th className="text-left px-3 py-2.5 font-semibold text-text-main hidden sm:table-cell">Exempt / Rate</th>
              <th className="text-left px-3 py-2.5 font-semibold text-text-main hidden md:table-cell">Section</th>
            </tr>
          </thead>
          <tbody>
            {components.map((comp, i) => (
              <>
                <tr
                  key={comp.componentId}
                  className={`border-b border-border-light hover:bg-gray-50 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-gray-50/40'
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-text-main">
                      {comp.name}
                      {comp.isNewForFY202526 && <BadgeNew />}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5 leading-snug">{comp.description}</div>
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                      comp.isFullyTaxable
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {comp.isFullyTaxable ? 'Fully Taxable' : 'Partially Exempt'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-top text-text-muted hidden sm:table-cell">
                    {comp.exemptAmount && <div className="text-xs">{comp.exemptAmount}</div>}
                    {comp.rate && <div className="text-xs font-medium text-text-main">{comp.rate}</div>}
                    {!comp.exemptAmount && !comp.rate && <span className="text-xs">—</span>}
                  </td>
                  <td className="px-3 py-2.5 align-top hidden md:table-cell">
                    {comp.relevantSection
                      ? <span className="data-value text-xs">{comp.relevantSection}</span>
                      : <span className="text-xs text-text-muted">—</span>}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Slab Table helper ────────────────────────────────────────────────────── */
function SlabTable({ slabs, regime }) {
  if (!slabs?.length) return null
  const fmt = (n) => n == null ? 'Above' : `₹${Number(n).toLocaleString('en-IN')}`
  return (
    <div className="overflow-x-auto rounded border border-border-light mt-3">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className={`border-b border-border-light ${regime === 'new' ? 'bg-green-50' : 'bg-blue-50'}`}>
            <th className="text-left px-3 py-2 font-semibold text-text-main">Income Range</th>
            <th className="text-center px-3 py-2 font-semibold text-text-main">Tax Rate</th>
            <th className="text-right px-3 py-2 font-semibold text-text-main hidden sm:table-cell">Max Tax on Slab</th>
            {regime === 'new' && (
              <th className="text-center px-3 py-2 font-semibold text-text-main hidden md:table-cell">FY 25-26</th>
            )}
          </tr>
        </thead>
        <tbody>
          {slabs.map((slab, i) => (
            <tr
              key={i}
              className={`border-b border-border-light last:border-0 ${
                slab.fy202526Change ? 'bg-accent/5' : i % 2 === 0 ? '' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-3 py-2 text-text-main">
                {slab.to == null
                  ? `Above ${fmt(slab.from - 1)}`
                  : `${fmt(slab.from)} – ${fmt(slab.to)}`}
              </td>
              <td className="px-3 py-2 text-center">
                <span className={`font-semibold ${slab.rate === 0 ? 'text-success' : slab.rate >= 25 ? 'text-error' : 'text-text-main'}`}>
                  {slab.rateLabel}
                </span>
              </td>
              <td className="px-3 py-2 text-right text-text-muted hidden sm:table-cell">
                {slab.taxOnThisSlab != null
                  ? `₹${Number(slab.taxOnThisSlab).toLocaleString('en-IN')}`
                  : slab.rate === 0 ? 'Nil' : '—'}
              </td>
              {regime === 'new' && (
                <td className="px-3 py-2 text-center hidden md:table-cell">
                  {slab.fy202526Change
                    ? <span className="badge-new text-[10px] px-1.5 py-0.5">REVISED</span>
                    : <span className="text-text-muted">—</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Tax Treatment Section ────────────────────────────────────────────────── */
const SLAB_GUIDES = new Set(['salary', 'house-property', 'business-professional', 'other-sources', 'foreign-income'])

function TaxTreatmentSection({ taxTreatment, guideId }) {
  const [activeRegime, setActiveRegime] = useState('new')
  if (!taxTreatment) return null
  const { oldRegime, newRegime, specialRate } = taxTreatment
  const showSlabs = SLAB_GUIDES.has(guideId)

  const newSlabs = taxSlabsData?.regimes?.new?.slabs
  const oldSlabs = taxSlabsData?.regimes?.old?.slabs?.belowAge60

  const rebate = taxSlabsData?.regimes?.new?.rebateU87A
  const cess = taxSlabsData?.regimes?.new?.cess

  function NoteBullets({ text }) {
    if (!text) return null
    const sentences = text.split(/\.\s+/).filter(Boolean)
    if (sentences.length <= 1) return <p className="text-xs text-text-muted leading-relaxed">{text}</p>
    return (
      <ul className="space-y-1 mt-1">
        {sentences.map((s, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-text-muted">
            <span className="mt-1 w-1 h-1 rounded-full bg-text-muted flex-shrink-0" />
            <span>{s.endsWith('.') ? s : s + '.'}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <SectionHeading icon={DollarSign}>Tax Treatment</SectionHeading>

      {/* Special rates callout (capital gains, etc.) */}
      {specialRate && (
        <div className="mb-3 flex items-start gap-2 bg-accent/10 border border-accent/30 rounded-lg px-3 py-2.5">
          <Zap size={14} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wide">Special Flat Rates Apply</span>
            <p className="text-xs text-text-main mt-0.5">{specialRate}</p>
          </div>
        </div>
      )}

      {/* Regime tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3 w-fit">
        <button
          onClick={() => setActiveRegime('new')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeRegime === 'new'
              ? 'bg-white text-success shadow-sm border border-green-200'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          New Regime <span className="font-normal opacity-70">(Default)</span>
        </button>
        <button
          onClick={() => setActiveRegime('old')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeRegime === 'old'
              ? 'bg-white text-primary shadow-sm border border-blue-200'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Old Regime
        </button>
      </div>

      {/* Active regime panel */}
      {activeRegime === 'new' && newRegime && (
        <div className="card border-l-4 border-success p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-success uppercase tracking-wide">New Tax Regime (Default — u/s 115BAC)</span>
            <span className="badge-new text-[10px] px-1.5 py-0.5">FY 2025-26</span>
          </div>
          {showSlabs ? (
            <>
              <SlabTable slabs={newSlabs} regime="new" />
              {rebate && (
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                  <div className="text-xs text-text-muted">
                    <span className="font-medium text-text-main">Rebate u/s 87A:</span>{' '}
                    ₹{Number(rebate.amount).toLocaleString('en-IN')} — zero tax up to ₹{Number(rebate.effectiveZeroTaxLimit).toLocaleString('en-IN')} income
                  </div>
                  {cess && (
                    <div className="text-xs text-text-muted">
                      <span className="font-medium text-text-main">Health & Education Cess:</span>{' '}
                      {cess.rate}% on tax
                    </div>
                  )}
                </div>
              )}
              {newRegime.notes && (
                <div className="mt-3 border-t border-border-light pt-2">
                  <NoteBullets text={newRegime.notes} />
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-text-main font-medium mb-1">{newRegime.rate}</p>
              {newRegime.notes && <NoteBullets text={newRegime.notes} />}
            </>
          )}
        </div>
      )}

      {activeRegime === 'old' && oldRegime && (
        <div className="card border-l-4 border-primary p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Old Tax Regime (Opt-in required)</span>
          </div>
          {showSlabs ? (
            <>
              <SlabTable slabs={oldSlabs} regime="old" />
              <p className="text-xs text-text-muted mt-2">
                * Senior citizens (60–80 yrs): nil slab up to ₹3,00,000. Super seniors (80+): nil slab up to ₹5,00,000.
              </p>
              {oldRegime.notes && (
                <div className="mt-3 border-t border-border-light pt-2">
                  <NoteBullets text={oldRegime.notes} />
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-text-main font-medium mb-1">{oldRegime.rate}</p>
              {oldRegime.notes && <NoteBullets text={oldRegime.notes} />}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Deductions Available Section ─────────────────────────────────────────── */
function DeductionsSection({ deductions }) {
  if (!deductions?.length) return null
  return (
    <div>
      <SectionHeading icon={CheckCircle}>Deductions Available</SectionHeading>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-border-light">
              <th className="text-left px-3 py-2 font-semibold text-text-main">Section</th>
              <th className="text-left px-3 py-2 font-semibold text-text-main">Deduction</th>
              <th className="text-left px-3 py-2 font-semibold text-text-main">Limit</th>
              <th className="text-left px-3 py-2 font-semibold text-text-main">Regime</th>
            </tr>
          </thead>
          <tbody>
            {deductions.map((d, i) => (
              <tr
                key={d.sectionId || i}
                className="border-b border-border-light hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-2">
                  <span className="data-value">{d.sectionId}</span>
                </td>
                <td className="px-3 py-2 text-text-main font-medium">{d.name}</td>
                <td className="px-3 py-2 text-text-muted">{d.limit}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      d.regime === 'both'
                        ? 'bg-green-100 text-green-700'
                        : d.regime === 'old'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {d.regime === 'both' ? 'Both' : d.regime === 'old' ? 'Old only' : d.regime}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Key Rules Section ────────────────────────────────────────────────────── */
function KeyRulesSection({ rules }) {
  if (!rules?.length) return null
  const newRules = rules.filter((r) => r.isNewForFY202526)
  const regularRules = rules.filter((r) => !r.isNewForFY202526)
  return (
    <div>
      <SectionHeading icon={FileText}>Key Rules & Legal References</SectionHeading>
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

/* ── Worked Example Section ───────────────────────────────────────────────── */
function WorkedExampleSection({ example }) {
  if (!example) return null
  return (
    <div>
      <SectionHeading icon={BookOpen}>Worked Example</SectionHeading>
      <div className="card p-4">
        <p className="text-sm font-semibold text-primary mb-3">{example.profile}</p>
        {example.note && (
          <Callout variant="info" title="Note">
            {example.note}
          </Callout>
        )}
        {example.deductionClaimed != null && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-text-muted">Deduction Claimed:</span>
            <span className="data-value">
              ₹{Number(example.deductionClaimed).toLocaleString('en-IN')}
            </span>
          </div>
        )}
        {example.taxSaving && (
          <div className="mt-2 text-sm">
            <span className="text-text-muted">Tax Saving: </span>
            <span className="text-success font-medium">{example.taxSaving}</span>
          </div>
        )}
        {example.computation && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {example.computation.oldRegime && (
              <div className="rounded-lg border border-blue-200 overflow-hidden">
                <div className="bg-blue-100 px-3 py-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">Old Regime</p>
                </div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {Object.entries(example.computation.oldRegime)
                      .filter(([k]) => k !== 'note' && k !== 'HRAExemptionComputation')
                      .map(([k, v], i, arr) => {
                        const isTax = /tax|liability|payable/i.test(k)
                        return (
                          <tr
                            key={k}
                            className={`border-t border-blue-100 ${isTax ? 'bg-blue-50 font-semibold' : ''}`}
                          >
                            <td className="px-3 py-1.5 text-text-muted capitalize">
                              {k.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="px-3 py-1.5 text-right text-text-main font-medium">
                              {typeof v === 'number'
                                ? `₹${v.toLocaleString('en-IN')}`
                                : String(v)}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
                {example.computation.oldRegime.note && (
                  <p className="px-3 py-2 text-xs text-text-muted italic border-t border-blue-100 bg-blue-50">
                    {example.computation.oldRegime.note}
                  </p>
                )}
              </div>
            )}
            {example.computation.newRegime && (
              <div className="rounded-lg border border-green-200 overflow-hidden">
                <div className="bg-green-100 px-3 py-2">
                  <p className="text-xs font-bold text-success uppercase tracking-wide">New Regime (Default)</p>
                </div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {Object.entries(example.computation.newRegime)
                      .filter(([k]) => k !== 'note')
                      .map(([k, v]) => {
                        const isTax = /tax|liability|payable/i.test(k)
                        return (
                          <tr
                            key={k}
                            className={`border-t border-green-100 ${isTax ? 'bg-green-50 font-semibold' : ''}`}
                          >
                            <td className="px-3 py-1.5 text-text-muted capitalize">
                              {k.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="px-3 py-1.5 text-right text-text-main font-medium">
                              {typeof v === 'number'
                                ? `₹${v.toLocaleString('en-IN')}`
                                : String(v)}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
                {example.computation.newRegime.note && (
                  <p className="px-3 py-2 text-xs text-text-muted italic border-t border-green-100 bg-green-50">
                    {example.computation.newRegime.note}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Common Mistakes Section ──────────────────────────────────────────────── */
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

/* ── Audit Triggers Section ───────────────────────────────────────────────── */
function AuditTriggersSection({ triggers }) {
  if (!triggers?.length) return null
  return (
    <div>
      <SectionHeading icon={AlertCircle}>Audit Risk Triggers</SectionHeading>
      <div className="card p-4 border-l-4 border-error">
        <ul className="space-y-1.5">
          {triggers.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-main">
              <AlertCircle size={14} className="text-error flex-shrink-0 mt-0.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ── Relevant ITR Forms ────────────────────────────────────────────────────── */
function RelevantForms({ forms, schedules }) {
  if (!forms?.length && !schedules?.length) return null
  return (
    <div className="card p-4">
      {forms?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
            Applicable ITR Forms
          </p>
          <div className="flex flex-wrap gap-2">
            {forms.map((f) => (
              <span
                key={f}
                className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
      {schedules?.length > 0 && (
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
            Relevant Schedules
          </p>
          <div className="flex flex-wrap gap-2">
            {schedules.map((s) => (
              <span
                key={s}
                className="bg-gray-100 text-text-muted text-xs font-mono px-2 py-1 rounded"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Page Component ──────────────────────────────────────────────────── */
export default function IncomePage() {
  const { guideId } = useParams()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Resolve active guide: default to salary
  const activeKey = useMemo(() => {
    if (guideId && GUIDES[guideId]) return guideId
    return 'salary'
  }, [guideId])

  const activeGuide = GUIDES[activeKey]
  const guide = activeGuide.data

  function handleSelect(key) {
    setMobileOpen(false)
    navigate(`/income/${key}`)
  }

  /* ── Sidebar tab item ─────────────────────────────────────────────────── */
  function SidebarItem({ guideKey }) {
    const { label, icon: Icon, color, bg } = GUIDES[guideKey]
    const isActive = guideKey === activeKey
    return (
      <button
        onClick={() => handleSelect(guideKey)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
          isActive
            ? `${bg} ${color} shadow-sm`
            : 'text-text-muted hover:text-text-main hover:bg-gray-100'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={16} className={isActive ? color : 'text-text-muted'} />
        <span>{label}</span>
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
            { label: 'Income Guides', to: '/income/salary' },
            { label: guide.incomeType || activeGuide.label },
          ]}
        />

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="section-title mb-0">Income Tax Guides</h1>
            <span className="badge-new">FY 2025-26</span>
          </div>
          <p className="section-subtitle">
            Detailed income computation guides for Assessment Year 2026-27.
          </p>
        </div>

        {/* Mobile dropdown */}
        <div className="lg:hidden mb-4 relative">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 card px-4 py-3 text-sm font-medium text-text-main"
            aria-expanded={mobileOpen}
          >
            <span className="flex items-center gap-2">
              <activeGuide.icon size={16} className={activeGuide.color} />
              {activeGuide.label}
            </span>
            <ChevronDown
              size={16}
              className={`text-text-muted transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {mobileOpen && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 card shadow-lg p-1">
              {GUIDE_KEYS.map((key) => (
                <SidebarItem key={key} guideKey={key} />
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
                Income Types
              </p>
              <nav className="space-y-0.5">
                {GUIDE_KEYS.map((key) => (
                  <SidebarItem key={key} guideKey={key} />
                ))}
              </nav>
            </div>
          </aside>

          {/* Content area */}
          <main className="flex-1 min-w-0 space-y-0">
            {/* Guide title card */}
            <div className={`card p-5 border-l-4 border-primary mb-4`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activeGuide.bg} flex-shrink-0`}>
                  <activeGuide.icon size={22} className={activeGuide.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-text-main">
                    {guide.incomeType || activeGuide.label}
                  </h2>
                  <p className="text-text-muted text-sm mt-1 leading-relaxed">
                    {guide.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
                      FY {guide.fyApplicable}
                    </span>
                    {guide.regime && (
                      <span className="text-xs bg-warning/10 text-warning font-medium px-2 py-0.5 rounded">
                        Regime: {guide.regime}
                      </span>
                    )}
                    {guide.maxLimit && (
                      <span className="text-xs bg-success/10 text-success font-medium px-2 py-0.5 rounded">
                        Max: ₹{Number(guide.maxLimit).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Relevant forms & schedules */}
            <RelevantForms
              forms={guide.relevantITRForms}
              schedules={guide.relevantSchedules}
            />

            {/* Tax Treatment */}
            <TaxTreatmentSection taxTreatment={guide.taxTreatment} guideId={activeKey} />

            {/* Income Components */}
            <IncomeComponentsSection components={guide.incomeComponents} />

            {/* Deductions available (salary guide) */}
            <DeductionsSection deductions={guide.deductionsAvailable} />

            {/* Key Rules */}
            <KeyRulesSection rules={guide.keyRules} />

            {/* Worked Example */}
            <WorkedExampleSection example={guide.workedExample} />

            {/* Common Mistakes */}
            <CommonMistakesSection mistakes={guide.commonMistakes} />

            {/* Audit Triggers */}
            <AuditTriggersSection triggers={guide.auditTriggers} />

            {/* Footer note */}
            <div className="mt-6">
              <Callout variant="info" title="Disclaimer">
                This guide is for educational purposes based on Income Tax Act provisions as
                applicable to FY 2025-26 (AY 2026-27). Always verify with a qualified tax
                professional before filing.
              </Callout>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
