import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-black text-volt-400">VOLTZ</span>
            <p className="mt-3 text-sm text-white/40 leading-relaxed">
              Next-gen electronics for the tech-obsessed.
            </p>
          </div>
          {[
            { heading: 'Shop', links: ['Phones', 'Laptops', 'Audio', 'Wearables', 'Accessories'] },
            { heading: 'Support', links: ['FAQ', 'Shipping', 'Returns', 'Warranty', 'Contact'] },
            { heading: 'Company', links: ['About', 'Careers', 'Press', 'Privacy', 'Terms'] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-xs font-mono font-medium text-white/30 uppercase tracking-widest mb-4">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to={`/products?category=${link.toLowerCase()}`}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 font-mono">
            © {new Date().getFullYear()} VOLTZ. All rights reserved.
          </p>
          <p className="text-xs text-white/25 font-mono">
            Built with React + Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
