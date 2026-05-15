import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2, Clock, AlertTriangle, ChevronRight, ChevronDown,
  FileText, RefreshCw, AlertCircle, Scale, Calendar, Bell,
  ReceiptText, Wrench, Ban, Info, ExternalLink, Lock
} from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Callout from '../../components/ui/Callout'
import { AccordionItem } from '../../components/ui/Accordion'

// ── Static JSON imports ───────────────────────────────────────────────────────
import eVerification from '../../../data/procedures/e-verification.json'
import processingAssessment from '../../../data/procedures/processing-assessment.json'
import defectNotices from '../../../data/procedures/defect-notices.json'
import revisedReturn from '../../../data/procedures/revised-return.json'
import belatedReturn from '../../../data/procedures/belated-return.json'
import interestPenalties from '../../../data/procedures/interest-penalties.json'
import noticeResponse from '../../../data/procedures/notice-response.json'
import refundProcessing from '../../../data/procedures/refund-processing.json'
import rectification from '../../../data/procedures/rectification.json'

// ── Procedure registry ────────────────────────────────────────────────────────
const PROCEDURES = {
  'e-verification': {
    data: eVerification,
    icon: CheckCircle2,
    iconColor: 'text-success',
    label: 'E-Verification',
  },
  'processing-assessment': {
    data: processingAssessment,
    icon: RefreshCw,
    iconColor: 'text-primary',
    label: 'Processing & Assessment',
  },
  'defect-notices': {
    data: defectNotices,
    icon: AlertCircle,
    iconColor: 'text-warning',
    label: 'Defect Notices',
  },
  'revised-return': {
    data: revisedReturn,
    icon: FileText,
    iconColor: 'text-primary',
    label: 'Revised Return',
  },
  'belated-return': {
    data: belatedReturn,
    icon: Clock,
    iconColor: 'text-warning',
    label: 'Belated Return',
  },
  'interest-penalties': {
    data: interestPenalties,
    icon: Scale,
    iconColor: 'text-error',
    label: 'Interest & Penalties',
  },
  'notice-response': {
    data: noticeResponse,
    icon: Bell,
    iconColor: 'text-warning',
    label: 'Notice Response',
  },
  'refund-processing': {
    data: refundProcessing,
    icon: ReceiptText,
    iconColor: 'text-success',
    label: 'Refund Processing',
  },
  rectification: {
    data: rectification,
    icon: Wrench,
    iconColor: 'text-primary',
    label: 'Rectification',
  },
}

// ── Sequential Accordion for steps ───────────────────────────────────────────
function StepsAccordion({ steps }) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!steps || steps.length === 0) return null

  return (
    <div className="space-y-2">
      {steps.map((step, idx) => {
        const isOpen = openIndex === idx
        const isDone = idx < openIndex
        return (
          <div
            key={step.stepId || idx}
            className={`border rounded-xl overflow-hidden transition-all ${
              isOpen
                ? 'border-primary shadow-sm'
                : isDone
                ? 'border-success/50 bg-green-50/30'
                : 'border-border-light'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                isOpen ? 'bg-primary/5' : isDone ? 'bg-green-50/40' : 'bg-white hover:bg-gray-50'
              }`}
              aria-expanded={isOpen}
            >
              {/* Step number badge */}
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  isDone
                    ? 'bg-success text-white'
                    : isOpen
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-text-muted'
                }`}
              >
                {isDone ? <CheckCircle2 size={14} /> : idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-main text-sm sm:text-base">
                  {step.stepName}
                </div>
                {step.deadline && !isOpen && (
                  <div className="text-xs text-warning font-medium mt-0.5 flex items-center gap-1">
                    <Clock size={11} />
                    {step.deadline}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {step.isOnline && (
                  <span className="hidden sm:inline text-xs bg-blue-100 text-primary px-2 py-0.5 rounded-full font-medium">
                    Online
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border-light bg-white p-4 space-y-3">
                <p className="text-sm text-text-main leading-relaxed">{step.description}</p>

                <div className="flex flex-wrap gap-3">
                  {step.deadline && (
                    <div className="flex items-center gap-1.5 bg-orange-50 border border-warning/30 rounded-lg px-3 py-1.5">
                      <Clock size={13} className="text-warning" />
                      <span className="text-xs font-semibold text-orange-800">
                        Deadline: {step.deadline}
                      </span>
                    </div>
                  )}
                  {step.legalReference && (
                    <div className="flex items-center gap-1.5 bg-blue-50 border border-primary/20 rounded-lg px-3 py-1.5">
                      <Scale size={13} className="text-primary" />
                      <span className="text-xs font-medium text-blue-800">{step.legalReference}</span>
                    </div>
                  )}
                </div>

                {/* Navigation buttons */}
                <div className="flex gap-2 pt-1">
                  {idx > 0 && (
                    <button
                      onClick={() => setOpenIndex(idx - 1)}
                      className="btn-ghost text-xs px-3 py-1.5"
                    >
                      ← Previous
                    </button>
                  )}
                  {idx < steps.length - 1 && (
                    <button
                      onClick={() => setOpenIndex(idx + 1)}
                      className="btn-primary text-xs px-3 py-1.5 ml-auto"
                    >
                      Next Step →
                    </button>
                  )}
                  {idx === steps.length - 1 && (
                    <span className="ml-auto flex items-center gap-1.5 text-success text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      All steps complete
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Interest & Penalties special renderer ─────────────────────────────────────
function InterestPenaltiesContent({ data }) {
  return (
    <div className="space-y-6">
      {/* Interest provisions */}
      {data.interestProvisions && (
        <section>
          <h3 className="section-title mb-3">Interest Provisions</h3>
          <div className="space-y-3">
            {data.interestProvisions.map((item) => (
              <div key={item.section} className="card p-4 border-l-4 border-primary">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded mr-2">
                      Sec {item.section}
                    </span>
                    <span className="font-semibold text-text-main">{item.name}</span>
                  </div>
                  <span className="data-value text-primary">{item.rate}</span>
                </div>
                <div className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
                  {item.from && (
                    <div>
                      <span className="text-text-muted text-xs uppercase font-semibold">From</span>
                      <p className="text-text-main">{item.from}</p>
                    </div>
                  )}
                  {item.to && (
                    <div>
                      <span className="text-text-muted text-xs uppercase font-semibold">To</span>
                      <p className="text-text-main">{item.to}</p>
                    </div>
                  )}
                  {item.base && (
                    <div className="sm:col-span-2">
                      <span className="text-text-muted text-xs uppercase font-semibold">Base</span>
                      <p className="text-text-main">{item.base}</p>
                    </div>
                  )}
                  {item.notes && (
                    <div className="sm:col-span-2">
                      <span className="text-text-muted text-xs uppercase font-semibold">Note</span>
                      <p className="text-text-main">{item.notes}</p>
                    </div>
                  )}
                </div>
                {/* 234C installment schedule */}
                {item.installmentSchedule && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-primary/5">
                          <th className="text-left p-2 font-semibold text-text-main">Due Date</th>
                          <th className="text-left p-2 font-semibold text-text-main">Cumulative %</th>
                          <th className="text-left p-2 font-semibold text-text-main">Interest Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.installmentSchedule.map((inst, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2 font-medium text-text-main">{inst.dueDate}</td>
                            <td className="p-2 text-primary font-bold">{inst.cumulativePercentage}</td>
                            <td className="p-2 text-text-muted">{inst.interestPeriod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fees & Penalties */}
      {data.feeAndPenalties && (
        <section>
          <h3 className="section-title mb-3">Fees &amp; Penalties</h3>
          <div className="space-y-3">
            {data.feeAndPenalties.map((item) => (
              <div key={item.section} className="card p-4 border-l-4 border-warning">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-xs font-bold bg-orange-100 text-warning px-2 py-0.5 rounded mr-2">
                      Sec {item.section}
                    </span>
                    <span className="font-semibold text-text-main">{item.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-error">
                    {item.nature}
                  </span>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  {item.amount && (
                    <p>
                      <span className="text-text-muted font-semibold">Amount:</span>{' '}
                      <span className="text-text-main">{item.amount}</span>
                    </p>
                  )}
                  {item.underReportingPenalty && (
                    <p>
                      <span className="text-text-muted font-semibold">Under-reporting:</span>{' '}
                      <span className="text-text-main">{item.underReportingPenalty}</span>
                    </p>
                  )}
                  {item.misreportingPenalty && (
                    <p>
                      <span className="text-text-muted font-semibold">Misreporting:</span>{' '}
                      <span className="text-text-main">{item.misreportingPenalty}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── Generic procedure content ─────────────────────────────────────────────────
function ProcedureContent({ data, procedureId }) {
  if (!data) return null

  // Special renderer for interest-penalties
  if (procedureId === 'interest-penalties') {
    return (
      <div className="space-y-6">
        <ProcedureOverview data={data} />
        <InterestPenaltiesContent data={data} />
        {data.commonMistakes && <CommonMistakes mistakes={data.commonMistakes} />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProcedureOverview data={data} />

      {/* Steps */}
      {data.steps && data.steps.length > 0 && (
        <section>
          <h3 className="section-title mb-4">
            Step-by-Step Guide
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({data.steps.length} steps)
            </span>
          </h3>
          <StepsAccordion steps={data.steps} />
        </section>
      )}

      {/* Eligibility / special fields */}
      {data.eligibility && (
        <section>
          <h3 className="section-title mb-3">Eligibility Conditions</h3>
          <ul className="space-y-2">
            {data.eligibility.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                <CheckCircle2 size={15} className="text-success flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Alternatives */}
      {data.alternatives && data.alternatives.length > 0 && (
        <section>
          <h3 className="section-title mb-3">Alternatives</h3>
          <div className="space-y-3">
            {data.alternatives.map((alt, i) => (
              <div key={i} className="card p-4">
                <div className="font-semibold text-text-main mb-1">{alt.method}</div>
                <p className="text-sm text-text-muted mb-2">{alt.description}</p>
                {alt.applicableTo && (
                  <p className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {alt.applicableTo}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Common revision reasons */}
      {data.commonRevisionsReason && (
        <section>
          <h3 className="section-title mb-3">Common Reasons to Revise</h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {data.commonRevisionsReason.map((reason, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-text-main bg-blue-50/60 px-3 py-2 rounded-lg"
              >
                <Info size={13} className="text-primary flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.commonMistakes && <CommonMistakes mistakes={data.commonMistakes} />}
      {data.consequences && <Consequences items={data.consequences} />}
    </div>
  )
}

function ProcedureOverview({ data }) {
  return (
    <div className="space-y-4">
      {/* Description */}
      <p className="text-text-main leading-relaxed">{data.description}</p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3">
        {data.timeline && (
          <div className="flex items-start gap-2 bg-orange-50 border border-warning/30 rounded-lg px-3 py-2">
            <Clock size={15} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-orange-800 uppercase tracking-wide">Timeline</div>
              <div className="text-sm text-orange-900 font-medium">{data.timeline}</div>
            </div>
          </div>
        )}
        {data.legalReference && (
          <div className="flex items-start gap-2 bg-blue-50 border border-primary/20 rounded-lg px-3 py-2">
            <Scale size={15} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Legal Reference</div>
              <div className="text-sm text-blue-900">{data.legalReference}</div>
            </div>
          </div>
        )}
      </div>

      {/* Applicable forms */}
      {data.applicableForms && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wide">
            Applicable Forms:
          </span>
          {data.applicableForms.map((form) => (
            <span
              key={form}
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded font-semibold"
            >
              {form}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function CommonMistakes({ mistakes }) {
  if (!mistakes || mistakes.length === 0) return null
  return (
    <section>
      <h3 className="section-title mb-3">Common Mistakes to Avoid</h3>
      <div className="space-y-2">
        {mistakes.map((mistake, i) => (
          <div
            key={i}
            className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"
          >
            <Ban size={14} className="text-error flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-900">{mistake}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Consequences({ items }) {
  if (!items || items.length === 0) return null
  return (
    <section>
      <Callout variant="error" title="Consequences of Non-Compliance">
        <ul className="space-y-1 mt-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </Callout>
    </section>
  )
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function ProceduresPage() {
  const { procedureId } = useParams()
  const navigate = useNavigate()
  const activeProcedureId = procedureId || 'e-verification'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeEntry = PROCEDURES[activeProcedureId]
  const activeData = activeEntry?.data || null

  // Navigate to default if unknown procedureId
  useEffect(() => {
    if (procedureId && !PROCEDURES[procedureId]) {
      navigate('/procedures/e-verification', { replace: true })
    }
  }, [procedureId, navigate])

  const SIDEBAR_ITEMS = Object.entries(PROCEDURES).map(([id, entry]) => ({
    id,
    label: entry.label,
    Icon: entry.icon,
    iconColor: entry.iconColor,
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Procedures', to: '/procedures' },
            { label: activeEntry?.label || activeProcedureId },
          ]}
        />

        {/* Mobile sidebar toggle */}
        <button
          className="sm:hidden mb-4 btn-ghost flex items-center gap-2 text-sm"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          <FileText size={16} />
          {sidebarOpen ? 'Hide Procedures' : 'Browse Procedures'}
          <ChevronDown
            size={14}
            className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div className="flex gap-6">
          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } sm:block w-full sm:w-64 flex-shrink-0`}
          >
            <div className="card p-3 sticky top-4">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider px-2 py-2 mb-1">
                Post-Filing Procedures
              </div>
              <nav className="space-y-0.5">
                {SIDEBAR_ITEMS.map(({ id, label, Icon, iconColor }) => {
                  const isActive = id === activeProcedureId
                  return (
                    <Link
                      key={id}
                      to={`/procedures/${id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-primary text-white font-semibold shadow-sm'
                          : 'text-text-main hover:bg-gray-100 hover:text-primary'
                      }`}
                    >
                      <Icon
                        size={15}
                        className={isActive ? 'text-white' : iconColor}
                      />
                      <span className="leading-tight">{label}</span>
                      {isActive && <ChevronRight size={13} className="ml-auto" />}
                    </Link>
                  )
                })}
              </nav>

              {/* FY badge */}
              <div className="mt-4 mx-2 py-2 px-3 bg-accent/10 border border-accent/30 rounded-lg text-center">
                <div className="text-xs font-bold text-accent">FY 2025-26</div>
                <div className="text-xs text-text-muted">AY 2026-27</div>
              </div>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {!activeData ? (
              <div className="card p-8 text-center">
                <AlertCircle size={40} className="text-warning mx-auto mb-3" />
                <h2 className="text-xl font-bold text-text-main mb-2">Procedure Not Found</h2>
                <p className="text-text-muted mb-4">
                  The requested procedure could not be loaded.
                </p>
                <Link to="/procedures/e-verification" className="btn-primary">
                  Go to E-Verification
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Page header */}
                <div className="card p-5 border-b-4 border-primary">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {activeEntry && (
                        <activeEntry.icon
                          size={24}
                          className={activeEntry.iconColor}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-text-main leading-tight">
                          {activeData.procedureName}
                        </h1>
                        <span className="badge-new">FY 2025-26</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{activeData.procedureId}</span>
                        <span>·</span>
                        <span>AY 2026-27</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deadline warning callout (prominent) */}
                {activeData.timeline && (
                  <Callout variant="warning" title="Important Timeline / Deadline">
                    {activeData.timeline}
                    {activeData.legalReference && (
                      <span className="block mt-1 text-xs opacity-80">
                        Legal Reference: {activeData.legalReference}
                      </span>
                    )}
                  </Callout>
                )}

                {/* Main procedure content */}
                <div className="card p-5">
                  <ProcedureContent
                    data={activeData}
                    procedureId={activeProcedureId}
                  />
                </div>

                {/* Navigation between procedures */}
                <div className="flex gap-3">
                  {(() => {
                    const keys = Object.keys(PROCEDURES)
                    const currIdx = keys.indexOf(activeProcedureId)
                    const prev = currIdx > 0 ? keys[currIdx - 1] : null
                    const next = currIdx < keys.length - 1 ? keys[currIdx + 1] : null
                    return (
                      <>
                        {prev && (
                          <Link
                            to={`/procedures/${prev}`}
                            className="btn-ghost flex items-center gap-1.5 text-sm"
                          >
                            ← {PROCEDURES[prev].label}
                          </Link>
                        )}
                        {next && (
                          <Link
                            to={`/procedures/${next}`}
                            className="btn-primary flex items-center gap-1.5 text-sm ml-auto"
                          >
                            {PROCEDURES[next].label} →
                          </Link>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
