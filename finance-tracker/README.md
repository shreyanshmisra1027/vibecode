# Personal Finance Tracker

A full-stack personal finance tracker application built with React, Node.js, Express, and SQLite.

## Features

- ✅ Add income and expenses
- ✅ Categorize transactions with predefined categories
- ✅ Track transactions by date
- ✅ Monthly balance calculation
- ✅ Expense analytics with interactive charts
- ✅ Filter transactions by date, category, and type
- ✅ Persistent SQLite database storage
- ✅ Dashboard showing total income, expenses, and balance
- ✅ Edit and delete transactions
- ✅ Responsive design for mobile and desktop

## Tech Stack

**Frontend:**
- React 18
- Recharts (for data visualization)
- Axios (HTTP client)
- date-fns (date formatting)

**Backend:**
- Node.js
- Express
- SQLite3
- CORS enabled

## Project Structure

```
finance-tracker/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Dashboard with summary cards
│   │   │   ├── TransactionForm.js # Add/Edit transaction form
│   │   │   ├── TransactionList.js # List all transactions
│   │   │   ├── Analytics.js       # Charts and analytics
│   │   │   └── Filters.js         # Filter controls
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── server/                # Node.js backend
    ├── server.js          # Express server and API routes
    ├── database.js        # SQLite database setup
    ├── package.json
    └── finance.db         # SQLite database (created automatically)
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd finance-tracker
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers.

**Terminal 1 - Start the backend server:**
```bash
cd server
npm start
```
The backend server will run on `http://localhost:5000`

**Terminal 2 - Start the frontend development server:**
```bash
cd client
npm start
```
The frontend will run on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions (supports query params: startDate, endDate, category, type)
- `GET /api/transactions/:id` - Get a single transaction
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Analytics

- `GET /api/summary` - Get summary statistics (total income, expenses, balance)
- `GET /api/analytics/by-category` - Get expenses grouped by category
- `GET /api/analytics/monthly-trends` - Get monthly income/expense trends (last 12 months)
- `GET /api/categories` - Get list of all used categories

### Request/Response Examples

**Create Transaction:**
```json
POST /api/transactions
{
  "type": "expense",
  "amount": 50.00,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2026-08-27"
}
```

**Response:**
```json
{
  "id": 1
}
```

## Database Schema

### transactions table

| Column      | Type    | Description                    |
|-------------|---------|--------------------------------|
| id          | INTEGER | Primary key (auto-increment)   |
| type        | TEXT    | 'income' or 'expense'          |
| amount      | REAL    | Transaction amount             |
| category    | TEXT    | Transaction category           |
| description | TEXT    | Optional description           |
| date        | TEXT    | Transaction date (YYYY-MM-DD)  |
| created_at  | DATETIME| Auto-generated timestamp       |

## Categories

**Income Categories:**
- Salary
- Freelance
- Investment
- Gift
- Other Income

**Expense Categories:**
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Healthcare
- Education
- Other Expense

## Usage Guide

1. **Dashboard Tab:** View your financial summary with total income, expenses, balance, and recent transactions

2. **Add Transaction Tab:** Add new income or expense transactions with amount, category, date, and optional description

3. **Transactions Tab:** View all transactions with filtering options. You can:
   - Filter by date range
   - Filter by category
   - Filter by type (income/expense)
   - Edit existing transactions
   - Delete transactions

4. **Analytics Tab:** Visualize your financial data with:
   - Pie chart showing expenses by category
   - Category breakdown list
   - Bar chart showing monthly income vs expenses trends

## Development

**Backend development with auto-reload:**
```bash
cd server
npm run dev
```

**Frontend already has hot-reload enabled by default**

## Building for Production

**Build the React frontend:**
```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` directory.

**To serve the production build, you can:**
1. Use the built-in Express static serving by adding to `server/server.js`:
   ```javascript
   app.use(express.static(path.join(__dirname, '../client/build')));
   ```

2. Or use a production server like nginx or deploy to platforms like Vercel, Netlify, etc.

## Future Enhancements

- User authentication and multi-user support
- Budget tracking and alerts
- Recurring transactions
- Export data to CSV/PDF
- Dark mode
- Mobile app version
- Receipt image uploads
- Custom categories

## License

MIT

## Author

Created as a personal finance management tool.
