import { Link } from 'react-router-dom'
import {
  GitBranch, FileText, Search, Calendar, ChevronRight,
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
  { value: '7',    label: 'ITR Forms',        desc: 'Complete coverage' },
  { value: '40+',  label: 'Scenarios',         desc: 'Real-world examples' },
  { value: '61',   label: 'Knowledge Files',   desc: 'Comprehensive guides' },
  { value: '100%', label: 'Updated',           desc: 'FY 2025-26 compliant' },
]

const QUICK_ACCESS = [
  { to: '/selector',   icon: GitBranch,   color: 'text-primary',      hover: 'hover:border-primary/30',  title: 'ITR Form Selector',  desc: '3-step wizard to find your correct ITR form' },
  { to: '/income',     icon: TrendingUp,  color: 'text-success',      hover: 'hover:border-success/30',  title: 'Income Guides',      desc: 'Salary, House Property, Capital Gains, Business' },
  { to: '/deductions', icon: Shield,      color: 'text-accent-dark',  hover: 'hover:border-accent/30',   title: 'Deduction Guides',   desc: '80C, 80CCD, 80D, 80G and all other sections' },
  { to: '/procedures', icon: CheckCircle, color: 'text-warning',      hover: 'hover:border-warning/30',  title: 'Post-Filing',        desc: 'E-verify, revised returns, notices, refunds' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#fafaf8' }}>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1a3a7a 100%)',
          padding: '100px 40px 80px',
        }}
      >
        {/* Floating background blobs */}
        <div className="anim-float-right" style={{
          position: 'absolute', top: '10%', right: '8%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(217,119,87,0.15)', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div className="anim-float-left" style={{
          position: 'absolute', bottom: '10%', left: '8%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(217,119,87,0.10)', filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div className="anim-fade-in-down" style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(217,119,87,0.2)',
              border: '1px solid rgba(217,119,87,0.4)',
              color: '#ffd699',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              ✓ FY 2025-26 | AY 2026-27
            </span>
          </div>

          <h1 className="anim-fade-in-down-1" style={{
            fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 800,
            lineHeight: 1.2,
            color: 'white',
            marginBottom: 12,
          }}>
            File Your Income Tax Return<br />with Confidence
          </h1>

          <p className="anim-fade-in-down-2" style={{
            fontSize: 18, fontWeight: 300, color: 'white', marginBottom: 12,
          }}>
            Complete Knowledge Base for ITR Filing
          </p>

          <p className="anim-fade-in-down-3" style={{
            fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
            marginBottom: 40, maxWidth: 580, margin: '0 auto 40px',
          }}>
            Professional. Comprehensive. Up-to-date with CBDT &amp; Finance Act 2025 changes.
          </p>

          <Link
            to="/selector"
            className="anim-fade-in-up-4"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#ffc107', color: '#333',
              padding: '16px 40px', borderRadius: 8,
              fontWeight: 600, fontSize: 14,
              border: '2px solid #ffc107',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = '#ffc107'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(217,119,87,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ffc107'
              e.currentTarget.style.color = '#333'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <GitBranch size={18} />
            → Start ITR Selector
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ background: '#f5f5f5', padding: '0 40px 60px' }}>
        <div style={{
          maxWidth: 1200, margin: '-30px auto 0',
          background: 'white',
          borderRadius: 12,
          padding: '50px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          position: 'relative',
          zIndex: 10,
        }}>
          {STATS.map(({ value, label, desc }, i) => (
            <div
              key={label}
              className={`anim-slide-in-up-${i + 1}`}
              style={{ textAlign: 'center' }}
            >
              <span className="stat-number">{value}</span>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#999', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 60px' }}>

        {/* FY 2025-26 Key Changes */}
        <section style={{ marginBottom: 60, paddingTop: 60 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={26} style={{ color: '#ea580c' }} />
                FY 2025-26 Key Changes
              </h2>
              <p style={{ fontSize: 16, color: '#666' }}>Finance Act 2025 — Critical updates for this assessment year</p>
            </div>
            <Link to="/reference/changes" className="btn-ghost text-sm" style={{ flexShrink: 0 }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {KEY_CHANGES.map((change, i) => (
              <div key={change.id} className={`home-card anim-slide-in-up-${Math.min(i + 1, 4)}`} style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(217,119,87,0.15), rgba(42,111,219,0.15))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={16} style={{ color: '#ea580c' }} />
                </div>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#ea580c',
                    background: 'rgba(217,119,87,0.12)', padding: '3px 8px',
                    borderRadius: 999, display: 'inline-block', marginBottom: 6,
                  }}>
                    {change.tag}
                  </span>
                  <p style={{ fontSize: 13, color: '#1a1a1a', lineHeight: 1.6 }}>{change.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All ITR Forms */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>All ITR Forms</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
            Select the form to view eligibility, schedules, worked examples &amp; red flags
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FORMS.map((form, i) => (
              <Link
                key={form.id}
                to={`/forms/${form.id}`}
                className={`home-card anim-slide-in-up-${Math.min(i + 1, 4)}`}
                style={{ padding: 24, textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className={`${form.color} text-white`} style={{ borderRadius: 10, padding: '6px 14px', fontWeight: 700, fontSize: 17 }}>
                    {form.name}
                  </span>
                  {form.popular && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#ea580c',
                      background: 'rgba(217,119,87,0.12)', padding: '3px 8px', borderRadius: 999,
                    }}>
                      {form.popular}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#1a1a1a', marginBottom: 12, fontWeight: 500, lineHeight: 1.5 }}>{form.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={12} /> {form.who}
                  </span>
                  <ArrowRight size={15} style={{ color: '#2a6fdb', opacity: 0.7 }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Quick Access</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>Jump to the tools and guides you need most</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {QUICK_ACCESS.map(({ to, icon: Icon, color, title, desc }, i) => (
              <Link
                key={to}
                to={to}
                className={`home-card anim-slide-in-up-${i + 1}`}
                style={{ padding: 24, textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 10, marginBottom: 14,
                  background: 'linear-gradient(135deg, rgba(217,119,87,0.12), rgba(42,111,219,0.12))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} className={color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Downloads Banner */}
        <section style={{ marginBottom: 40 }}>
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

        {/* Key Dates */}
        <section style={{ marginBottom: 40 }}>
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
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
          </div>
        </section>

      </div>
    </div>
  )
}
