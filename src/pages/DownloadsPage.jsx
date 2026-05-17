import { ExternalLink, Download, FileText, FileJson, FileCheck, AlertCircle, Info, Phone, Clock, Monitor } from 'lucide-react'

const FORMS = [
  {
    id: 'itr1',
    name: 'ITR-1',
    popularName: 'Sahaj',
    color: 'bg-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
    status: 'live',
    eligibility: [
      'Resident individuals (including RNOR)',
      'Total income up to ₹50 lakh',
      'Income from salary, up to 2 house properties, other sources',
      'LTCG u/s 112A up to ₹1.25 lakh',
      'Agricultural income up to ₹5,000',
    ],
    downloads: [
      {
        label: 'Utility (Excel-based)',
        type: 'ZIP',
        size: '4 MB',
        version: '1.0',
        icon: Download,
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-05/ITR1_AY_26-27_V1.0.zip',
      },
      {
        label: 'Schema',
        type: 'JSON',
        size: '145 KB',
        version: '1.0',
        icon: FileJson,
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-05/ITR-1_2026_Main_V1.0_0.json',
      },
      {
        label: 'Validation Rules',
        type: 'PDF',
        size: '543 KB',
        version: 'Latest',
        icon: FileCheck,
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-05/CBDT_e-Filing_ITR%201_Validation%20Rules_AY%202026-27.pdf',
      },
    ],
    releaseDate: '15-May-2026',
  },
  {
    id: 'itr4',
    name: 'ITR-4',
    popularName: 'Sugam',
    color: 'bg-teal-500',
    badgeColor: 'bg-teal-100 text-teal-800',
    status: 'live',
    eligibility: [
      'Resident Individuals, HUFs, and Firms (other than LLP)',
      'Presumptive income u/s 44AD, 44ADA, or 44AE',
      'Total income up to ₹50 lakh',
      'Up to 2 house properties',
      'LTCG u/s 112A up to ₹1.25 lakh',
    ],
    downloads: [
      {
        label: 'Utility (Excel-based)',
        type: 'ZIP',
        size: '5 MB',
        version: '1.0',
        icon: Download,
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-05/ITR4_AY_26-27_V1.0.zip',
      },
      {
        label: 'Schema',
        type: 'JSON',
        size: '245 KB',
        version: '1.0',
        icon: FileJson,
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-05/ITR-4_2026_Main_V1.0_0.json',
      },
      {
        label: 'Validation Rules',
        type: 'PDF',
        size: '637 KB',
        version: 'Latest',
        icon: FileCheck,
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-05/CBDT_e-Filing_ITR%204_Validation%20Rules_AY%202026-27.pdf',
      },
    ],
    releaseDate: '15-May-2026',
  },
]

const COMING_SOON = [
  { name: 'ITR-2', desc: 'Capital gains, directors, NRIs, multiple HPs', color: 'bg-purple-500' },
  { name: 'ITR-3', desc: 'Business/professional income with actual books', color: 'bg-indigo-500' },
  { name: 'ITR-5', desc: 'Partnership firms, LLPs, AOP, BOI', color: 'bg-cyan-600' },
  { name: 'ITR-6', desc: 'Companies not claiming Section 11 exemption', color: 'bg-slate-600' },
  { name: 'ITR-7', desc: 'Charitable trusts, political parties, universities', color: 'bg-rose-600' },
]

const TYPE_COLORS = {
  ZIP: 'bg-orange-100 text-orange-700',
  JSON: 'bg-green-100 text-green-700',
  PDF: 'bg-red-100 text-red-700',
}

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#0d2060] text-white py-12 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AY 2026-27 Utilities Live
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Downloads — AY 2026-27
          </h1>
          <p className="text-blue-200 text-lg mb-1">
            Offline Utilities for Income Tax Returns (FY 2025-26)
          </p>
          <p className="text-blue-300 text-sm">
            Source: Income Tax Department e-Filing Portal &nbsp;·&nbsp; Last Updated: 15-May-2026
          </p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">

        {/* Notice banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Partial release — </span>
            Currently only ITR-1 (Sahaj) and ITR-4 (Sugam) offline utilities are available for AY 2026-27.
            ITR-2, ITR-3, ITR-5, ITR-6, and ITR-7 utilities will be released subsequently.
            Follow the{' '}
            <a
              href="https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-amber-900"
            >
              official portal
            </a>
            {' '}for updates.
          </div>
        </div>

        {/* Live form cards */}
        <section>
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            Available Now
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FORMS.map((form) => (
              <div key={form.id} className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 p-5 border-b border-border-light">
                  <div className={`${form.color} text-white rounded-xl px-3 py-1.5 font-bold text-lg`}>
                    {form.name}
                  </div>
                  <div>
                    <div className="font-bold text-text-main">{form.popularName}</div>
                    <div className="text-xs text-text-muted">Released: {form.releaseDate} &nbsp;·&nbsp; Version 1.0</div>
                  </div>
                  <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${form.badgeColor}`}>
                    Live
                  </span>
                </div>

                {/* Eligibility */}
                <div className="px-5 py-4 border-b border-border-light">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    <Info size={13} />
                    Eligibility
                  </div>
                  <ul className="space-y-1">
                    {form.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Downloads */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                    <Download size={13} />
                    Downloads
                  </div>
                  <div className="space-y-2">
                    {form.downloads.map((dl) => {
                      const Icon = dl.icon
                      return (
                        <a
                          key={dl.label}
                          href={dl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border-light hover:border-primary/30 hover:bg-primary/5 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className="text-primary flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                                {dl.label}
                              </div>
                              <div className="text-xs text-text-muted">v{dl.version} &nbsp;·&nbsp; {dl.size}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${TYPE_COLORS[dl.type]}`}>
                              {dl.type}
                            </span>
                            <ExternalLink size={14} className="text-text-muted group-hover:text-primary transition-colors" />
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <section>
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Clock size={18} className="text-text-muted" />
            Coming Soon
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {COMING_SOON.map((form) => (
              <div key={form.name} className="bg-white border border-border-light rounded-xl p-4 opacity-70">
                <div className={`${form.color} text-white rounded-lg px-2.5 py-1 font-bold text-sm inline-block mb-2`}>
                  {form.name}
                </div>
                <p className="text-xs text-text-muted">{form.desc}</p>
                <div className="mt-2 text-xs font-medium text-text-muted bg-gray-100 px-2 py-0.5 rounded inline-block">
                  Not yet available
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System requirements + Support side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* System Requirements */}
          <div className="bg-white rounded-2xl border border-border-light p-5">
            <h2 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <Monitor size={18} className="text-primary" />
              System Requirements
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary rounded-lg p-1.5 flex-shrink-0">
                  <FileText size={14} />
                </span>
                <div>
                  <div className="font-semibold text-text-main">Microsoft Excel 2016 or later</div>
                  <div className="text-text-muted">Genuine, licensed copy required. Macros must be enabled.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary rounded-lg p-1.5 flex-shrink-0">
                  <Monitor size={14} />
                </span>
                <div>
                  <div className="font-semibold text-text-main">Browser</div>
                  <div className="text-text-muted">Chrome, Firefox, Safari, or Microsoft Edge (latest versions)</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary rounded-lg p-1.5 flex-shrink-0">
                  <Monitor size={14} />
                </span>
                <div>
                  <div className="font-semibold text-text-main">Screen Resolution</div>
                  <div className="text-text-muted">1024 × 768 or higher recommended</div>
                </div>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <strong>Important:</strong> Macros must be enabled in Excel for the utility to function. Non-genuine or unlicensed copies of Excel may not work correctly.
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl border border-border-light p-5">
            <h2 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              Support &amp; Contact
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-text-main mb-1">e-Filing &amp; Centralized Processing Center</div>
                <div className="space-y-1 text-text-muted">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="flex-shrink-0" />
                    <span>1800-103-0025 &nbsp;/&nbsp; 1800-419-0025 (Toll free)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="flex-shrink-0" />
                    <span>+91-80-46122000 (International)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="flex-shrink-0" />
                    <span>8:00 AM – 8:00 PM, Monday to Friday</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border-light pt-4">
                <div className="font-semibold text-text-main mb-1">Tax Information Network (NSDL)</div>
                <div className="space-y-1 text-text-muted">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="flex-shrink-0" />
                    <span>+91-20-27218080</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="flex-shrink-0" />
                    <span>7:00 AM – 11:00 PM, All days</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border-light pt-4">
                <div className="font-semibold text-text-main mb-1">AIS and Reporting Portal</div>
                <div className="space-y-1 text-text-muted">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="flex-shrink-0" />
                    <span>1800-103-4215</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="flex-shrink-0" />
                    <span>9:30 AM – 6:00 PM, Monday to Friday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other resources */}
        <div className="bg-white rounded-2xl border border-border-light p-5">
          <h2 className="font-bold text-text-main mb-4 flex items-center gap-2">
            <ExternalLink size={18} className="text-primary" />
            Other Official Resources
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                label: 'Income Tax Returns Portal',
                desc: 'Official downloads portal for ITR utilities',
                url: 'https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns',
              },
              {
                label: 'Income Tax Forms',
                desc: 'Other income tax forms and challans',
                url: 'https://www.incometax.gov.in/iec/foportal/downloads/income-tax-forms',
              },
              {
                label: 'DSC Management Utility',
                desc: 'Digital Signature Certificate tool',
                url: 'https://www.incometax.gov.in/iec/foportal/downloads/dsc-management-utility',
              },
              {
                label: 'General Filing Instructions',
                desc: 'Detailed instructions for ITR filing',
                url: 'https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns/read-general-instrutions?destination=/iec/foportal/downloads/income-tax-returns',
              },
              {
                label: 'Notified ITRs (CBDT)',
                desc: 'Gazette notifications for ITR forms',
                url: 'https://incometaxindia.gov.in/Pages/downloads/income-tax-return.aspx',
              },
              {
                label: 'e-Filing Portal',
                desc: 'File your ITR online at the official portal',
                url: 'https://www.incometax.gov.in',
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 p-3 rounded-xl border border-border-light hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <ExternalLink size={15} className="text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{link.label}</div>
                  <div className="text-xs text-text-muted">{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-text-muted text-center pb-4">
          Downloads link directly to the official Income Tax Department e-Filing Portal. This page is a reference guide — always verify with{' '}
          <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="underline">
            incometax.gov.in
          </a>{' '}
          for the latest versions.
        </p>
      </div>
    </div>
  )
}
