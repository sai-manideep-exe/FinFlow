import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: '📊 Dashboard', subtitle: 'Your financial world, visualized.' },
  transactions: { title: '🧾 Transactions', subtitle: 'Track every cent in and out.' },
  insights: { title: '💡 Insights', subtitle: 'Smart patterns from your spending.' },
};

export default function App() {
  const { activeTab, theme } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const pageInfo = PAGE_TITLES[activeTab];

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="topbar-title">{pageInfo.title}</div>
              <div className="topbar-subtitle">{pageInfo.subtitle}</div>
            </div>
          </div>
          <div className="topbar-actions">
            <span style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontWeight: 500,
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content" role="main">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'transactions' && <TransactionsPage />}
          {activeTab === 'insights' && <InsightsPage />}
        </main>
      </div>
    </div>
  );
}
