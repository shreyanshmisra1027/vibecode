import React from 'react';
import { format } from 'date-fns';

function Dashboard({ summary, transactions }) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <div className="amount">${summary.totalIncome.toFixed(2)}</div>
        </div>

        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <div className="amount">${summary.totalExpenses.toFixed(2)}</div>
        </div>

        <div className="summary-card balance">
          <h3>Balance</h3>
          <div className="amount">${summary.balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet. Add your first transaction to get started!</p>
          </div>
        ) : (
          <div>
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <h4>{transaction.category}</h4>
                  <div className="transaction-meta">
                    <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                    {transaction.description && <span>• {transaction.description}</span>}
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
