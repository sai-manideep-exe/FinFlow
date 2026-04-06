import { useState, useRef, useEffect } from 'react';
import type { Role } from '../types';

interface RoleDropdownProps {
  role: Role;
  onChange: (role: Role) => void;
}

const options: { value: Role; label: string; icon: string; badge: string; badgeIcon: string }[] = [
  { value: 'admin', label: 'Admin', icon: '👑', badge: 'Full Access', badgeIcon: '🛡️' },
  { value: 'viewer', label: 'Viewer', icon: '👁️', badge: 'Read Only', badgeIcon: '🔒' },
];

export default function RoleDropdown({ role, onChange }: RoleDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === role)!;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="role-card" ref={ref}>
      <span className="role-label">Current Role</span>

      {/* Trigger */}
      <button
        className="custom-select-trigger"
        onClick={() => setOpen((v) => !v)}
        id="role-select"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-value">
          <span>{current.icon}</span>
          <span>{current.label}</span>
        </span>
        <span className={`custom-select-arrow ${open ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="custom-select-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`custom-select-option ${role === opt.value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              role="option"
              aria-selected={role === opt.value}
              type="button"
            >
              <span className="custom-select-option-left">
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </span>
              {role === opt.value && (
                <span className="custom-select-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Badge */}
      <span className={`role-badge ${role}`}>
        {current.badgeIcon} {current.badge}
      </span>
    </div>
  );
}
