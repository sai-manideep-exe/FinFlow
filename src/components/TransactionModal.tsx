import { useState } from 'react';
import type { Transaction, TransactionCategory } from '../types';
import { CATEGORIES } from '../data/mockData';
import { generateId } from '../utils/finance';
import { X, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
  initial?: Transaction | null;
}

const today = new Date().toISOString().split('T')[0];

export default function TransactionModal({ isOpen, onClose, onSave, initial }: TransactionModalProps) {
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    date: initial?.date ?? today,
    description: initial?.description ?? '',
    amount: initial?.amount ?? 0,
    category: initial?.category ?? 'Dining',
    type: initial?.type ?? 'expense',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.description.trim() || form.amount <= 0) return;
    onSave({ ...form, id: initial?.id ?? generateId() });
    onClose();
  };

  const set = (field: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {initial ? '✏️ Edit Transaction' : '+ New Transaction'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="form-grid">
          {/* Type Toggle */}
          <div className="form-group full-width">
            <label className="form-label">Transaction Type</label>
            <div className="type-toggle">
              <button
                className={`type-toggle-btn ${form.type === 'income' ? 'active income' : ''}`}
                onClick={() => set('type', 'income')}
                type="button"
                id="type-income"
              >
                <TrendingUp size={14} /> Income
              </button>
              <button
                className={`type-toggle-btn ${form.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => set('type', 'expense')}
                type="button"
                id="type-expense"
              >
                <TrendingDown size={14} /> Expense
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="tx-desc">Description</label>
            <input
              id="tx-desc"
              className="form-input"
              placeholder="e.g. Spotify Premium"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-amount">Amount ($)</label>
            <input
              id="tx-amount"
              className="form-input"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={form.amount || ''}
              onChange={(e) => set('amount', parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-date">Date</label>
            <input
              id="tx-date"
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="tx-category">Category</label>
            <select
              id="tx-category"
              className="form-select"
              value={form.category}
              onChange={(e) => set('category', e.target.value as TransactionCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!form.description.trim() || form.amount <= 0}
            id="save-transaction-btn"
          >
            <Plus size={15} />
            {initial ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
