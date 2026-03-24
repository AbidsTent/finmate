
# FinMate

FinMate is a **personal finance dashboard web application** that helps users track expenses, manage budgets, and monitor investments from a single interface.

The application provides a clear overview of financial health through summarized metrics, interactive charts, and categorized transaction tracking.

---

# Features

## Home Dashboard

The **Home page** provides a complete financial overview including:

* Available balance after expenses
* Monthly subscription costs
* Total expenses
* Investment cost basis
* Category breakdown pie chart
* Top spending categories
* Income vs expenses comparison chart
* Smart tips section for financial insights

This dashboard allows users to quickly understand their current financial situation.

---

## Expenses Management

The **Expenses page** allows users to track and manage spending.

Users can:

* Set a **budget (total income)**
* View **total spent**
* See **remaining balance**
* Add new expenses with:

  * Category
  * Title
  * Amount
  * Date
* Edit existing expenses
* Delete expenses
* View a **spending-by-category chart**
* Monitor recent expense history

All totals update automatically when expenses change.

---

## Investment Portfolio

The **Investments page** helps users monitor stock investments.

Features include:

* Portfolio table displaying:

  * Ticker
  * Buy price
  * Current price
  * Shares
  * Total value
  * Profit/Loss percentage
* Portfolio performance comparison
* Watchlist for potential investments
* Placeholder chart for cost vs market value comparison

This page demonstrates portfolio tracking functionality.

---

# Technology Stack

### Frontend

* React
* React Router
* Chart.js
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Other Tools

* Git & GitHub
* REST API
* LocalStorage (for budget persistence)

---

# Project Structure

```
finmate
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ExpensePage.jsx
│   │   │   └── InvestmentPage.jsx
│   │   ├── styles
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server
│   ├── config
│   ├── models
│   │   ├── expense.js
│   │   └── investment.js
│   ├── routes
│   │   ├── expense.js
│   │   └── investment.js
│   ├── seed
│   └── server.js
│
└── README.md
```

---

# Installation

Clone the repository

```
git clone https://github.com/your-repo/finmate.git
cd finmate
```

---

## Install backend dependencies

```
cd server
npm install
```

Start backend server

```
npm run start
```

Server runs on:

```
http://localhost:8080
```

---

## Install frontend dependencies

Open a new terminal

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# API Endpoints

## Expenses

```
GET     /api/expenses
POST    /api/expenses
PUT     /api/expenses/:id
DELETE  /api/expenses/:id
```

## Investments

```
GET     /api/investments
POST    /api/investments
PUT     /api/investments/:id
DELETE  /api/investments/:id
```

---

# Future Extensions

FinMate can be expanded with additional features including:

* User authentication and login system
* Secure financial data storage
* Integration with real financial APIs for live stock prices
* Subscription detection
* Advanced analytics and forecasting
* Mobile responsiveness improvements
* Notification system for budget alerts

---

# Learning Outcomes

This project provided practical experience in:

* Building a **full-stack MERN application**
* Designing REST APIs
* Managing state in React
* Creating financial visualizations with Chart.js
* Implementing CRUD operations with MongoDB
* Collaborating using Git branches and pull requests

---

# Reflection

Developing FinMate required coordinating multiple application layers including the frontend interface, backend API, and database models.

Key challenges included:

* Maintaining consistent UI across multiple pages
* Integrating chart visualizations with live data
* Managing Git branching and team collaboration
* Synchronizing financial summaries across pages

Despite these challenges, the project successfully demonstrates a functional financial dashboard prototype capable of expense tracking, budget monitoring, and portfolio visualization.

FinMate provides a strong foundation that can be extended into a full personal finance management platform.


