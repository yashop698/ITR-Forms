import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar, TrendingUp, Grid, Table2, ReceiptText, Zap, BookOpen,
  ChevronRight, ChevronDown, AlertTriangle, Star, Info, CheckCircle2,
  Clock, ArrowRight
} from 'lucide-react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Callout from '../../components/ui/Callout'

// ── Static JSON imports ───────────────────────────────────────────────────────
import keyDates from '../../../data/meta/key-dates.json'
import taxSlabs from '../../../data/meta/tax-slabs.json'
import formMatrix from '../../../data/reference/form-applicability-matrix.json'
import scheduleMatrix from '../../../data/reference/schedule-matrix.json'
import tdsRates from '../../../data/reference/tds-rates.json'
import fyChanges from '../../../data/reference/fy2025-26-changes.json'
import deductionMatrix from '../../../data/reference/deduction-matrix.json'

// ── Section registry ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'dates',            label: 'Key Dates',          icon: Calendar,      iconColor: 'text-primary' },
  { id: 'tax-slabs',        label: 'Tax Slabs',          icon: TrendingUp,    iconColor: 'text-success' },
  { id: 'form-matrix',      label: 'Form Matrix',        icon: Grid,          iconColor: 'text-primary' },
  { id: 'schedule-matrix',  label: 'Schedule Matrix',    icon: Table2,        iconColor: 'text-primary' },
  { id: 'tds-rates',        label: 'TDS Rates',          icon: ReceiptText,   iconColor: 'text-warning' },
  { id: 'changes',          label: 'FY 2025-26 Changes', icon: Zap,           iconColor: 'text-accent' },
  { id: 'deduction-matrix', label: 'Deduction Matrix',   icon: BookOpen,      iconColor: 'text-success' },
]

// ── Utility helpers ───────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null) return '—'
  return '₹' + Number(n).toLocaleString('en-IN')
}

function fmtDate(dateStr) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function isPast(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

function isUpcoming(dateStr, daysAhead = 90) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  const future = new Date()
  future.setDate(future.getDate() + daysAhead)
  return d >= now && d <= future
}

// ── KEY DATES section ─────────────────────────────────────────────────────────
function DatesSection() {
  const categories = keyDates.categories

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Key Dates — FY 2025-26 / AY 2026-27</h2>
        <p className="section-subtitle">
          Critical deadlines for ITR filing, advance tax, TDS, and assessments.
          Dates are per standard schedule; check CBDT circulars for extensions.
        </p>
      </div>

      {Object.entries(categories).map(([catKey, category]) => (
        <div key={catKey}>
          <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            {category.label}
          </h3>

          <div className="space-y-2">
            {(category.dates || []).map((item) => {
              const past = item.deadline ? isPast(item.deadline) : false
              const upcoming = item.deadline ? isUpcoming(item.deadline) : false

              return (
                <div
                  key={item.id}
                  className={`card p-4 flex flex-col sm:flex-row sm:items-start gap-3 ${
                    upcoming ? 'border-l-4 border-warning' : past ? 'opacity-60' : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Date badge */}
                  <div className="flex-shrink-0">
                    {item.deadline ? (
                      <div
                        className={`text-center rounded-lg px-3 py-2 min-w-[80px] ${
                          past
                            ? 'bg-gray-100 text-text-muted'
                            : upcoming
                            ? 'bg-orange-50 border border-warning/40'
                            : 'bg-primary/10'
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold uppercase tracking-wide ${
                            past ? 'text-text-muted' : upcoming ? 'text-warning' : 'text-primary'
                          }`}
                        >
                          {new Date(item.deadline).toLocaleDateString('en-IN', { month: 'short' })}
                        </div>
                        <div
                          className={`text-xl font-extrabold leading-none ${
                            past ? 'text-text-muted' : upcoming ? 'text-warning' : 'text-primary'
                          }`}
                        >
                          {new Date(item.deadline).getDate()}
                        </div>
                        <div
                          className={`text-xs ${
                            past ? 'text-text-muted' : upcoming ? 'text-warning' : 'text-primary'
                          }`}
                        >
                          {new Date(item.deadline).getFullYear()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-100 rounded-lg px-3 py-2 min-w-[80px]">
                        <Clock size={20} className="text-text-muted mx-auto" />
                        <div className="text-xs text-text-muted mt-1">Variable</div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="font-semibold text-text-main text-sm leading-snug">
                        {item.event || item.installment}
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {upcoming && (
                          <span className="text-xs bg-orange-100 text-warning px-1.5 py-0.5 rounded font-semibold">
                            Upcoming
                          </span>
                        )}
                        {past && (
                          <span className="text-xs bg-gray-100 text-text-muted px-1.5 py-0.5 rounded">
                            Past
                          </span>
                        )}
                        {item.minimumPercentage && (
                          <span className="text-xs bg-blue-100 text-primary px-1.5 py-0.5 rounded font-bold">
                            {item.minimumPercentage}% cumulative
                          </span>
                        )}
                      </div>
                    </div>

                    {item.section && (
                      <span className="text-xs text-primary mt-0.5 inline-block">{item.section}</span>
                    )}

                    {item.notes && (
                      <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{item.notes}</p>
                    )}
                    {item.deadlineNote && (
                      <p className="text-xs text-text-muted mt-1">{item.deadlineNote}</p>
                    )}

                    {item.lateFilingFee && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <AlertTriangle size={11} className="text-warning flex-shrink-0" />
                        <span className="text-xs text-orange-800">{item.lateFilingFee}</span>
                      </div>
                    )}
                    {item.additionalTax && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <AlertTriangle size={11} className="text-error flex-shrink-0" />
                        <span className="text-xs text-red-800">{item.additionalTax}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Interest summary */}
      <div>
        <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning" />
          Interest &amp; Penalty Quick Reference
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(keyDates.interestAndPenaltySummary).map(([key, item]) => (
            <div key={key} className="card p-4 border-l-4 border-warning">
              <div className="text-xs font-bold text-warning uppercase tracking-wide mb-1">
                {key.replace('section', 'Section ')}
              </div>
              <div className="font-semibold text-text-main text-sm">{item.name}</div>
              <div className="text-sm text-primary font-bold mt-1">{item.rate}</div>
              {item.period && <div className="text-xs text-text-muted mt-1">{item.period}</div>}
              {item.note && <div className="text-xs text-text-muted mt-1 italic">{item.note}</div>}
              {item.rates && (
                <ul className="mt-1 space-y-0.5">
                  {item.rates.map((r, i) => (
                    <li key={i} className="text-xs text-text-muted">
                      {r.condition}: <strong className="text-text-main">₹{r.fee.toLocaleString('en-IN')}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TAX SLABS section ─────────────────────────────────────────────────────────
function TaxSlabsSection() {
  const { regimes, specialRates } = taxSlabs
  const newRegime = regimes.new
  const oldRegime = regimes.old
  const oldSlabs = oldRegime.slabs.belowAge60

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Tax Slabs — FY 2025-26 / AY 2026-27</h2>
        <p className="section-subtitle">
          Finance Act 2025 · New regime is default. Old regime requires active opt-in.
        </p>
      </div>

      {/* Headline highlight */}
      <Callout variant="success" title="Zero Tax up to ₹12 Lakh (New Regime)">
        Under the new tax regime, Section 87A rebate raised to ₹60,000 effectively makes income up
        to <strong>₹12,00,000 completely tax-free</strong>. For salaried employees with standard
        deduction of ₹75,000, income up to <strong>₹12,75,000 is tax-free</strong>. Note: Special
        rate incomes (LTCG, STCG, VDA) are NOT covered by this rebate.
      </Callout>

      {/* Side-by-side comparison */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-50 border border-border-light p-3 text-left text-text-main font-bold text-xs uppercase tracking-wide w-1/3">
                Income Range
              </th>
              <th className="bg-primary/10 border border-border-light p-3 text-center text-primary font-bold text-xs uppercase tracking-wide">
                New Regime (Default)
                <div className="text-[10px] font-normal text-primary/70 mt-0.5">Sec 115BAC</div>
              </th>
              <th className="bg-gray-100 border border-border-light p-3 text-center text-text-main font-bold text-xs uppercase tracking-wide">
                Old Regime (Opt-in)
                <div className="text-[10px] font-normal text-text-muted mt-0.5">&lt;60 years</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Build merged slab rows */}
            {[
              { range: '₹0 – ₹2,50,000',    newRate: '0%',   oldRate: '0%',  newChanged: false },
              { range: '₹2,50,001 – ₹4,00,000', newRate: '0%', oldRate: '5%', newChanged: true, newNote: 'Nil slab extended to ₹4L (FY25-26)' },
              { range: '₹4,00,001 – ₹5,00,000', newRate: '5%', oldRate: '5%', newChanged: false },
              { range: '₹5,00,001 – ₹8,00,000', newRate: '5%', oldRate: '20%', newChanged: false },
              { range: '₹8,00,001 – ₹10,00,000', newRate: '10%', oldRate: '20%', newChanged: false },
              { range: '₹10,00,001 – ₹12,00,000', newRate: '10%', oldRate: '30%', newChanged: false },
              { range: '₹12,00,001 – ₹16,00,000', newRate: '15%', oldRate: '30%', newChanged: true, newNote: 'New slab FY25-26' },
              { range: '₹16,00,001 – ₹20,00,000', newRate: '20%', oldRate: '30%', newChanged: true, newNote: 'New slab FY25-26' },
              { range: '₹20,00,001 – ₹24,00,000', newRate: '25%', oldRate: '30%', newChanged: true, newNote: 'New slab FY25-26' },
              { range: 'Above ₹24,00,000',  newRate: '30%', oldRate: '30%', newChanged: false },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                <td className="border border-border-light px-3 py-2.5 font-mono text-xs text-text-main font-medium">
                  {row.range}
                </td>
                <td
                  className={`border border-border-light px-3 py-2.5 text-center font-bold ${
                    row.newRate === '0%'
                      ? 'text-success'
                      : row.newRate === '30%'
                      ? 'text-error'
                      : 'text-primary'
                  }`}
                >
                  {row.newRate}
                  {row.newChanged && (
                    <span className="ml-1 text-[9px] bg-accent/20 text-accent-dark px-1 py-0.5 rounded font-semibold">
                      NEW
                    </span>
                  )}
                  {row.newNote && (
                    <div className="text-[10px] text-text-muted font-normal mt-0.5">{row.newNote}</div>
                  )}
                </td>
                <td
                  className={`border border-border-light px-3 py-2.5 text-center font-bold ${
                    row.oldRate === '0%'
                      ? 'text-success'
                      : row.oldRate === '30%'
                      ? 'text-error'
                      : 'text-text-main'
                  }`}
                >
                  {row.oldRate}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td className="border border-border-light px-3 py-2 text-xs text-text-muted font-semibold">
                + 4% Health &amp; Education Cess on tax
              </td>
              <td className="border border-border-light px-3 py-2 text-center text-xs text-primary font-semibold">
                4% Cess
              </td>
              <td className="border border-border-light px-3 py-2 text-center text-xs text-text-muted font-semibold">
                4% Cess
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Key differences */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* New regime card */}
        <div className="card p-4 border-t-4 border-primary">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-primary" />
            <span className="font-bold text-primary">New Regime</span>
            <span className="badge-new">Default</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Basic Exemption</span>
              <span className="font-semibold text-text-main">₹4,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">87A Rebate (max)</span>
              <span className="font-semibold text-success">₹60,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Zero Tax Up To</span>
              <span className="font-bold text-success">₹12,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Standard Deduction</span>
              <span className="font-semibold text-text-main">₹75,000 (salaried)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Max Surcharge</span>
              <span className="font-semibold text-text-main">25%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="text-xs text-text-muted font-semibold mb-1">Deductions Allowed:</div>
            <ul className="text-xs text-text-muted space-y-0.5">
              {newRegime.deductionsAllowed.slice(0, 3).map((d, i) => (
                <li key={i} className="flex items-start gap-1">
                  <CheckCircle2 size={10} className="text-success flex-shrink-0 mt-0.5" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <div className="text-xs text-text-muted font-semibold mb-1">NOT Available:</div>
            <ul className="text-xs text-text-muted space-y-0.5">
              {newRegime.deductionsNotAllowed.slice(0, 4).map((d, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-error flex-shrink-0 font-bold">×</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Old regime card */}
        <div className="card p-4 border-t-4 border-gray-400">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-text-muted" />
            <span className="font-bold text-text-main">Old Regime</span>
            <span className="text-xs bg-gray-200 text-text-muted px-2 py-0.5 rounded font-semibold">
              Opt-in
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Basic Exemption (&lt;60 yrs)</span>
              <span className="font-semibold text-text-main">₹2,50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Basic Exemption (60–80)</span>
              <span className="font-semibold text-text-main">₹3,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Basic Exemption (80+)</span>
              <span className="font-semibold text-text-main">₹5,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">87A Rebate (max)</span>
              <span className="font-semibold text-text-main">₹12,500 (up to ₹5L)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Standard Deduction</span>
              <span className="font-semibold text-text-main">₹50,000 (salaried)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Max Surcharge</span>
              <span className="font-semibold text-text-main">37% (income &gt; ₹5Cr)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="text-xs text-success font-semibold">
              All Chapter VI-A deductions available (80C, 80D, HRA, LTA, etc.)
            </div>
          </div>
        </div>
      </div>

      {/* Special rates */}
      <div>
        <h3 className="section-title mb-3">Special Tax Rates (Both Regimes)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Income Type</th>
                <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Section</th>
                <th className="border border-border-light px-3 py-2 text-center text-xs font-bold text-text-main uppercase tracking-wide">Rate</th>
                <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'LTCG (Equity/MF — STT paid)', section: '112A', rate: '12.5%', note: 'First ₹1.25L exempt. Raised from 10% (FA2024)' },
                { type: 'STCG (Equity/MF — STT paid)', section: '111A', rate: '20%', note: 'Raised from 15% (FA2024, July 23, 2024)' },
                { type: 'LTCG (Other assets)', section: '112', rate: '12.5%', note: 'No indexation. Property pre-Jul 23 2024: choose 20%+indexation or 12.5% without' },
                { type: 'VDA / Crypto', section: '115BBH', rate: '30%', note: 'No deductions (except cost). No loss set-off' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-border-light px-3 py-2 text-text-main font-medium">{row.type}</td>
                  <td className="border border-border-light px-3 py-2">
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">{row.section}</span>
                  </td>
                  <td className="border border-border-light px-3 py-2 text-center font-bold text-primary">{row.rate}</td>
                  <td className="border border-border-light px-3 py-2 text-xs text-text-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surcharge comparison */}
      <div>
        <h3 className="section-title mb-3">Surcharge Rates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Total Income</th>
                <th className="border border-border-light px-3 py-2 text-center text-xs font-bold text-primary uppercase tracking-wide">New Regime</th>
                <th className="border border-border-light px-3 py-2 text-center text-xs font-bold text-text-main uppercase tracking-wide">Old Regime</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: '≤ ₹50 Lakh',     newRate: 'Nil', oldRate: 'Nil' },
                { range: '₹50L – ₹1 Cr',  newRate: '10%', oldRate: '10%' },
                { range: '₹1 Cr – ₹2 Cr', newRate: '15%', oldRate: '15%' },
                { range: '₹2 Cr – ₹5 Cr', newRate: '25%', oldRate: '25%' },
                { range: 'Above ₹5 Cr',    newRate: '25% (capped)', oldRate: '37%' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-border-light px-3 py-2 font-medium text-text-main">{row.range}</td>
                  <td className="border border-border-light px-3 py-2 text-center font-bold text-primary">{row.newRate}</td>
                  <td className="border border-border-light px-3 py-2 text-center font-bold text-text-main">{row.oldRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-2">
          New regime surcharge is capped at 25% even for income above ₹5 Cr (vs 37% under old regime).
        </p>
      </div>
    </div>
  )
}

// ── FORM MATRIX section ───────────────────────────────────────────────────────
function FormMatrixSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Form Applicability Matrix — FY 2025-26</h2>
        <p className="section-subtitle">
          {formMatrix.description}
        </p>
      </div>

      {/* Quick reference table */}
      <div>
        <h3 className="font-bold text-text-main mb-3">Quick Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">
                  Assessee Type
                </th>
                <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">
                  Eligible Forms
                </th>
              </tr>
            </thead>
            <tbody>
              {formMatrix.quickReferenceTable.data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-border-light px-3 py-2 text-text-main font-medium">
                    {row.assesseeType}
                  </td>
                  <td className="border border-border-light px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {row.forms.map((f) => (
                        <span
                          key={f}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-bold"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed matrix per assessee */}
      <div className="space-y-4">
        <h3 className="font-bold text-text-main mb-1">Detailed Combination Guide</h3>
        {formMatrix.matrix.map((assessee) => (
          <div key={assessee.assesseeId} className="card overflow-hidden">
            <div className="bg-primary/5 px-4 py-2.5 border-b border-border-light">
              <span className="font-bold text-primary">{assessee.assesseeLabel}</span>
            </div>
            <div className="divide-y divide-border-light">
              {assessee.combinations.map((combo, i) => (
                <div key={i} className="p-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-main mb-1">{combo.incomeProfile}</p>
                    <p className="text-xs text-text-muted">{combo.conditions}</p>
                    {combo.fy202526Note && (
                      <div className="mt-1 flex items-start gap-1">
                        <Star size={11} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-amber-800">{combo.fy202526Note}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-1 sm:items-end">
                    <span className="text-xs font-bold bg-primary text-white px-2 py-1 rounded">
                      {combo.recommendedForm}
                    </span>
                    {combo.alternativeForms?.length > 0 && (
                      <div className="flex gap-1">
                        {combo.alternativeForms.map((f) => (
                          <span key={f} className="text-xs bg-gray-100 text-text-muted px-1.5 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SCHEDULE MATRIX section ───────────────────────────────────────────────────
function ScheduleMatrixSection() {
  const forms = ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'ITR-5', 'ITR-6', 'ITR-7']
  const { schedules, legend } = scheduleMatrix

  const cellBg = (val) => {
    if (!val || val === 'NA') return 'bg-gray-100 text-text-muted'
    if (val.startsWith('C')) return 'bg-blue-50 text-primary'
    if (val.startsWith('O')) return 'bg-green-50 text-success'
    return 'bg-gray-50 text-text-muted'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Schedule Matrix — FY 2025-26</h2>
        <p className="section-subtitle">{scheduleMatrix.description}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(legend).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                key === 'C' ? 'bg-blue-50 text-primary' :
                key === 'O' ? 'bg-green-50 text-success' :
                key === 'NA' ? 'bg-gray-100 text-text-muted' :
                'bg-accent/20 text-accent-dark'
              }`}
            >
              {key}
            </span>
            <span className="text-xs text-text-muted">{val}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-primary/5">
              <th className="border border-border-light px-3 py-2.5 text-left font-bold text-text-main sticky left-0 bg-primary/5 min-w-[200px]">
                Schedule
              </th>
              {forms.map((f) => (
                <th
                  key={f}
                  className="border border-border-light px-2 py-2.5 text-center font-bold text-primary min-w-[70px]"
                >
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch, i) => (
              <tr
                key={sch.scheduleId}
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}
              >
                <td className="border border-border-light px-3 py-2 sticky left-0 bg-inherit">
                  <div className="font-semibold text-text-main leading-tight">
                    {sch.scheduleName}
                  </div>
                  {sch.description && (
                    <div className="text-text-muted text-[10px] mt-0.5 leading-snug">
                      {sch.description.length > 80
                        ? sch.description.slice(0, 80) + '…'
                        : sch.description}
                    </div>
                  )}
                </td>
                {forms.map((f) => {
                  const raw = sch[f] || 'NA'
                  const display = raw === 'NA' ? 'NA' : raw.split(' ')[0]
                  return (
                    <td
                      key={f}
                      className={`border border-border-light px-2 py-2 text-center font-semibold ${cellBg(raw)}`}
                      title={raw}
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── TDS RATES section ─────────────────────────────────────────────────────────
function TdsRatesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">TDS / TCS Rates — FY 2025-26</h2>
        <p className="section-subtitle">{tdsRates.description}</p>
      </div>

      <Callout variant="warning" title="No PAN — Higher TDS at 20%">
        If payee has not furnished PAN, TDS is deducted at <strong>20%</strong> or double the
        applicable rate, whichever is higher (Section 206AA). Aadhaar can be used in lieu of PAN for
        certain transactions.
      </Callout>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-primary/5">
              <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Section</th>
              <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Payment Type</th>
              <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Threshold</th>
              <th className="border border-border-light px-3 py-2 text-center text-xs font-bold text-text-main uppercase tracking-wide">Rate</th>
              <th className="border border-border-light px-3 py-2 text-left text-xs font-bold text-text-main uppercase tracking-wide">Relevant ITR</th>
            </tr>
          </thead>
          <tbody>
            {tdsRates.tdsRates.map((row, i) => (
              <tr
                key={row.section}
                className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} ${row.isNewForFY202526 || row.fy202526Change ? 'ring-1 ring-accent/30' : ''}`}
              >
                <td className="border border-border-light px-3 py-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                      {row.section}
                    </span>
                    {row.isNewForFY202526 && (
                      <span className="badge-new text-[9px]">NEW</span>
                    )}
                  </div>
                </td>
                <td className="border border-border-light px-3 py-2">
                  <div className="font-medium text-text-main text-xs">{row.description}</div>
                  <div className="text-text-muted text-[11px] mt-0.5">{row.paymentType}</div>
                  {row.rateNote && (
                    <div className="text-[11px] text-blue-700 mt-0.5">{row.rateNote}</div>
                  )}
                  {row.fy202526Change && (
                    <div className="text-[11px] text-accent-dark font-semibold mt-0.5">
                      FY25-26: {row.fy202526Change}
                    </div>
                  )}
                </td>
                <td className="border border-border-light px-3 py-2 text-xs text-text-muted">
                  {row.threshold}
                </td>
                <td className="border border-border-light px-3 py-2 text-center font-bold text-primary text-xs">
                  {row.rate}
                </td>
                <td className="border border-border-light px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(row.relevantITR) ? row.relevantITR : [row.relevantITR]).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] bg-gray-100 text-text-muted px-1 py-0.5 rounded"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── FY CHANGES section ────────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  critical: { bg: 'bg-red-50 border-error', badge: 'bg-error text-white', label: 'Critical' },
  high:     { bg: 'bg-orange-50 border-warning', badge: 'bg-warning text-white', label: 'High' },
  medium:   { bg: 'bg-blue-50 border-primary', badge: 'bg-primary text-white', label: 'Medium' },
  low:      { bg: 'bg-gray-50 border-gray-300', badge: 'bg-gray-400 text-white', label: 'Low' },
}

function ChangesSection() {
  const { changes, formChangeSummary } = fyChanges

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">{fyChanges.title}</h2>
        <p className="section-subtitle">{fyChanges.summary}</p>
      </div>

      {/* Form change summary */}
      <div>
        <h3 className="font-bold text-text-main mb-3">Form-wise Change Summary</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(formChangeSummary).map(([form, info]) => (
            <div key={form} className={`card p-3 ${info.formStructureChanged ? 'border-t-2 border-accent' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-primary">{form}</span>
                {info.formStructureChanged && (
                  <span className="badge-new text-[9px]">Form Changed</span>
                )}
              </div>
              <ul className="space-y-1">
                {info.significantChanges.map((c, i) => (
                  <li key={i} className="text-xs text-text-muted flex items-start gap-1">
                    <ArrowRight size={10} className="text-primary flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed changes */}
      <div className="space-y-3">
        <h3 className="font-bold text-text-main mb-1">All Changes (Detailed)</h3>
        {changes.map((change) => {
          const style = PRIORITY_STYLE[change.priority] || PRIORITY_STYLE.medium
          return (
            <div
              key={change.changeId}
              className={`card p-4 border-l-4 ${style.bg}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.label}
                  </span>
                  <span className="text-xs text-text-muted">{change.changeId}</span>
                  {change.isNewForFY202526 && (
                    <span className="badge-new text-[9px]">FY25-26 New</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(change.affectedForms || []).map((f) => (
                    <span key={f} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-text-main text-sm leading-snug mb-1">
                {change.title}
              </h4>

              <p className="text-xs text-text-muted leading-relaxed mb-2">{change.summary}</p>

              {change.practicalImplication && (
                <div className="text-xs bg-white/60 border border-border-light rounded p-2 mt-2">
                  <span className="font-semibold text-text-main">Practical: </span>
                  {change.practicalImplication}
                </div>
              )}

              {change.importantCaveat && (
                <div className="text-xs bg-red-50 border border-red-200 rounded p-2 mt-2 text-red-800">
                  <span className="font-semibold">Caveat: </span>
                  {change.importantCaveat}
                </div>
              )}

              {change.conditions && (
                <ul className="mt-2 space-y-0.5">
                  {change.conditions.map((c, i) => (
                    <li key={i} className="text-xs text-text-muted flex items-start gap-1">
                      <CheckCircle2 size={10} className="text-success flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 text-[10px] text-text-muted">
                {change.section} · {change.legalReference}
                {change.effectiveFrom && ` · Effective: ${change.effectiveFrom}`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DEDUCTION MATRIX section ──────────────────────────────────────────────────
function DeductionMatrixSection() {
  const { deductions, regimeKey } = deductionMatrix
  const forms = ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'ITR-5', 'ITR-6', 'ITR-7']

  const regimeBadge = (regime) => {
    if (!regime) return null
    if (regime === 'old') return <span className="text-[9px] bg-gray-200 text-text-muted px-1 rounded">Old only</span>
    if (regime === 'new') return <span className="text-[9px] bg-primary/20 text-primary px-1 rounded">New only</span>
    if (regime === 'both') return <span className="text-[9px] bg-green-100 text-success px-1 rounded">Both</span>
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Deduction Matrix — FY 2025-26</h2>
        <p className="section-subtitle">{deductionMatrix.description}</p>
      </div>

      {/* Regime legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(regimeKey).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            {regimeBadge(key === 'NA' ? null : key)}
            <span className="text-xs text-text-muted">{val}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-primary/5">
              <th className="border border-border-light px-3 py-2 text-left font-bold text-text-main sticky left-0 bg-primary/5 min-w-[200px]">
                Section / Deduction
              </th>
              <th className="border border-border-light px-3 py-2 text-left font-bold text-text-main min-w-[120px]">
                Max Limit
              </th>
              {forms.map((f) => (
                <th
                  key={f}
                  className="border border-border-light px-2 py-2 text-center font-bold text-primary min-w-[65px]"
                >
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deductions.map((ded, i) => (
              <tr key={ded.sectionId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                <td className="border border-border-light px-3 py-2 sticky left-0 bg-inherit">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-bold text-primary">{ded.sectionId}</span>
                    {ded.isNewForFY202526 && <span className="badge-new text-[9px]">NEW</span>}
                  </div>
                  <div className="text-text-muted text-[10px] mt-0.5 leading-snug">
                    {ded.name.length > 60 ? ded.name.slice(0, 60) + '…' : ded.name}
                  </div>
                </td>
                <td className="border border-border-light px-3 py-2 font-semibold text-text-main">
                  {typeof ded.maxLimit === 'number'
                    ? fmt(ded.maxLimit)
                    : ded.maxLimit || '—'}
                  {ded.maxLimitNote && (
                    <div className="text-[10px] text-text-muted font-normal mt-0.5 leading-snug">
                      {ded.maxLimitNote.length > 50
                        ? ded.maxLimitNote.slice(0, 50) + '…'
                        : ded.maxLimitNote}
                    </div>
                  )}
                </td>
                {forms.map((f) => {
                  const app = ded.formApplicability?.[f]
                  const avail = app?.available
                  return (
                    <td
                      key={f}
                      className={`border border-border-light px-2 py-2 text-center ${
                        avail === false
                          ? 'bg-gray-100 text-text-muted'
                          : app?.regime === 'both'
                          ? 'bg-green-50 text-success'
                          : app?.regime === 'old'
                          ? 'bg-gray-50 text-text-main'
                          : 'bg-blue-50 text-primary'
                      }`}
                      title={app?.note || app?.regime || ''}
                    >
                      {avail === false ? (
                        <span className="text-gray-400">N/A</span>
                      ) : (
                        <div>
                          <span className="font-bold">✓</span>
                          <div className="mt-0.5">{regimeBadge(app?.regime)}</div>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main Page Component ───────────────────────────────────────────────────────
const SECTION_COMPONENTS = {
  'dates':            DatesSection,
  'tax-slabs':        TaxSlabsSection,
  'form-matrix':      FormMatrixSection,
  'schedule-matrix':  ScheduleMatrixSection,
  'tds-rates':        TdsRatesSection,
  'changes':          ChangesSection,
  'deduction-matrix': DeductionMatrixSection,
}

export default function ReferencePage() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const activeSectionId = sectionId || 'dates'

  // Navigate to default if unknown sectionId
  useEffect(() => {
    if (sectionId && !SECTION_COMPONENTS[sectionId]) {
      navigate('/reference/dates', { replace: true })
    }
  }, [sectionId, navigate])

  const activeSection = SECTIONS.find((s) => s.id === activeSectionId)
  const ActiveComponent = SECTION_COMPONENTS[activeSectionId]

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Reference', to: '/reference' },
            { label: activeSection?.label || activeSectionId },
          ]}
        />

        {/* Mobile sidebar toggle */}
        <button
          className="sm:hidden mb-4 btn-ghost flex items-center gap-2 text-sm"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          <BookOpen size={16} />
          {sidebarOpen ? 'Hide Sections' : 'Browse Sections'}
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
                Reference Data
              </div>
              <nav className="space-y-0.5">
                {SECTIONS.map(({ id, label, icon: Icon, iconColor }) => {
                  const isActive = id === activeSectionId
                  return (
                    <Link
                      key={id}
                      to={`/reference/${id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-primary text-white font-semibold shadow-sm'
                          : 'text-text-main hover:bg-gray-100 hover:text-primary'
                      }`}
                    >
                      <Icon size={15} className={isActive ? 'text-white' : iconColor} />
                      <span className="leading-tight">{label}</span>
                      {isActive && <ChevronRight size={13} className="ml-auto" />}
                    </Link>
                  )
                })}
              </nav>

              {/* FY badge */}
              <div className="mt-4 mx-2 py-2 px-3 bg-accent/10 border border-accent/30 rounded-lg text-center">
                <div className="text-xs font-bold text-accent">FY 2025-26</div>
                <div className="text-xs text-text-muted">Finance Act 2025</div>
              </div>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {!ActiveComponent ? (
              <div className="card p-8 text-center">
                <AlertTriangle size={40} className="text-warning mx-auto mb-3" />
                <h2 className="text-xl font-bold text-text-main mb-2">Section Not Found</h2>
                <p className="text-text-muted mb-4">
                  The requested reference section could not be loaded.
                </p>
                <Link to="/reference/dates" className="btn-primary">
                  View Key Dates
                </Link>
              </div>
            ) : (
              <div className="card p-5 sm:p-6">
                <ActiveComponent />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

