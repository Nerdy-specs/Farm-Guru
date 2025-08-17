import { Link, NavLink } from 'react-router-dom';
import { Sprout, User2, Menu } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative overflow-hidden bg-gradient-forest text-white">
      <div className="px-4 py-4 sm:py-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-lg">
            <div className="bg-accent/20 p-2 rounded-xl">
              <Sprout className="h-7 w-7 text-accent" />
            </div>
            <span className="text-xl sm:text-2xl font-semibold">FarmGuru</span>
          </Link>

          <button className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/70" onClick={() => setOpen(v => !v)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>

          <nav className={`hidden md:flex items-center gap-5 text-white/90`}>
            <NavLink to="/query" className={({isActive}) => isActive ? 'font-semibold' : ''}>Query</NavLink>
            <NavLink to="/weather" className={({isActive}) => isActive ? 'font-semibold' : ''}>Weather</NavLink>
            <NavLink to="/market" className={({isActive}) => isActive ? 'font-semibold' : ''}>Market</NavLink>
            <NavLink to="/schemes" className={({isActive}) => isActive ? 'font-semibold' : ''}>Schemes</NavLink>
            <NavLink to="/community" className={({isActive}) => isActive ? 'font-semibold' : ''}>Community</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <NavLink to="/profile" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/70" aria-label="Profile">
              <User2 className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
        {open && (
          <div className="md:hidden mt-3 flex flex-col gap-3">
            <nav className="flex flex-col gap-2 text-white/90">
              <NavLink to="/query" onClick={() => setOpen(false)}>Query</NavLink>
              <NavLink to="/weather" onClick={() => setOpen(false)}>Weather</NavLink>
              <NavLink to="/market" onClick={() => setOpen(false)}>Market</NavLink>
              <NavLink to="/schemes" onClick={() => setOpen(false)}>Schemes</NavLink>
              <NavLink to="/community" onClick={() => setOpen(false)}>Community</NavLink>
              <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <NavLink to="/profile" onClick={() => setOpen(false)} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/70" aria-label="Profile">
                <User2 className="w-5 h-5" />
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;