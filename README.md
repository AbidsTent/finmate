<<<<<<< HEAD

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


=======
Overview:-

FinMate is a multi-page financial dashboard web application designed to help users track expenses, manage budgets, and monitor investments in a single interface.
The goal of the application is to provide a clear overview of personal financial health through summarized metrics, visual charts, and categorized transaction tracking.

The Home page presents a complete financial snapshot, including:

1.Available balance after expenses

2.Monthly subscription costs          

3.Total expenses

4.Investment cost basis

5.Category breakdown pie chart

6.Top spending categories

7.Income vs. expenses graph

8.Smart tips section indicating whether the user is within budget


The Expenses page allows users to:

1.View total income (budget), total spent, and remaining balance

2.Add new expenses by category, date, and amount

3.Review a list of recent expenses

4.View spending distribution and summary insights


The Investments page enables users to:

1.Track purchased stocks with live market prices

2.View profit/loss percentages for each holding

3.Maintain a watchlist of potential investments

4.Display a placeholder portfolio comparison chart


Future Extensions:-

FinMate can be extended by:

Connecting to a real database instead of JSON storage

Adding user authentication and secure login

Integrating real financial APIs for live stock and subscription data

Implementing advanced analytics and forecasting

Supporting mobile responsiveness and accessibility improvements


How to use and navigate the Application:- 


FinMate is organized into three primary pages accessible from the top navigation bar:

1.Home

2.Expenses

3.Investments

A profile icon in the top-right corner provides access to account-related options and demonstrates signed-in and signed-out interface states.

Home Page – Financial Overview

The Home page provides a high-level summary of the user’s financial status, including:

1.Available Balance after expenses

2.Monthly Subscriptions total

3.Total Expenses

4.Investment Cost Basis (shares × average cost)

Visual analytics are displayed below the summary:

1.A pie chart showing expense allocation by category

2.A Top Spendings panel listing the highest spending categories

3.An Income vs. Expenses graph illustrating financial trends over time

At the bottom, a Smart Tips section analyzes spending behavior and indicates whether the user is within budget or exceeding limits.


Expenses Page – Budgeting and Tracking

The Expenses page allows users to manage their spending:

1.Displays Total Income (budget), Total Spent, and Remaining Balance

2.Provides a form to add a new expense by:

- Selecting a category

- Entering an amount

- Choosing a date

3.Shows a scrollable list of recent expenses with delete actions

4.Includes:

- A spending-by-category pie chart

- A summary panel describing overall budget status

This page supports continuous tracking and real-time updates to totals.


Investments Page – Portfolio Monitoring

The Investments page enables users to monitor stock activity:

1.Displays a portfolio table containing:

- Ticker symbol

- Purchase price

- Current market price

- Number of shares

- Total value

- Profit/Loss percentage with visual indicators

2.Provides a watchlist for tracking potential investments before purchase

3.Includes a portfolio comparison chart placeholder for future visualization of cost vs. market value

Market values update dynamically to simulate real-time tracking.


Profile Menu Interaction

Clicking the profile icon opens a dropdown interface that demonstrates two states:

1.Signed-out state

- Sign in

- Create account

- Settings

- Help & Support

2.Signed-in state

- Personalized welcome message

- Last login time in Eastern Time (ET)

- Quick-access account actions

- Logout option

Authentication is simulated using local browser storage for demonstration purposes.


Reflection:-

This project provided practical experience in designing and implementing a multi-page web application using Node.js, Express, and static front-end technologies.
A key learning outcome was understanding how client–server interaction works without a database by using structured JSON data and REST-style endpoints.

One of the main challenges involved:

1.Coordinating multiple UI pages while keeping navigation and styling consistent

2.Managing Git branching, pull requests, and team collaboration workflows

3.Implementing dynamic financial visualizations and summaries


Despite these challenges, the project was successful in delivering a fully functional financial dashboard prototype that clearly demonstrates expense tracking, budget monitoring, investment portfolio visualization and multi-page navigation with interactive UI components
Overall, FinMate represents a strong foundation that can be expanded into a complete real-world personal finance management system in future assignments.
>>>>>>> c27f6af5446973917e182176ff257037dbc83fd5
