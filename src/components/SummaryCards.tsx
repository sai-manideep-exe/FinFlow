import { formatCurrency } from '../utils/finance';
import type { Summary } from '../types';

interface SummaryCardsProps {
  summary: Summary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      key: 'balance',
      label: 'Total Balance',
      value: formatCurrency(summary.totalBalance),
      icon: '💎',
      sub: 'Net worth this period',
      progress: null,
    },
    {
      key: 'income',
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: '📈',
      sub: 'All income sources',
      progress: null,
    },
    {
      key: 'expense',
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: '📉',
      sub: 'Total money spent',
      progress: null,
    },
    {
      key: 'savings',
      label: 'Savings Rate',
      value: `${summary.savingsRate.toFixed(1)}%`,
      icon: '🎯',
      sub: 'Of your income saved',
      progress: Math.min(summary.savingsRate, 100),
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div className={`summary-card ${card.key}`} key={card.key} id={`summary-${card.key}`}>
          <div className="summary-card-header">
            <span className="summary-card-label">{card.label}</span>
            <div className={`summary-card-icon ${card.key}`}>{card.icon}</div>
          </div>
          <div className={`summary-card-value ${card.key}`}>{card.value}</div>
          <div className="summary-card-sub">{card.sub}</div>
          {card.progress !== null && (
            <div className="progress-bar-wrap">
              <div className="progress-bar-label">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${card.progress}%`,
                    background: card.progress >= 30
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #f59e0b, #f97316)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
