import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', shortLabel: 'Home' },
  { path: '/tournaments', label: 'Tournaments', shortLabel: 'Tourneys' },
  { path: '/friendly', label: 'Point Tracker', shortLabel: 'Tracker' },
  { path: '/players', label: 'Players', shortLabel: 'Players' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-dark-surface border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14">
        <Link to="/" className="text-accent-light font-bold text-xl mr-4 md:mr-8 tracking-wide shrink-0">
          Rifting
        </Link>
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map(item => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-accent/20 text-accent-light'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
