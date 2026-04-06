import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { DailyBalance, CategoryBreakdown } from '../types';
import { formatCurrency } from '../utils/finance';

/* ---- Area Chart (Balance Trend) ---- */

function CustomAreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p: any) => (
        <div className="tooltip-row" key={p.dataKey}>
          <span className="tooltip-dot" style={{ background: p.color }} />
          <span>{p.name}: {formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

interface BalanceTrendChartProps {
  data: DailyBalance[];
}

export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">No Chart Data</div>
        <div className="empty-state-desc">Add some transactions to see the trend.</div>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          width={50}
        />
        <Tooltip content={<CustomAreaTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          name="Balance"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#balanceGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: 'var(--bg-card)' }}
        />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#10b981"
          strokeWidth={1.5}
          fill="url(#incomeGrad)"
          dot={false}
          strokeDasharray="4 2"
          activeDot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'var(--bg-card)' }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="#f43f5e"
          strokeWidth={1.5}
          fill="url(#expenseGrad)"
          dot={false}
          strokeDasharray="4 2"
          activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: 'var(--bg-card)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---- Donut Chart (Spending Breakdown) ---- */
interface SpendingDonutChartProps {
  data: CategoryBreakdown[];
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{d.category}</div>
      <div className="tooltip-row">
        <span className="tooltip-dot" style={{ background: d.color }} />
        <span>{formatCurrency(d.amount)} ({d.percentage.toFixed(1)}%)</span>
      </div>
    </div>
  );
}

export function SpendingDonutChart({ data }: SpendingDonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <div className="empty-state-icon">🍩</div>
        <div className="empty-state-title">No Expense Data</div>
      </div>
    );
  }

  const top = data.slice(0, 7);
  const REST_COLOR = '#6b7280';
  const restAmount = data.slice(7).reduce((s, d) => s + d.amount, 0);
  const chartData = restAmount > 0
    ? [...top, { category: 'Other', amount: restAmount, percentage: 0, color: REST_COLOR }]
    : top;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={3}
            dataKey="amount"
            animationBegin={0}
            animationDuration={900}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-legend">
        {chartData.map((entry) => (
          <div className="legend-item" key={entry.category}>
            <div className="legend-left">
              <span className="legend-dot" style={{ background: entry.color }} />
              <span className="legend-name">{entry.category}</span>
            </div>
            <div className="legend-right">
              <span className="legend-amount">{formatCurrency(entry.amount)}</span>
              <span className="legend-pct">{entry.percentage.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
