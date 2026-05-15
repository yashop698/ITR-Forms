import { Link } from 'react-router-dom'
import { FileText, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-accent rounded-lg p-1.5">
                <FileText size={18} />
              </div>
              <span className="font-bold">ITR Filing Guide</span>
            </div>
            <p className="text-blue-200 text-sm">
              Comprehensive FY 2025-26 (AY 2026-27) Income Tax Return knowledge base.
              Professional reference for CA firms and tax practitioners.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-3 text-accent">Quick Links</h3>
            <ul className="space-y-1.5 text-sm text-blue-200">
              <li><Link to="/selector" className="hover:text-white transition-colors">ITR Form Selector</Link></li>
              <li><Link to="/forms/itr1" className="hover:text-white transition-colors">ITR-1 (Sahaj)</Link></li>
              <li><Link to="/forms/itr4" className="hover:text-white transition-colors">ITR-4 (Sugam)</Link></li>
              <li><Link to="/procedures" className="hover:text-white transition-colors">Post-Filing Procedures</Link></li>
              <li><Link to="/reference" className="hover:text-white transition-colors">Key Dates & Deadlines</Link></li>
            </ul>
          </div>

          {/* Official links */}
          <div>
            <h3 className="font-semibold mb-3 text-accent">Official Resources</h3>
            <ul className="space-y-1.5 text-sm text-blue-200">
              <li>
                <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1">
                  e-Filing Portal <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.cbdt.gov.in" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1">
                  CBDT Official <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-blue-300 text-xs">
            © 2025-26 ITR Filing Guide. For professional reference only. Always verify with official CBDT notifications.
          </p>
          <p className="text-blue-300 text-xs">
            Finance Act 2025 | AY 2026-27
          </p>
        </div>
      </div>
    </footer>
  )
}
