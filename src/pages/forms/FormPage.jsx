import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, Info,
  FileText, List, BookOpen, Flag, ChevronRight, User,
  Building, Layers, Shield, TrendingUp, Calculator, Star,
  ExternalLink, Clock, AlertCircle
} from 'lucide-react'
import Tabs from '../../components/ui/Tabs'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { AccordionItem } from '../../components/ui/Accordion'
import Callout from '../../components/ui/Callout'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatINR(amount) {
  if (amount == null) return '—'
  const abs = Math.abs(amount)
  if (abs >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (abs >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

function NewBadge() {
  return <span className="badge-new ml-2">NEW FY 25-26</span>
}

function SeverityBadge({ severity }) {
  const map = {
    critical: 'badge-critical',
    high: 'badge-warning',
    medium: 'bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase',
  }
  return <span className={map[severity] || 'badge-warning'}>{severity}</span>
}

function RegimePill({ regime }) {
  if (regime === 'new')
    return (
      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
        New Regime
      </span>
    )
  return (
    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      Old Regime
    </span>
  )
}

// ─── skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

function PageSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-5 w-full max-w-2xl" />
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    </div>
  )
}

// ─── tax computation table ───────────────────────────────────────────────────

function TaxComputationTable({ taxComp }) {
  if (!taxComp) return null
  const {
    regime, grossTotalIncome, deductions, taxableIncome,
    taxBreakdown = [], totalBaseTax, surcharge, cess,
    grossTaxLiability, rebate87A, rebate87AApplicable,
    netTaxAfterRebate, tdsCredited, advanceTaxPaid,
    netPayableOrRefund, payableOrRefundLabel,
    basicExemptionLimit
  } = taxComp

  const isRefund = netPayableOrRefund < 0

  return (
    <div className="overflow-x-auto rounded-xl border border-border-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-white">
            <th className="text-left px-4 py-3 font-semibold">Particulars</th>
            <th className="text-right px-4 py-3 font-semibold">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {/* Income section */}
          <tr className="bg-gray-50">
            <td colSpan={2} className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wide">
              Income Computation
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2.5 text-text-main">Gross Total Income</td>
            <td className="px-4 py-2.5 text-right font-mono">{formatINR(grossTotalIncome)}</td>
          </tr>
          {deductions > 0 && (
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2.5 text-text-main">Less: Deductions (Chapter VI-A)</td>
              <td className="px-4 py-2.5 text-right font-mono text-success">({formatINR(deductions)})</td>
            </tr>
          )}
          <tr className="bg-primary/5 font-semibold">
            <td className="px-4 py-2.5 text-text-main">Taxable Income</td>
            <td className="px-4 py-2.5 text-right font-mono text-primary">{formatINR(taxableIncome)}</td>
          </tr>

          {/* Slab breakdown */}
          {taxBreakdown.length > 0 && (
            <>
              <tr className="bg-gray-50">
                <td colSpan={2} className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wide">
                  Tax Slab Breakdown — {regime === 'new' ? 'New Regime' : 'Old Regime'}
                  {basicExemptionLimit && (
                    <span className="ml-2 normal-case font-normal">(Basic exemption: {formatINR(basicExemptionLimit)})</span>
                  )}
                </td>
              </tr>
              {taxBreakdown.map((slab, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-text-muted">
                    {formatINR(slab.slabFrom)} – {formatINR(slab.slabTo)}
                    <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                      @{slab.rate}%
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{formatINR(slab.taxAmount)}</td>
                </tr>
              ))}
            </>
          )}

          {/* Tax totals */}
          <tr className="bg-gray-50">
            <td colSpan={2} className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wide">
              Tax Liability
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2.5 text-text-main">Total Tax (before surcharge & cess)</td>
            <td className="px-4 py-2.5 text-right font-mono">{formatINR(totalBaseTax)}</td>
          </tr>
          {surcharge > 0 && (
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2.5 text-text-main">Surcharge</td>
              <td className="px-4 py-2.5 text-right font-mono">{formatINR(surcharge)}</td>
            </tr>
          )}
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2.5 text-text-main">Health & Education Cess (4%)</td>
            <td className="px-4 py-2.5 text-right font-mono">{formatINR(cess)}</td>
          </tr>
          <tr className="font-semibold hover:bg-gray-50">
            <td className="px-4 py-2.5 text-text-main">Gross Tax Liability</td>
            <td className="px-4 py-2.5 text-right font-mono">{formatINR(grossTaxLiability)}</td>
          </tr>
          {rebate87A > 0 && (
            <tr className="hover:bg-gray-50 text-success">
              <td className="px-4 py-2.5">
                Less: Rebate u/s 87A
                {rebate87AApplicable && <span className="ml-1 text-xs text-success">(full rebate applicable)</span>}
              </td>
              <td className="px-4 py-2.5 text-right font-mono">({formatINR(rebate87A)})</td>
            </tr>
          )}
          <tr className="bg-primary/10 font-bold">
            <td className="px-4 py-2.5 text-text-main">Net Tax After Rebate</td>
            <td className="px-4 py-2.5 text-right font-mono text-primary">{formatINR(netTaxAfterRebate)}</td>
          </tr>

          {/* Credits */}
          <tr className="bg-gray-50">
            <td colSpan={2} className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wide">
              Tax Credits
            </td>
          </tr>
          {tdsCredited > 0 && (
            <tr className="hover:bg-gray-50 text-success">
              <td className="px-4 py-2.5">Less: TDS / TCS Credited</td>
              <td className="px-4 py-2.5 text-right font-mono">({formatINR(tdsCredited)})</td>
            </tr>
          )}
          {advanceTaxPaid > 0 && (
            <tr className="hover:bg-gray-50 text-success">
              <td className="px-4 py-2.5">Less: Advance Tax Paid</td>
              <td className="px-4 py-2.5 text-right font-mono">({formatINR(advanceTaxPaid)})</td>
            </tr>
          )}
          <tr className={`font-bold border-t-2 ${isRefund ? 'bg-green-50 text-success' : 'bg-red-50 text-error'}`}>
            <td className="px-4 py-3 text-base">{isRefund ? 'Refund Due' : 'Tax Payable'}</td>
            <td className="px-4 py-3 text-right font-mono text-base">
              {payableOrRefundLabel || formatINR(Math.abs(netPayableOrRefund))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── tab panels ─────────────────────────────────────────────────────────────

function OverviewTab({ data }) {
  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-extrabold text-primary">{data.formId}</h2>
              {data.popularName && (
                <span className="bg-accent/20 text-accent-dark font-bold px-3 py-1 rounded-full text-sm border border-accent/40">
                  "{data.popularName}"
                </span>
              )}
            </div>
            <p className="text-text-muted text-sm">
              FY {data.fyApplicable} &nbsp;|&nbsp; AY {data.ayApplicable} &nbsp;|&nbsp; {data.legalReference}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.mandatoryEfiling && (
              <span className="badge-success flex items-center gap-1">
                <CheckCircle size={11} /> e-Filing Mandatory
              </span>
            )}
            <span className="bg-gray-100 text-text-muted text-xs font-semibold px-2.5 py-1 rounded-full">
              {data.assesseeTypes?.join(', ')}
            </span>
          </div>
        </div>

        <p className="mt-4 text-text-main leading-relaxed">{data.longDescription || data.shortDescription}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-background rounded-lg p-3 border border-border-light">
            <p className="text-xs text-text-muted mb-1">Filing Deadline</p>
            <p className="font-semibold text-text-main flex items-center gap-1.5">
              <Clock size={14} className="text-warning" /> {data.filingDeadline}
            </p>
          </div>
          <div className="bg-background rounded-lg p-3 border border-border-light">
            <p className="text-xs text-text-muted mb-1">Income Limit</p>
            <p className="font-semibold text-text-main">{formatINR(data.incomeLimitTotal)}</p>
          </div>
          <div className="bg-background rounded-lg p-3 border border-border-light">
            <p className="text-xs text-text-muted mb-1">HUF Applicable</p>
            <p className={`font-semibold flex items-center gap-1.5 ${data.hufApplicable ? 'text-success' : 'text-error'}`}>
              {data.hufApplicable ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {data.hufApplicable ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {data.officialFormLink && (
          <div className="mt-4">
            <a
              href={data.officialFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm py-2 px-4"
            >
              <ExternalLink size={14} /> Official Form Download
            </a>
          </div>
        )}
      </div>

      {/* Eligibility & Exclusion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility */}
        <div className="card p-5">
          <h3 className="section-title text-lg flex items-center gap-2">
            <CheckCircle size={18} className="text-success" /> Who Can File
          </h3>
          <ul className="space-y-3 mt-3">
            {data.eligibilityCriteria?.map((ec) => (
              <li key={ec.id} className="flex gap-3">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-main text-sm">{ec.criterion}</p>
                  <p className="text-xs text-text-muted mt-0.5">{ec.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="card p-5">
          <h3 className="section-title text-lg flex items-center gap-2">
            <XCircle size={18} className="text-error" /> Who Cannot File
          </h3>
          <ul className="space-y-3 mt-3">
            {data.exclusionCriteria?.map((ex) => (
              <li key={ex.id} className="flex gap-3">
                <XCircle size={16} className="text-error mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-main text-sm">{ex.criterion}</p>
                  <p className="text-xs text-text-muted mt-0.5">{ex.detail}</p>
                  {ex.consequence && (
                    <p className="text-xs text-warning font-medium mt-1">{ex.consequence}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Common Misconceptions */}
      {data.commonMisconceptions?.length > 0 && (
        <div className="card p-5">
          <h3 className="section-title text-lg flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning" /> Common Misconceptions
          </h3>
          <ul className="space-y-3 mt-3">
            {data.commonMisconceptions.map((m, i) => (
              <li key={i} className="callout-warning rounded-r-lg text-sm text-orange-900 p-3 flex gap-2">
                <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FY 2025-26 Changes */}
      {data.fy202526Changes?.length > 0 && (
        <div className="card p-5">
          <h3 className="section-title text-lg flex items-center gap-2">
            <Star size={18} className="text-accent" /> FY 2025-26 Changes
          </h3>
          <ul className="space-y-3 mt-3">
            {data.fy202526Changes.map((ch, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-lg border border-border-light hover:border-accent/40 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-text-main text-sm flex items-center flex-wrap gap-1">
                    {ch.summary}
                    {ch.isNewForFY202526 && <NewBadge />}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{ch.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Residency note */}
      {data.residencyNote && (
        <Callout variant="warning" title="Residency Requirement">
          {data.residencyNote}
        </Callout>
      )}
    </div>
  )
}

function ApplicabilityTab({ data }) {
  return (
    <div className="space-y-8">
      {/* HUF */}
      <div className="card p-5">
        <h3 className="section-title text-lg flex items-center gap-2">
          <Users size={18} className="text-primary" /> HUF Applicability
        </h3>
        <div className={`mt-3 flex items-start gap-3 p-4 rounded-lg ${data.hufApplicable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {data.hufApplicable
            ? <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
            : <XCircle size={20} className="text-error flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`font-semibold ${data.hufApplicable ? 'text-success' : 'text-error'}`}>
              HUF {data.hufApplicable ? 'can' : 'cannot'} file this form
            </p>
            {data.hufNote && <p className="text-sm text-text-muted mt-1">{data.hufNote}</p>}
          </div>
        </div>
      </div>

      {/* Eligibility checklist table */}
      <div className="card p-5">
        <h3 className="section-title text-lg flex items-center gap-2">
          <List size={18} className="text-primary" /> Eligibility Checklist
        </h3>
        <p className="section-subtitle text-sm mt-1">
          All "Yes" criteria must be satisfied. Any "No" disqualifies this form.
        </p>
        <div className="overflow-x-auto mt-3 rounded-xl border border-border-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-4 py-3 font-semibold w-12">#</th>
                <th className="text-left px-4 py-3 font-semibold">Criterion</th>
                <th className="text-left px-4 py-3 font-semibold">Detail</th>
                <th className="text-center px-4 py-3 font-semibold w-20">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {data.eligibilityCriteria?.map((ec) => (
                <tr key={ec.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-text-muted font-mono text-xs">{ec.id}</td>
                  <td className="px-4 py-3 font-medium text-text-main">{ec.criterion}</td>
                  <td className="px-4 py-3 text-text-muted">{ec.detail}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      ec.isInclusion
                        ? 'bg-green-100 text-success'
                        : 'bg-red-100 text-error'
                    }`}>
                      {ec.isInclusion
                        ? <><CheckCircle size={11} /> Yes</>
                        : <><XCircle size={11} /> No</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exclusion table */}
      <div className="card p-5">
        <h3 className="section-title text-lg flex items-center gap-2">
          <XCircle size={18} className="text-error" /> Disqualifying Conditions
        </h3>
        <div className="overflow-x-auto mt-3 rounded-xl border border-border-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-error/90 text-white">
                <th className="text-left px-4 py-3 font-semibold">If You Have / Are</th>
                <th className="text-left px-4 py-3 font-semibold">Why Disqualified</th>
                <th className="text-left px-4 py-3 font-semibold">Use Instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {data.exclusionCriteria?.map((ex) => (
                <tr key={ex.id} className="hover:bg-red-50">
                  <td className="px-4 py-3 font-medium text-text-main">{ex.criterion}</td>
                  <td className="px-4 py-3 text-text-muted">{ex.detail}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {ex.consequence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Income heads allowed */}
      {data.incomeHeadsAllowed?.length > 0 && (
        <div className="card p-5">
          <h3 className="section-title text-lg flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Permitted Income Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {data.incomeHeadsAllowed.map((head, i) => (
              <div key={i} className="bg-background rounded-lg border border-border-light p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-text-main text-sm">{head.head}</h4>
                  <span className="data-value text-xs flex-shrink-0">{head.section}</span>
                </div>
                <p className="text-xs text-text-muted mt-1.5">{head.details}</p>
                {head.schedule && (
                  <p className="mt-2 text-xs font-medium text-primary">
                    Schedule: {head.schedule}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SchedulesTab({ data }) {
  const compulsory = data.schedules?.filter((s) => s.isCompulsory) || []
  const optional = data.schedules?.filter((s) => !s.isCompulsory) || []

  return (
    <div className="space-y-6">
      <Callout variant="info" title={`${data.formId} — ${data.totalSchedules} Schedule(s)`}>
        {data.note}
      </Callout>

      {/* Compulsory */}
      {compulsory.length > 0 && (
        <div>
          <h3 className="section-title text-lg flex items-center gap-2 mb-3">
            <Shield size={18} className="text-primary" /> Compulsory Schedules
          </h3>
          <div className="space-y-3">
            {compulsory.map((sch) => (
              <ScheduleCard key={sch.scheduleId} schedule={sch} />
            ))}
          </div>
        </div>
      )}

      {/* Optional / conditional */}
      {optional.length > 0 && (
        <div>
          <h3 className="section-title text-lg flex items-center gap-2 mb-3 mt-6">
            <Layers size={18} className="text-text-muted" /> Conditional Schedules
          </h3>
          <div className="space-y-3">
            {optional.map((sch) => (
              <ScheduleCard key={sch.scheduleId} schedule={sch} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ScheduleCard({ schedule }) {
  const hasNewFields = schedule.keyFields?.some((f) => f.isNewForFY202526)

  return (
    <AccordionItem
      title={
        <span className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
            {schedule.scheduleId}
          </span>
          <span>{schedule.scheduleName}</span>
          {hasNewFields && <NewBadge />}
        </span>
      }
      badge={schedule.isCompulsory ? 'Compulsory' : 'Conditional'}
      badgeColor={schedule.isCompulsory ? 'bg-success' : 'bg-text-muted'}
    >
      <div className="p-5 space-y-4">
        {/* Condition */}
        <div className={`text-sm px-3 py-2 rounded-lg border ${
          schedule.isCompulsory
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="font-semibold">When required: </span>
          {schedule.compulsoryCondition}
        </div>

        <p className="text-sm text-text-muted">{schedule.description}</p>

        {/* Regime note */}
        {schedule.regimeNote && (
          <Callout variant="warning">{schedule.regimeNote}</Callout>
        )}

        {/* Key fields table */}
        {schedule.keyFields?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Key Fields</h4>
            <div className="overflow-x-auto rounded-lg border border-border-light">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-light">
                    <th className="text-left px-3 py-2 font-semibold text-text-muted">Field</th>
                    <th className="text-left px-3 py-2 font-semibold text-text-muted">Type</th>
                    <th className="text-left px-3 py-2 font-semibold text-text-muted">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {schedule.keyFields.map((field) => (
                    <tr key={field.fieldId} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-text-main flex items-center gap-1 flex-wrap">
                          {field.fieldName}
                          {field.isNewForFY202526 && <NewBadge />}
                          {field.availableNewRegime && (
                            <span className="badge-success">Both Regimes</span>
                          )}
                        </div>
                        <span className="font-mono text-gray-400">{field.fieldId}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="data-value">{field.fieldType}</span>
                      </td>
                      <td className="px-3 py-2 text-text-muted">{field.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cross references */}
        {schedule.crossReferences?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted font-semibold">Cross-references:</span>
            {schedule.crossReferences.map((ref) => (
              <span key={ref} className="data-value text-xs">{ref}</span>
            ))}
          </div>
        )}

        {/* Common mistakes */}
        {schedule.commonMistakes?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Common Mistakes</h4>
            <ul className="space-y-1.5">
              {schedule.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-xs text-orange-800">
                  <AlertTriangle size={13} className="text-warning flex-shrink-0 mt-0.5" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AccordionItem>
  )
}

function ScenariosTab({ data }) {
  const scenarios = data.scenarios || []
  const complexityOrder = { basic: 0, intermediate: 1, advanced: 2 }
  const sorted = [...scenarios].sort(
    (a, b) => (complexityOrder[a.complexity] ?? 99) - (complexityOrder[b.complexity] ?? 99)
  )

  const complexityColor = {
    basic: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-4">
      <Callout variant="info" title="Worked Examples">
        Each example shows a real taxpayer profile with step-by-step schedule guidance and a complete tax
        computation. Expand any card to see the full breakdown.
      </Callout>

      {sorted.map((sc) => (
        <AccordionItem
          key={sc.scenarioId}
          title={
            <span className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs bg-gray-100 text-text-muted px-2 py-0.5 rounded">
                {sc.scenarioId}
              </span>
              <span>{sc.title}</span>
              {sc.isNewFY202526 && <NewBadge />}
            </span>
          }
          badge={sc.complexity}
          badgeColor={
            sc.complexity === 'basic'
              ? 'bg-success'
              : sc.complexity === 'intermediate'
              ? 'bg-primary'
              : 'bg-purple-600'
          }
        >
          <div className="p-5 space-y-6">
            {/* FY highlight */}
            {sc.fy202526Highlight && (
              <div className="callout-info rounded-r-lg p-3 text-sm text-blue-900 flex gap-2 items-start">
                <Star size={14} className="text-accent mt-0.5 flex-shrink-0" />
                {sc.fy202526Highlight}
              </div>
            )}

            {/* Tags + complexity */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${complexityColor[sc.complexity] || 'bg-gray-100 text-text-muted'}`}>
                {sc.complexity}
              </span>
              <RegimePill regime={sc.taxComputation?.regime} />
              {sc.tags?.map((t) => (
                <span key={t} className="bg-gray-100 text-text-muted text-xs px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            {/* Taxpayer profile */}
            <div className="bg-background rounded-xl border border-border-light p-4">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3">
                <User size={15} className="text-primary" /> Taxpayer Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  ['Name', sc.taxpayerProfile?.name],
                  ['Age', sc.taxpayerProfile?.age ? `${sc.taxpayerProfile.age} years` : null],
                  ['Status', sc.taxpayerProfile?.status],
                  ['Occupation', sc.taxpayerProfile?.occupation],
                  ['Employer', sc.taxpayerProfile?.employer],
                  ['City', sc.taxpayerProfile?.city],
                  ['Regime', sc.taxpayerProfile?.regimeChoice],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-text-muted w-24 flex-shrink-0">{label}:</span>
                    <span className="text-text-main font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Income summary */}
              {sc.taxpayerProfile?.incomes && (
                <div className="mt-3 pt-3 border-t border-border-light">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Income</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    {Object.entries(sc.taxpayerProfile.incomes)
                      .filter(([k, v]) => typeof v === 'number')
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <span className="text-text-muted capitalize">
                            {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                          </span>
                          <span className="font-mono font-semibold text-text-main">{formatINR(v)}</span>
                        </div>
                      ))}
                  </div>
                  {sc.taxpayerProfile.incomes.note && (
                    <p className="text-xs text-text-muted mt-2 italic">{sc.taxpayerProfile.incomes.note}</p>
                  )}
                </div>
              )}
            </div>

            {/* Schedules to fill */}
            {sc.schedulesToFill?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
                  <FileText size={15} className="text-primary" /> Schedules to Fill
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border-light">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-border-light">
                        <th className="text-left px-3 py-2 font-semibold text-text-muted">Schedule</th>
                        <th className="text-center px-3 py-2 font-semibold text-text-muted">Required</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-muted">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {sc.schedulesToFill.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono font-medium text-primary">{s.scheduleId}</td>
                          <td className="px-3 py-2 text-center">
                            {s.compulsory
                              ? <span className="badge-success">Yes</span>
                              : <span className="bg-gray-100 text-text-muted text-xs font-bold px-2 py-0.5 rounded-full uppercase">If applicable</span>}
                          </td>
                          <td className="px-3 py-2 text-text-muted">{s.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tax computation */}
            {sc.taxComputation && (
              <div>
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3">
                  <Calculator size={15} className="text-primary" /> Tax Computation
                </h4>
                <TaxComputationTable taxComp={sc.taxComputation} />
              </div>
            )}

            {/* Red flags in scenario */}
            {sc.redFlagsInScenario?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-error flex items-center gap-2 mb-2">
                  <Flag size={14} className="text-error" /> Watch Out For
                </h4>
                <ul className="space-y-1.5">
                  {sc.redFlagsInScenario.map((rf, i) => (
                    <li key={i} className="flex gap-2 text-xs text-red-800 callout-error rounded-r-lg p-2">
                      <AlertCircle size={13} className="text-error flex-shrink-0 mt-0.5" />
                      {rf}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common mistakes */}
            {sc.commonMistakesToAvoid?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-warning flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-warning" /> Common Mistakes to Avoid
                </h4>
                <ul className="space-y-1.5">
                  {sc.commonMistakesToAvoid.map((m, i) => (
                    <li key={i} className="flex gap-2 text-xs text-orange-800">
                      <ChevronRight size={13} className="text-warning flex-shrink-0 mt-0.5" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AccordionItem>
      ))}
    </div>
  )
}

function RedFlagsTab({ data }) {
  const flags = data.redFlags || []
  const validationErrors = data.validationErrors || []

  const bySeverity = {
    critical: flags.filter((f) => f.severity === 'critical'),
    high: flags.filter((f) => f.severity === 'high'),
    medium: flags.filter((f) => f.severity === 'medium'),
  }

  const severityConfig = {
    critical: {
      label: 'Critical',
      badgeClass: 'badge-critical',
      headerClass: 'bg-error/10 border-error/30 text-error',
      icon: AlertCircle,
    },
    high: {
      label: 'High',
      badgeClass: 'badge-warning',
      headerClass: 'bg-orange-50 border-orange-300 text-orange-800',
      icon: AlertTriangle,
    },
    medium: {
      label: 'Medium',
      badgeClass: 'bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase',
      headerClass: 'bg-yellow-50 border-yellow-300 text-yellow-800',
      icon: Info,
    },
  }

  return (
    <div className="space-y-8">
      <Callout variant="error" title="Red Flags Overview">
        These are the most common errors, omissions, and triggers that lead to defective returns,
        demand notices, or scrutiny assessments. Review each carefully before filing.
      </Callout>

      {Object.entries(bySeverity).map(([severity, items]) => {
        if (!items.length) return null
        const cfg = severityConfig[severity]
        const Icon = cfg.icon
        return (
          <div key={severity}>
            <h3 className={`text-base font-bold flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${cfg.headerClass}`}>
              <Icon size={16} />
              {cfg.label} Severity — {items.length} issue{items.length !== 1 ? 's' : ''}
            </h3>
            <div className="space-y-3">
              {items.map((flag) => (
                <div key={flag.id} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-text-main flex items-center gap-2 flex-wrap">
                      <span className="data-value text-xs">{flag.id}</span>
                      {flag.title}
                    </h4>
                    <SeverityBadge severity={flag.severity} />
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed">{flag.description}</p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {flag.consequence && (
                      <div className="callout-error rounded-r-lg p-3">
                        <p className="text-xs font-bold text-red-800 mb-1">Consequence</p>
                        <p className="text-xs text-red-700">{flag.consequence}</p>
                      </div>
                    )}
                    {flag.correction && (
                      <div className="callout-success rounded-r-lg p-3">
                        <p className="text-xs font-bold text-green-800 mb-1">How to Fix</p>
                        <p className="text-xs text-green-700">{flag.correction}</p>
                      </div>
                    )}
                  </div>

                  {flag.howToDetect && (
                    <div className="mt-3 callout-info rounded-r-lg p-3">
                      <p className="text-xs font-bold text-blue-800 mb-1">How to Detect</p>
                      <p className="text-xs text-blue-700">{flag.howToDetect}</p>
                    </div>
                  )}

                  {flag.howToAvoid && (
                    <div className="mt-3 callout-warning rounded-r-lg p-3">
                      <p className="text-xs font-bold text-orange-800 mb-1">How to Avoid</p>
                      <p className="text-xs text-orange-700">{flag.howToAvoid}</p>
                    </div>
                  )}

                  {flag.legalReference && (
                    <p className="mt-2 text-xs text-text-muted">
                      <span className="font-semibold">Legal Ref:</span> {flag.legalReference}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div>
          <h3 className="section-title text-lg flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-primary" /> Common Validation Errors
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border-light">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-3 font-semibold">Error Code</th>
                  <th className="text-left px-4 py-3 font-semibold">Error Message</th>
                  <th className="text-left px-4 py-3 font-semibold">Cause</th>
                  <th className="text-left px-4 py-3 font-semibold">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {validationErrors.map((ve) => (
                  <tr key={ve.errorCode} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3">
                      <span className="data-value text-xs">{ve.errorCode}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-main text-xs">{ve.errorMessage}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{ve.cause}</td>
                    <td className="px-4 py-3 text-success text-xs">{ve.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

const TAB_DEFS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'applicability', label: 'Applicability', icon: CheckCircle },
  { id: 'schedules', label: 'Schedules Guide', icon: List },
  { id: 'scenarios', label: 'Worked Examples', icon: BookOpen },
  { id: 'redflags', label: 'Red Flags', icon: Flag },
]

export default function FormPage() {
  const { formId } = useParams()

  const [activeTab, setActiveTab] = useState('overview')
  const [overviewData, setOverviewData] = useState(null)
  const [schedulesData, setSchedulesData] = useState(null)
  const [scenariosData, setScenariosData] = useState(null)
  const [redFlagsData, setRedFlagsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!formId) return
    setLoading(true)
    setError(null)
    setOverviewData(null)
    setSchedulesData(null)
    setScenariosData(null)
    setRedFlagsData(null)

    const base = `/home/user/ITR-Forms/data/forms/${formId}`

    Promise.all([
      import(`../../../data/forms/${formId}/overview.json`).catch(() => null),
      import(`../../../data/forms/${formId}/schedules.json`).catch(() => null),
      import(`../../../data/forms/${formId}/scenarios.json`).catch(() => null),
      import(`../../../data/forms/${formId}/red-flags.json`).catch(() => null),
    ])
      .then(([ov, sch, sc, rf]) => {
        if (!ov) throw new Error(`No data found for form "${formId}". Please check the form ID.`)
        setOverviewData(ov.default ?? ov)
        setSchedulesData(sch ? (sch.default ?? sch) : null)
        setScenariosData(sc ? (sc.default ?? sc) : null)
        setRedFlagsData(rf ? (rf.default ?? rf) : null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [formId])

  // Tab badges (e.g., count of red flags)
  const tabs = TAB_DEFS.map((t) => {
    if (t.id === 'redflags' && redFlagsData?.redFlags) {
      const critical = redFlagsData.redFlags.filter((f) => f.severity === 'critical').length
      return critical > 0 ? { ...t, badge: critical } : t
    }
    if (t.id === 'scenarios' && scenariosData?.scenarios) {
      return { ...t, badge: scenariosData.scenarios.length }
    }
    return t
  })

  if (loading) return <PageSkeleton />

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-main mb-2">Form Not Found</h2>
        <p className="text-text-muted mb-6">{error}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    )
  }

  const formLabel = overviewData?.formId || formId.toUpperCase()
  const popularName = overviewData?.popularName

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-white border-b border-border-light">
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <Breadcrumb
            items={[
              { label: 'Forms', to: '/' },
              { label: formLabel },
            ]}
          />

          <div className="flex flex-wrap items-start justify-between gap-4 mt-1">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-primary">{formLabel}</h1>
                {popularName && (
                  <span className="badge-new">{popularName}</span>
                )}
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                  FY {overviewData?.fyApplicable} / AY {overviewData?.ayApplicable}
                </span>
              </div>
              <p className="text-text-muted mt-1 max-w-2xl text-sm">
                {overviewData?.shortDescription}
              </p>
            </div>
            <Link to="/" className="btn-outline text-sm py-2 px-4 flex-shrink-0">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>

        {/* Sticky tab bar */}
        <div className="max-w-screen-xl mx-auto px-4 sticky top-0 z-20 bg-white">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {activeTab === 'overview' && overviewData && (
          <OverviewTab data={overviewData} />
        )}

        {activeTab === 'applicability' && overviewData && (
          <ApplicabilityTab data={overviewData} />
        )}

        {activeTab === 'schedules' && (
          schedulesData
            ? <SchedulesTab data={schedulesData} />
            : <Callout variant="info">No schedules data available for this form.</Callout>
        )}

        {activeTab === 'scenarios' && (
          scenariosData
            ? <ScenariosTab data={scenariosData} />
            : <Callout variant="info">No worked examples available for this form yet.</Callout>
        )}

        {activeTab === 'redflags' && (
          redFlagsData
            ? <RedFlagsTab data={redFlagsData} />
            : <Callout variant="info">No red flags data available for this form.</Callout>
        )}
      </div>
    </div>
  )
}
