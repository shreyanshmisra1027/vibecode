import React from 'react';
import { format } from 'date-fns';

function TransactionList({ transactions, onDelete, onEdit }) {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>All Transactions</h2>
        <div className="empty-state">
          <p>No transactions found. Try adjusting your filters or add a new transaction.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>All Transactions ({transactions.length})</h2>
      <div>
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-info">
              <h4>{transaction.category}</h4>
              <div className="transaction-meta">
                <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                {transaction.description && <span>• {transaction.description}</span>}
                <span>• {transaction.type}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
              <div className="transaction-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(transaction)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
