# SmartSpend 💰

An AI-Powered Personal Budget Tracking Application built with the MERN stack.

## 🌟 Features

- **Dashboard**: Visual overview of income, expenses, and balance.
- **AI Insights**: Intelligent analysis of spending habits (e.g., " Weekend Spender", "Category Spikes").
- **Transaction Management**: Add, edit, filter, and delete transactions easily.
- **Secure Auth**: JWT-based authentication with protected routes.
- **Modern UI**: Clean, pastel-themed interface using Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas URL)

### 1. Backend Setup

1.  Navigate to the root directory:
    
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm run dev
    ```
    *Server runs on port 5000*

### 2. Frontend Setup

1.  Open a new terminal and navigate to the client folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧠 How the AI Works

The AI engine (`controllers/ai.js`) uses a hybrid approach combining **Content Analysis** and **Similarity-Based Recommendations**:
1.  **Content Analysis & NLP**: It categorizes and analyzes text descriptions of your transactions to understand spending contexts.
2.  **Similarity-Based Recommendation**: It builds a "User Preference Vector" based on your spending distribution. It then calculates the Cosine Similarity between your current habits and ideal financial models to generate personalized advice.
3.  **Pattern Detection**:
    *   **Category Spikes**: Detects if your current spending in a category is significantly higher than your average.
    *   **Weekend Habits**: Checks if a disproportionate amount of spending happens on weekends.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT, BcryptJS

Enjoy tracking your finances with intelligence! 🚀

