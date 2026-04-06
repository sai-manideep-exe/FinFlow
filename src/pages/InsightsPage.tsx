import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { computeInsights, computeSummary, computeCategoryBreakdown } from '../utils/finance';
import { formatCurrency } from '../utils/finance';

export default function InsightsPage() {
  const { transactions } = useAppStore();
  const insights = useMemo(() => computeInsights(transactions), [transactions]);
  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const breakdown = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);

  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type === 'expense').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <section>
        <h1 className="section-title">Smart Insights</h1>
        <p className="section-subtitle" style={{ marginTop: 4 }}>
          AI-powered observations about your financial health.
        </p>
      </section>

      {/* Quick Stats Strip */}
      <div className="insights-stats-grid">
        {[
          { label: 'Total Transactions', value: transactions.length, icon: '🧾', color: 'var(--accent-tertiary)' },
          { label: 'Income Events', value: incomeCount, icon: '📈', color: 'var(--income-color)' },
          { label: 'Expense Events', value: expenseCount, icon: '📉', color: 'var(--expense-color)' },
          { label: 'Avg. Expense', value: formatCurrency(summary.totalExpenses / Math.max(expenseCount, 1)), icon: '📊', color: '#f59e0b' },
        ].map((stat) => (
          <div className="card" key={stat.label} style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, letterSpacing: '-0.5px', marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Insight Cards */}
      {insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔮</div>
          <div className="empty-state-title">Not Enough Data</div>
          <div className="empty-state-desc">Add more transactions to unlock financial insights.</div>
        </div>
      ) : (
        <section aria-label="Financial Insights">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: 17 }}>Your Observations</h2>
              <p className="section-subtitle">{insights.length} insights generated from your data</p>
            </div>
          </div>
          <div className="insights-grid">
            {insights.map((insight) => (
              <article className={`insight-card ${insight.type}`} key={insight.id}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-body">
                  <div className="insight-title">{insight.title}</div>
                  <div className="insight-desc">{insight.description}</div>
                  {insight.value && (
                    <div className={`insight-value ${insight.type}`}>{insight.value}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Category Breakdown Table */}
      {breakdown.length > 0 && (
        <section aria-label="Category breakdown">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: 17 }}>Category Deep Dive</h2>
              <p className="section-subtitle">Ranked by spending amount</p>
            </div>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div className="transactions-table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th style={{ textAlign: 'right' }}>% of Expenses</th>
                    <th>Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((b, i) => (
                    <tr key={b.category}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{i + 1}</td>
                      <td>
                        <span
                          className="category-pill"
                          style={{
                            background: `${b.color}18`,
                            color: b.color,
                            border: `1px solid ${b.color}30`,
                          }}
                        >
                          {b.category}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--expense-color)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(b.amount)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {b.percentage.toFixed(1)}%
                      </td>
                      <td className="insights-bar-cell" style={{ minWidth: 80 }}>
                        <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${b.percentage}%`,
                              background: b.color,
                              borderRadius: 3,
                              transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
