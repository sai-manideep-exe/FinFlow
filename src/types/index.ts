export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Salary'
  | 'Side Hustle'
  | 'Freelance'
  | 'Investment'
  | 'Groceries'
  | 'Transport'
  | 'Dining'
  | 'Entertainment'
  | 'Gaming'
  | 'Shopping'
  | 'Healthcare'
  | 'Utilities'
  | 'Rent'
  | 'Travel'
  | 'Education'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
}

export type Role = 'viewer' | 'admin';

export type SortField = 'date' | 'amount' | 'description';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  type: TransactionType | 'all';
  category: TransactionCategory | 'all';
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface Summary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DailyBalance {
  date: string;
  balance: number;
  income: number;
  expenses: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: string;
  value?: string;
}
