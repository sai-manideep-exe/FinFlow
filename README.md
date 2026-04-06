# FinFlow — Personal Finance Dashboard 💎

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react)

**FinFlow** is a modern, responsive personal finance dashboard built to fulfill the Frontend Developer Intern assignment requirements. It allows users to visualize their financial activity, explore transactions with robust filtering, and discover smart spending insights. 

Built with a sleek, custom "Fintech" design system, it features full dark/light mode toggling, glassmorphic UI components, and complete front-end state persistence.

---

## ✨ Features Implemented

* **Dashboard Overview:** Displays high-level summary cards (Balance, Income, Expenses, Savings Rate).
* **Time-Based Visualization:** Recharts-powered interactive Area Chart mapping the rolling balance trend.
* **Categorical Visualization:** Dynamic Donut Chart breaking down spending by category.
* **Transaction Management:** Full table view displaying Date, Description, Category, Type, and Amount.
* **Advanced Filtering & Sorting:** Filter by Income/Expense type, specific categories, or search by text. Sort by Date, Amount, or Description.
* **Role-Based Access Control (RBAC):** Simulated frontend roles. A "Viewer" experiences a read-only UI, while an "Admin" can add, edit, or delete transactions. 
* **Smart Insights Engine:** A dedicated page computing the user's top spending category, savings rate health, and automated financial observations.
* **Data Persistence:** Built-in LocalStorage integration ensures your transactions, theme preference, and role persist across page reloads.
* **Premium Theming:** Fully customized Dark and Light modes featuring dynamic background meshes and deep gradients.
* **Responsive Layout:** A fluid grid system and mobile-first media queries to ensure perfection on 4K monitors and mobile phones alike.

---

## 🛠 Approach & Technical Decisions

### 1. Framework & Build Tooling
I selected **Vite** with **React (TypeScript)**. Vite provides an incredibly fast developer experience with instant HMR, while TypeScript enforces strict typing constraints across data interfaces (Transactions, Summaries) to eliminate runtime bugs. 

### 2. Styling Strategy
Rather than relying on a heavy UI kit (like MUI or Bootstrap) or TailwindCSS, I chose to architect a **custom CSS Design System using CSS Variables**. 
* **Why?** Writing vanilla CSS with modern variables allowed exact pixel-perfect control over the "premium glassmorphic" aesthetic. It keeps the asset payload tiny and makes toggling `data-theme="light"` or `dark` blazing fast without a JavaScript styled-component provider.

### 3. State Management
I chose **Zustand** orchestrate the application state.
* **Why?** Redux would be heavily over-engineered for a simple dashboard, and React Context can cause unnecessary widespread re-renders when updating rapid nested data. Zustand gave me a single, boilerplate-free hook (`useAppStore`) with middleware (`persist`) that seamlessly hooks into `localStorage`. 

### 4. Component Structure
The project is decoupled strictly by responsibility:
* `/components`: Re-usable, stateless or semi-stateless visual elements (`Charts.tsx`, `SummaryCards.tsx`, `TransactionModal.tsx`).
* `/pages`: Top-level router views that fetch logic from the store.
* `/utils`: Pure functions for parsing dates, crunching numbers, and generating insight arrays (`finance.ts`).
* `/store`: The Zustand engine. 
* `/data`: The master JSON array simulating a database. 

---

## 🚀 Setup Instructions

Want to run FinFlow locally? It takes less than a minute.

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

**2. Install dependencies:**
```bash
# You can use npm, yarn, or pnpm
npm install
```

**3. Start the dev server:**
```bash
npm run dev
```

**4. View the App:**
Open your browser and navigate to `http://localhost:5173`. 
*(Try switching to "Admin" in the sidebar to add a test transaction, or flip the Light Mode switch!)*

---

*Mock data generated for evaluation purposes only.*
