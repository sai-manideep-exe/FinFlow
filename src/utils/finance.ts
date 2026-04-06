import type { Transaction, CategoryBreakdown, DailyBalance, Summary, Insight } from '../types';
import { CATEGORY_COLORS } from '../data/mockData';
import { format, parseISO } from 'date-fns';

export function computeSummary(transactions: Transaction[]): Summary {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100) : 0;

  return { totalBalance, totalIncome, totalExpenses, savingsRate };
}

export function computeCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  return Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6b7280',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeDailyBalances(transactions: Transaction[]): DailyBalance[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dayMap: Record<string, { income: number; expenses: number }> = {};

  sorted.forEach((t) => {
    const day = format(parseISO(t.date), 'MMM dd');
    if (!dayMap[day]) dayMap[day] = { income: 0, expenses: 0 };
    if (t.type === 'income') dayMap[day].income += t.amount;
    else dayMap[day].expenses += t.amount;
  });

  let runningBalance = 0;
  return Object.entries(dayMap).map(([date, { income, expenses }]) => {
    runningBalance += income - expenses;
    return { date, balance: Math.round(runningBalance * 100) / 100, income, expenses };
  });
}

export function computeInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];
  const summary = computeSummary(transactions);
  const breakdown = computeCategoryBreakdown(transactions);

  // Highest spending category
  if (breakdown.length > 0) {
    const top = breakdown[0];
    insights.push({
      id: 'top-category',
      title: 'Top Spending Category',
      description: `You spent the most on ${top.category} (${top.percentage.toFixed(1)}% of expenses).`,
      type: 'neutral',
      icon: '🔥',
      value: `$${top.amount.toFixed(2)}`,
    });
  }

  // Savings rate
  if (summary.savingsRate >= 30) {
    insights.push({
      id: 'savings-good',
      title: 'Healthy Savings Rate',
      description: `You're saving ${summary.savingsRate.toFixed(1)}% of your income. That's elite! 💪`,
      type: 'positive',
      icon: '📈',
      value: `${summary.savingsRate.toFixed(1)}%`,
    });
  } else if (summary.savingsRate > 0) {
    insights.push({
      id: 'savings-low',
      title: 'Savings Rate is Low',
      description: `Only ${summary.savingsRate.toFixed(1)}% saved. Try cutting one subscription.`,
      type: 'negative',
      icon: '⚠️',
      value: `${summary.savingsRate.toFixed(1)}%`,
    });
  }

  // Dining check
  const dining = breakdown.find((b) => b.category === 'Dining');
  if (dining && dining.percentage > 15) {
    insights.push({
      id: 'dining-high',
      title: 'Dining Spend Alert',
      description: `Dining is ${dining.percentage.toFixed(1)}% of expenses. Meal prep could save you big.`,
      type: 'negative',
      icon: '🍜',
      value: `$${dining.amount.toFixed(2)}`,
    });
  }

  // Entertainment
  const entertainment = breakdown.find((b) => b.category === 'Entertainment');
  if (entertainment) {
    insights.push({
      id: 'entertainment',
      title: 'Entertainment Subscriptions',
      description: `$${entertainment.amount.toFixed(2)} on Entertainment this period. Worth the vibe?`,
      type: 'neutral',
      icon: '🎬',
      value: `$${entertainment.amount.toFixed(2)}`,
    });
  }

  // Income diversity
  const incomeCategories = [...new Set(transactions.filter((t) => t.type === 'income').map((t) => t.category))];
  if (incomeCategories.length > 1) {
    insights.push({
      id: 'diverse-income',
      title: 'Diverse Income Streams',
      description: `You have ${incomeCategories.length} income sources: ${incomeCategories.join(', ')}.`,
      type: 'positive',
      icon: '💰',
      value: `${incomeCategories.length} sources`,
    });
  }

  // Biggest single expense
  const bigExpense = transactions.filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
  if (bigExpense) {
    insights.push({
      id: 'biggest-expense',
      title: 'Biggest Single Expense',
      description: `"${bigExpense.description}" was your largest expense this period.`,
      type: 'neutral',
      icon: '💸',
      value: `$${bigExpense.amount.toFixed(2)}`,
    });
  }

  return insights;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
