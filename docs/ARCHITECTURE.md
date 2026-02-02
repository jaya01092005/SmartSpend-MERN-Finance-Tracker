# System Architecture & Flow Diagrams

## 1. High-Level Architecture
The application follows a standard **MERN Stack** architecture (Monolith deployment).

```mermaid
graph TD
    User[User Client] -->|HTTPS Requests| Cloud["Cloud Hosting (Render)"]
    
    subgraph "Render Environment"
        Frontend["React Frontend (Vite)"]
        Backend["Node/Express Server"]
        
        Frontend -->|API Calls /api/...| Backend
        Backend -->|Serve Static Files| Frontend
    end
    
    Backend -->|Read/Write Data| DB[(MongoDB Atlas)]
    Backend -->|Generate Insights| AI[Google Gemini AI API]
```

## 2. Authentication Flow (JWT)
Secure login process using JSON Web Tokens.

```mermaid
sequenceDiagram
    participant U as User
    participant F as "Frontend (React)"
    participant B as "Backend (Express)"
    participant D as "Database (MongoDB)"

    U->>F: Enter Credentials
    F->>B: POST /api/auth/login
    B->>D: Find User
    D-->>B: User Found (Hash)
    B->>B: Compare Passwords (bcrypt)
    B->>B: Generate JWT Token
    B-->>F: Return Token
    F->>F: Store Token (localStorage)
    F->>U: Redirect to Dashboard
```

## 3. Data Flow: Transaction Management
How data moves when a user adds a transaction.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant R as Redux Store
    participant B as Backend
    participant DB as MongoDB

    U->>F: Fill Transaction Form
    F->>R: Dispatch addTransaction()
    R->>B: POST /api/transactions (Bearer Token)
    B->>B: Validate Data
    B->>DB: Save Document
    DB-->>B: Success
    B-->>R: Return New Transaction
    R->>F: Update State
    F->>U: Update Dashboard UI
```

## 4. AI Insight Generation Flow
How the AI feature works.

```mermaid
graph LR
    A[User Request / Auto-Load] --> B(Backend API)
    B --> C{Fetch Recent Transactions}
    C --> D[Format Prompt]
    D --> E[Call Google Gemini API]
    E --> F[Receive Analysis]
    F --> G[Parse JSON Response]
    G --> H[Return to Frontend]
```

## Directory Structure
```
/root
  ├── /client (Frontend)
  │     ├── /src
  │     │     ├── /components (UI)
  │     │     ├── /pages (Views)
  │     │     ├── /redux (State)
  ├── /config (DB Connection)
  ├── /controllers (Logic)
  ├── /models (Schemas)
  ├── /routes (API Endpoints)
  ├── /docs (Documentation)
  └── server.js (Entry Point)
```
