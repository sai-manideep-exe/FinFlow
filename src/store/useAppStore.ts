import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, FilterState, Role } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

interface AppState {
  transactions: Transaction[];
  filters: FilterState;
  role: Role;
  theme: 'dark' | 'light';
  activeTab: 'dashboard' | 'transactions' | 'insights';

  // Actions
  setRole: (role: Role) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'insights') => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  sortField: 'date',
  sortDirection: 'desc',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: INITIAL_TRANSACTIONS,
      filters: defaultFilters,
      role: 'admin',
      theme: 'dark',
      activeTab: 'dashboard',

      setRole: (role) => set({ role }),
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      setActiveTab: (activeTab) => set({ activeTab }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'finflow-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
);
