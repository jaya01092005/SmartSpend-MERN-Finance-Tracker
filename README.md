# SmartSpend - AI Personal Finance Tracker

##  Project Assignment: Budget Tracking Application
**SmartSpend** is a full-stack MERN application designed to help users manage their finances efficiently. It features transaction tracking, budget management, interactive charts, and **AI-powered financial insights**.

---

##  Live Links
- **Hosted Application:** [https://smartspend-mern-finance-tracker.onrender.com](https://smartspend-mern-finance-tracker.onrender.com)
- **Demo Video:** https://drive.google.com/file/d/1YEfXUgh3986BmnsjnvABLuOTA5NBSgOY/view
- **GitHub Repository:** [https://github.com/jaya01092005/SmartSpend-MERN-Finance-Tracker](https://github.com/jaya01092005/SmartSpend-MERN-Finance-Tracker)

---

##  Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Redux Toolkit, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI Tool:** Google Gemini AI API (for personalized insights & categorization)
- **Deployment:** Render (Backend + Frontend Monolith)

---

##  Documentation & Architecture
Detailed Documentation has also been included in this repository:
- **[Architecture & Flow Diagrams](./docs/ARCHITECTURE.md)**: System design and data flow.
- **[Test Report](./test-report.md)**: Manual testing results and strategy.

---

##  Features
1.  **User Authentication**: Secure Login/Signup with JWT & bcrypt.
2.  **Transactions**: Add, Edit, Delete Income/Expenses.
3.  **Budgeting**: Set monthly limits per category with visual progress bars.
4.  **Cards**: Manage linked payment methods.
5.  **Visualizations**: Interactive Pie & Area charts for financial overview.
6.  **AI Insights**:
    *   **Content Analysis**: The AI analyzes transaction descriptions to categorize them automatically if needed.
    *   **Similarity-Based Recommendations**: Uses historical data pattern matching to suggest "Savings Wins" or alert on "Category Spikes".

---

##  Setup Instructions (Local)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/jaya01092005/SmartSpend-MERN-Finance-Tracker.git
    cd SmartSpend-MERN-Finance-Tracker
    ```

2.  **Install Dependencies**
    ```bash
    # Install Root/Backend dependencies
    npm install

    # Install Client/Frontend dependencies
    cd client
    npm install
    cd ..
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory (refer to `.env.example`):
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    NODE_ENV=development
    ```

4.  **Run the App**
    ```bash
    # Run both Backend & Frontend concurrently
    npm run dev
    ```
    The app will open at `http://localhost:5173`.

---

##  Deployment Steps (Render)
This project is configured for **Render** (Web Service).
1.  Connect GitHub repo to Render.
2.  Set Build Command: `npm install && npm run build`
3.  Set Start Command: `npm start`
4.  Add Environment Variables in Render Dashboard.

---

**Submitted by:** Jayashree M

