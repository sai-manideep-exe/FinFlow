import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import TransactionModal from '../components/TransactionModal';
import type { Transaction, SortField } from '../types';
import { CATEGORY_COLORS, CATEGORIES } from '../data/mockData';
import { formatCurrency } from '../utils/finance';

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { transactions, filters, setFilters, role, addTransaction, updateTransaction, deleteTransaction } = useAppStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);

  const isAdmin = role === 'admin';

  const filtered = useMemo(() => {
    let items = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all') {
      items = items.filter((t) => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      items = items.filter((t) => t.category === filters.category);
    }

    items.sort((a, b) => {
      let aVal: string | number = a[filters.sortField];
      let bVal: string | number = b[filters.sortField];

      if (filters.sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (filters.sortField === 'amount') {
        aVal = a.amount;
        bVal = b.amount;
      }

      return filters.sortDirection === 'asc'
        ? aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        : aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    return items;
  }, [transactions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (filters.sortField === field) {
      setFilters({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortField: field, sortDirection: 'desc' });
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (filters.sortField !== field) return <ArrowUpDown size={12} className="sort-icon" />;
    return filters.sortDirection === 'asc'
      ? <ArrowUp size={12} className="sort-icon" />
      : <ArrowDown size={12} className="sort-icon" />;
  };

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setModalOpen(true);
  };

  const handleSave = (t: Transaction) => {
    if (editing) {
      updateTransaction(t.id, t);
    } else {
      addTransaction(t);
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this transaction?')) deleteTransaction(id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <section>
        <div className="section-header">
          <div>
            <h1 className="section-title">Transactions</h1>
            <p className="section-subtitle">{filtered.length} transactions found</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {!isAdmin && (
              <div className="readonly-banner">
                <ShieldAlert size={14} /> View Only — Switch to Admin to make changes.
              </div>
            )}
            {isAdmin && (
              <button
                className="btn btn-primary"
                onClick={() => { setEditing(null); setModalOpen(true); }}
                id="add-transaction-btn"
              >
                <Plus size={16} /> Add Transaction
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="card" style={{ padding: 16 }}>
        <div className="filters-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input
              id="search-input"
              className="search-input"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => { setFilters({ search: e.target.value }); setPage(1); }}
            />
          </div>
          <select
            id="filter-type"
            className="filter-select"
            value={filters.type}
            onChange={(e) => { setFilters({ type: e.target.value as any }); setPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="income">📈 Income</option>
            <option value="expense">📉 Expense</option>
          </select>
          <select
            id="filter-category"
            className="filter-select"
            value={filters.category}
            onChange={(e) => { setFilters({ category: e.target.value as any }); setPage(1); }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {(filters.search || filters.type !== 'all' || filters.category !== 'all') && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { useAppStore.getState().resetFilters(); setPage(1); }}
              id="reset-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No Transactions Found</div>
            <div className="empty-state-desc">
              Try adjusting your filters or search query.
            </div>
          </div>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th
                    className={filters.sortField === 'date' ? 'sorted' : ''}
                    onClick={() => handleSort('date')}
                  >
                    Date <SortIcon field="date" />
                  </th>
                  <th
                    className={filters.sortField === 'description' ? 'sorted' : ''}
                    onClick={() => handleSort('description')}
                  >
                    Description <SortIcon field="description" />
                  </th>
                  <th>Category</th>
                  <th>Type</th>
                  <th
                    className={filters.sortField === 'amount' ? 'sorted' : ''}
                    onClick={() => handleSort('amount')}
                    style={{ textAlign: 'right' }}
                  >
                    Amount <SortIcon field="amount" />
                  </th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => {
                  const color = CATEGORY_COLORS[t.category] ?? '#6b7280';
                  return (
                    <tr key={t.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {format(parseISO(t.date), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <div className="transaction-desc">{t.description}</div>
                      </td>
                      <td>
                        <span
                          className="category-pill"
                          style={{
                            background: `${color}18`,
                            color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === 'income' ? '↑' : '↓'} {t.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`amount-cell ${t.type}`}>
                          {t.type === 'income' ? '+' : '-'}
                          {formatCurrency(t.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="action-buttons" style={{ justifyContent: 'center' }}>
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(t)}
                              title="Edit"
                              aria-label="Edit transaction"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(t.id)}
                              title="Delete"
                              aria-label="Delete transaction"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{ padding: '12px 20px' }}>
            <div className="table-footer">
              <span className="table-count">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  aria-label="First page"
                >«</button>
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  );
                })}
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >›</button>
                <button
                  className="page-btn"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  aria-label="Last page"
                >»</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
