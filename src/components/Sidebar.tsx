import { LayoutDashboard, List, Lightbulb } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import RoleDropdown from './RoleDropdown';
import logoUrl from '../assets/FinFlow.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & Charts' },
  { id: 'transactions' as const, label: 'Transactions', icon: List, desc: 'All Activity' },
  { id: 'insights' as const, label: 'Insights', icon: Lightbulb, desc: 'Smart Analysis' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, role, setRole, theme, setTheme } = useAppStore();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <img src={logoUrl} alt="FinFlow Logo" className="logo-image" />
            <span className="logo-text">FinFlow</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="nav-label">Navigation</span>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => { setActiveTab(id); onClose(); }}
              id={`nav-${id}`}
            >
              <span className="nav-icon"><Icon size={18} /></span>
              {label}
            </button>
          ))}
        </nav>

        {/* Footer Controls */}
        <div className="sidebar-footer">
          {/* Theme Toggle */}
          <div className="theme-toggle">
            <span className="theme-toggle-label">
              {theme === 'dark' ? '🌑' : '☀️'}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <label className="toggle-switch" htmlFor="theme-toggle-input">
              <input
                id="theme-toggle-input"
                type="checkbox"
                checked={theme === 'light'}
                onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Role Switcher */}
          <RoleDropdown role={role} onChange={setRole} />
        </div>
      </aside>
    </>
  );
}
