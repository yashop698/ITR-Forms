import { Link } from 'react-router-dom'
import {
  GitBranch, FileText, Search, Calendar, ChevronRight, Star,
  AlertTriangle, CheckCircle, TrendingUp, Users, Shield, Zap, ArrowRight, Download
} from 'lucide-react'

const FORMS = [
  { id: 'itr1', name: 'ITR-1', popular: 'Sahaj', desc: 'Salaried individuals, pension, one house property', color: 'bg-blue-500', who: 'Resident Individual' },
  { id: 'itr2', name: 'ITR-2', popular: null, desc: 'Capital gains, directors, NRIs, multiple HPs', color: 'bg-purple-500', who: 'Individual / HUF' },
  { id: 'itr3', name: 'ITR-3', popular: null, desc: 'Business/professional income with actual books', color: 'bg-indigo-500', who: 'Individual / HUF' },
  { id: 'itr4', name: 'ITR-4', popular: 'Sugam', desc: 'Presumptive income u/s 44AD/44ADA/44AE', color: 'bg-teal-500', who: 'Individual / HUF / Firm' },
  { id: 'itr5', name: 'ITR-5', popular: null, desc: 'Partnership firms, LLPs, AOP, BOI', color: 'bg-cyan-600', who: 'Firms / LLP / AOP' },
  { id: 'itr6', name: 'ITR-6', popular: null, desc: 'Companies not claiming Section 11 exemption', color: 'bg-slate-600', who: 'Companies' },
  { id: 'itr7', name: 'ITR-7', popular: null, desc: 'Charitable trusts, political parties, universities', color: 'bg-rose-600', who: 'Trusts / Universities' },
]

const KEY_CHANGES = [
  { id: 'FA25-001', desc: 'Zero tax up to ₹12L under new regime (87A rebate ₹60K)', tag: 'New Regime' },
  { id: 'FA25-012', desc: 'ITR-1 expanded to 2 house properties (from 1)', tag: 'ITR-1 NEW' },
  { id: 'FA25-013', desc: 'ITR-1 now allows LTCG 112A within ₹1.25L exemption', tag: 'ITR-1 NEW' },
  { id: 'FA25-003', desc: 'ITR-4 expanded to 2 house properties (from 1)', tag: 'ITR-4' },
  { id: 'FA25-004', desc: 'ITR-4 allows LTCG 112A within ₹1.25L exemption', tag: 'ITR-4' },
  { id: 'FA25-005', desc: 'Mandatory cash/bank balance disclosure in Schedule BP', tag: 'ITR-4 NEW' },
  { id: 'FA25-007', desc: '80CCD(2) employer NPS limit raised to 14% (from 10%)', tag: 'Deductions' },
]

const STATS = [
  { value: '7', label: 'ITR Forms', icon: FileText },
  { value: '40+', label: 'Worked Scenarios', icon: TrendingUp },
  { value: '61', label: 'Knowledge Files', icon: Shield },
  { value: '100%', label: 'FY 2025-26 Updated', icon: CheckCircle },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#0d2060] text-white py-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-3 py-1 rounded-full text-sm font-semibold mb-4">
              <Star size={14} />
              Finance Act 2025 — Updated
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              FY 2025-26 Income Tax Return (ITR) Filing Guide
            </h1>
            <p className="text-xl text-blue-200 mb-2">
              Complete Knowledge Base for AY 2026-27
            </p>
            <p className="text-blue-300 mb-8 text-lg">
              Professional. Comprehensive. Up-to-date with CBDT Changes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/selector" className="btn-accent">
                <GitBranch size={18} />
                Start ITR Selector
              </Link>
              <Link to="/forms/itr1" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                <FileText size={18} />
                Browse All Forms
              </Link>
              <Link
                to="/reference/dates"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
              >
                <Calendar size={18} />
                View Deadlines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-border-light">
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-text-main">{value}</div>
                  <div className="text-xs text-text-muted">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* FY 2025-26 Key Changes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <AlertTriangle size={22} className="text-warning" />
                FY 2025-26 Key Changes
              </h2>
              <p className="section-subtitle">Finance Act 2025 — Critical updates for this assessment year</p>
            </div>
            <Link to="/reference/changes" className="btn-ghost text-sm hidden sm:flex">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {KEY_CHANGES.map((change) => (
              <div key={change.id} className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <Zap size={13} className="text-accent-dark" />
                </div>
                <div>
                  <span className="text-xs font-bold text-accent-dark bg-accent/10 px-2 py-0.5 rounded-full">
                    {change.tag}
                  </span>
                  <p className="text-sm text-text-main mt-1">{change.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ITR Forms Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">All ITR Forms</h2>
              <p className="section-subtitle">Select the form to view eligibility, schedules, worked examples & red flags</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FORMS.map((form) => (
              <Link
                key={form.id}
                to={`/forms/${form.id}`}
                className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${form.color} text-white rounded-xl px-3 py-1.5 font-bold text-lg`}>
                    {form.name}
                  </div>
                  {form.popular && (
                    <span className="text-xs font-bold text-accent-dark bg-accent/10 px-2 py-0.5 rounded-full">
                      {form.popular}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-main mb-2 font-medium">{form.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Users size={12} /> {form.who}
                  </span>
                  <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-12">
          <h2 className="section-title mb-4">Quick Access</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/selector" className="card p-5 hover:shadow-md transition-all hover:border-primary/30 group">
              <GitBranch size={28} className="text-primary mb-3" />
              <h3 className="font-bold text-text-main mb-1">ITR Form Selector</h3>
              <p className="text-sm text-text-muted">3-step wizard to find your correct ITR form</p>
            </Link>
            <Link to="/income" className="card p-5 hover:shadow-md transition-all hover:border-success/30 group">
              <TrendingUp size={28} className="text-success mb-3" />
              <h3 className="font-bold text-text-main mb-1">Income Guides</h3>
              <p className="text-sm text-text-muted">Salary, House Property, Capital Gains, Business</p>
            </Link>
            <Link to="/deductions" className="card p-5 hover:shadow-md transition-all hover:border-accent/30 group">
              <Shield size={28} className="text-accent-dark mb-3" />
              <h3 className="font-bold text-text-main mb-1">Deduction Guides</h3>
              <p className="text-sm text-text-muted">80C, 80CCD, 80D, 80G and all other sections</p>
            </Link>
            <Link to="/procedures" className="card p-5 hover:shadow-md transition-all hover:border-warning/30 group">
              <CheckCircle size={28} className="text-warning mb-3" />
              <h3 className="font-bold text-text-main mb-1">Post-Filing</h3>
              <p className="text-sm text-text-muted">E-verify, revised returns, notices, refunds</p>
            </Link>
          </div>
        </section>

        {/* Downloads Banner */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    Live — Released 15-May-2026
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <Download size={20} />
                  AY 2026-27 Offline Utilities Available
                </h2>
                <p className="text-emerald-100 text-sm mb-2">
                  ITR-1 (Sahaj) and ITR-4 (Sugam) Excel utilities, JSON schemas &amp; validation PDFs now live.
                  ITR-2, 3, 5, 6, 7 coming soon.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-white/20 px-2.5 py-1 rounded-full">ITR-1 v1.0 · 4 MB ZIP</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-full">ITR-4 v1.0 · 5 MB ZIP</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-full">Excel 2016+ required</span>
                </div>
              </div>
              <Link to="/downloads" className="flex items-center gap-2 bg-white text-teal-700 font-bold px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors flex-shrink-0 shadow">
                <Download size={18} />
                View Downloads
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Key Dates Banner */}
        <section className="mb-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Calendar size={22} className="text-accent" />
                Important Dates — FY 2025-26
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-blue-200">
                <div><span className="text-white font-medium">ITR Filing:</span> July 31, 2026</div>
                <div><span className="text-white font-medium">Tax Audit:</span> Oct 31, 2026</div>
                <div><span className="text-white font-medium">Belated Return:</span> Dec 31, 2026</div>
                <div><span className="text-white font-medium">Revised Return:</span> Mar 31, 2027</div>
                <div><span className="text-white font-medium">E-Verify:</span> 30 days from filing</div>
                <div><span className="text-white font-medium">Transfer Pricing:</span> Nov 30, 2026</div>
              </div>
            </div>
            <Link to="/reference/dates" className="btn-accent flex-shrink-0">
              Full Calendar <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
