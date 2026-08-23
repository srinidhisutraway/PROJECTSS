import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

const Topbar: React.FC<{ title?: string }> = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-white/70 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-canvas-dark/70 lg:pl-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink dark:text-canvas">{title || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search skin conditions, symptoms, articles…"
            className="input-field w-64 !py-2 pl-9"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 dark:border-white/15" aria-label="Notifications">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-clay-500" />
        </button>

        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-ink/10 py-1 pl-1 pr-3 dark:border-white/15"
          >
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 font-display text-sm font-semibold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                {user?.name?.charAt(0)}
              </div>
            )}
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <div className="glass-card absolute right-0 mt-2 w-48 overflow-hidden p-1">
              <button
                onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-ink/5 dark:hover:bg-white/5"
              >
                <UserIcon size={15} /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-clay-600 hover:bg-clay-50 dark:hover:bg-clay-500/10"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
