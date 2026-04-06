import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import SummaryCards from '../components/SummaryCards';
import { BalanceTrendChart, SpendingDonutChart } from '../components/Charts';
import { computeSummary, computeCategoryBreakdown, computeDailyBalances } from '../utils/finance';

export default function DashboardPage() {
  const { transactions } = useAppStore();

  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const breakdown = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);
  const dailyBalances = useMemo(() => computeDailyBalances(transactions), [transactions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Summary Cards */}
      <section aria-label="Financial Summary">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <h2 className="section-title">Financial Overview</h2>
            <p className="section-subtitle">Your money at a glance, all in one place.</p>
          </div>
        </div>
        <SummaryCards summary={summary} />
      </section>

      {/* Charts */}
      <section aria-label="Financial Charts">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <h2 className="section-title">Visualizations</h2>
            <p className="section-subtitle">Trends and category breakdowns.</p>
          </div>
        </div>
        <div className="charts-grid">
          {/* Balance Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">💹 Balance Trend</div>
                <div className="chart-subtitle">Rolling balance, income vs expenses</div>
              </div>
              <span className="chart-badge">Area Chart</span>
            </div>
            <BalanceTrendChart data={dailyBalances} />
          </div>

          {/* Spending Breakdown */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">🍩 Spending Breakdown</div>
                <div className="chart-subtitle">Where your money goes</div>
              </div>
              <span className="chart-badge">Donut</span>
            </div>
            <SpendingDonutChart data={breakdown} />
          </div>
        </div>
      </section>
    </div>
  );
}
