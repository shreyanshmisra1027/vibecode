import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

function Analytics({ filters }) {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  useEffect(() => {
    fetchCategoryData();
    fetchMonthlyTrends();
  }, [filters]);

  const fetchCategoryData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('type', 'expense');

      const response = await axios.get(`/api/analytics/by-category?${params}`);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      const response = await axios.get('/api/analytics/monthly-trends');

      // Transform data for the chart
      const monthMap = {};
      response.data.forEach(item => {
        if (!monthMap[item.month]) {
          monthMap[item.month] = { month: item.month, income: 0, expense: 0 };
        }
        if (item.type === 'income') {
          monthMap[item.month].income = item.total;
        } else {
          monthMap[item.month].expense = item.total;
        }
      });

      const chartData = Object.values(monthMap).reverse();
      setMonthlyTrends(chartData);
    } catch (error) {
      console.error('Error fetching monthly trends:', error);
    }
  };

  return (
    <div className="analytics">
      <div className="analytics-grid">
        <div className="chart-container">
          <h2>Expenses by Category</h2>
          {categoryData.length === 0 ? (
            <div className="empty-state">
              <p>No expense data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.category}: $${entry.total.toFixed(2)}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-container">
          <h2>Category Breakdown</h2>
          {categoryData.length === 0 ? (
            <div className="empty-state">
              <p>No data available</p>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {categoryData.map((item, index) => (
                <div
                  key={item.category}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                    <span>{item.category}</span>
                  </div>
                  <span style={{ fontWeight: '600' }}>${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chart-container">
        <h2>Monthly Income vs Expenses (Last 12 Months)</h2>
        {monthlyTrends.length === 0 ? (
          <div className="empty-state">
            <p>No monthly data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Analytics;
