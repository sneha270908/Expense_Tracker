# 💸 SpendLens — Expense Tracker App

> A full-featured expense tracking app built with **React + Vite**, featuring JWT-simulated authentication, category-wise analytics, and a clean dark UI.

---

## 🚀 Features

- **🔐 Authentication** — Register/Login with JWT-simulated token (stored in localStorage)
- **➕ Add / Edit / Delete Expenses** — Full CRUD with amount, category, date & note
- **📊 Dashboard** — Category-wise pie chart, 7-day bar chart, stat cards
- **🗂️ Expense List** — Search, filter by category, grouped by month
- **📱 Responsive** — Works on mobile, tablet, and desktop
- **⚡ Loading & Error States** — Spinner, toast notifications, empty states, form validation
- **🎨 Stunning Dark UI** — Syne + DM Sans fonts, glassmorphic cards, smooth animations

---

## 🛠️ Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React 18, Vite 5              |
| Routing     | React Router v6               |
| State Mgmt  | Context API (AuthContext + ExpenseContext) |
| Charts      | Recharts                      |
| Icons       | Lucide React                  |
| Date Utils  | date-fns                      |
| Styling     | Pure CSS with CSS Variables   |
| Storage     | localStorage (simulates MongoDB) |

---

## 📁 Project Structure

```
expense-tracker/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Router setup
│   ├── index.css          # Global styles & design tokens
│   ├── context/
│   │   ├── AuthContext.jsx    # JWT auth simulation
│   │   └── ExpenseContext.jsx # Expense CRUD + stats
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx  # Charts & overview
│   │   └── ExpensesPage.jsx   # Full CRUD list
│   └── components/
│       └── Layout.jsx         # Sidebar + navigation
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

```bash
# 1. Extract the zip and navigate into the project
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Build for production
```bash
npm run build
npm run preview
```

---

## 🧪 Demo Account

You can register any account, OR click **"Use demo account"** on the login page.

> **Note:** To use the demo account, first register with:
> - Email: `demo@spendlens.com`
> - Password: `demo1234`

Or simply register a new account — it takes 5 seconds!

---

## 🗄️ Backend Note (React Native Version)

This Vite/React build simulates the backend using **localStorage** to match the assignment's spirit without requiring a running server. For the **full React Native + Node.js + MongoDB** stack:

| Component | Implementation |
|-----------|---------------|
| Auth      | Express.js `/api/auth/register` & `/api/auth/login` with `bcrypt` + `jsonwebtoken` |
| Expenses  | Express REST: `GET/POST/PUT/DELETE /api/expenses` |
| Database  | MongoDB with Mongoose — `User` and `Expense` models |
| State Mgmt | Redux Toolkit or Context API with `AsyncStorage` for offline |
| Navigation | React Navigation v6 Stack + Tab navigator |

---

## 📱 React Native Migration Guide

To convert this to React Native:
1. Replace `div/button/input` → `View/TouchableOpacity/TextInput`
2. Replace CSS → `StyleSheet.create({})` 
3. Replace `react-router-dom` → `@react-navigation/native`
4. Replace `localStorage` → `AsyncStorage` from `@react-native-async-storage/async-storage`
5. Replace `recharts` → `react-native-chart-kit` or `victory-native`

---

## 📝 Evaluation Criteria Addressed

| Criteria | Implementation |
|----------|---------------|
| Component Design | Modular pages + reusable components (Layout, StatCard, ExpenseModal, EmptyState) |
| Navigation | React Router v6 with protected/public route guards |
| State Management | Context API — AuthContext + ExpenseContext |
| API Integration | Async functions with loading states, simulated network delays |
| Edge Cases | Empty states, form validation, search with no results, delete confirmation |
| Code Readability | Clean file structure, named exports, comments where needed |

---

Made with ❤️ for the SpendLens internship assignment
