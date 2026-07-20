# 🌊 MergeMind – AI-Powered Real-Time Code Review Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js) 
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js) 
![PostgreSQL](https://img.shields.io/badge/Database-Neon_Postgres-blue?logo=postgresql)

**MergeMind** is an enterprise-grade, full-stack application designed to seamlessly integrate with GitHub and provide automated, AI-driven code reviews. Built with modern web technologies, it offers developers instant insights, security analysis, and performance suggestions on their repositories and pull requests—all pushed to a stunning dashboard in real-time.

---

## 🎯 Vision & Core Capabilities

Modern software development requires rapid feedback loops. MergeMind removes the bottleneck of manual code reviews by utilizing advanced Large Language Models (Google Gemini) to instantly analyze code structure, identify vulnerabilities, and suggest architectural improvements.

### ✨ Key Features
- **🤖 Deep AI Code Analysis:** Leverages Google's Gemini AI to parse code syntax, understand context, and flag logic flaws.
- **⚡ Real-Time WebSockets:** Uses Socket.IO to stream live progress updates from the backend to the client during long-running reviews.
- **📊 Analytics & Visualization:** Interactive dashboard with Recharts mapping your code quality trends and team activity over time.
- **🎨 Glassmorphism UI:** A premium, responsive interface built with Tailwind CSS and animated using Framer Motion.
- **🔒 Secure Architecture:** Implemented with strict CORS policies, Helmet HTTP headers, JWT authentication, and robust rate-limiting.
- **🚀 Highly Optimized:** The Next.js frontend employs advanced chunking, lazy loading (`next/dynamic`), bundle analysis, and static SEO configurations.

---

## 🏗️ System Architecture

MergeMind follows a decoupled client-server architecture:
1. **Client (Frontend):** A Next.js (React 19) application utilizing Server Components and React Query for state management.
2. **API (Backend):** A Node.js/Express server that orchestrates database transactions via Prisma and interfaces with the GitHub and Google Gemini APIs.
3. **Database:** A serverless PostgreSQL instance hosted on Neon.

### 📁 Project Structure

```text
MergeMind/
├── backend/                       # Node.js Express API Server
│   ├── prisma/                    # Database schema and migrations
│   │   └── schema.prisma          # PostgreSQL models (User, Project, Review)
│   ├── src/
│   │   ├── config/                # Environment, Security, and API configs
│   │   ├── modules/               # Feature-based vertical slices
│   │   │   ├── auth/              # JWT issuance and validation
│   │   │   ├── github/            # GitHub API integration
│   │   │   ├── review/            # Gemini AI orchestration
│   │   │   └── socket/            # Real-time WebSocket emission
│   │   ├── app.js                 # Express application setup & middleware
│   │   └── server.js              # HTTP server and Socket.IO initialization
│   ├── .env                       # Backend secrets (ignored in git)
│   └── docker-compose.yml         # (Optional) Local Redis cache configuration
│
└── frontend/                      # Next.js App Router Client
    ├── src/
    │   ├── app/                   # Next.js App Router (Pages, Layouts, SEO)
    │   │   ├── (auth)/            # Login & Registration routes
    │   │   └── (dashboard)/       # Authenticated dashboard & review routes
    │   ├── components/            # Shared, reusable UI components (Shadcn UI)
    │   ├── features/              # Feature-based React components
    │   ├── hooks/                 # Custom React hooks
    │   ├── lib/                   # Utility functions & Axios instances
    │   └── providers/             # Global Contexts (Auth, React Query)
    ├── __tests__/                 # Vitest Unit and Integration testing
    ├── cypress/                   # Cypress End-to-End testing
    ├── next.config.ts             # Webpack, optimization, and security config
    └── tailwind.config.ts         # Tailwind design system and theme variables
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Shadcn UI
- **Animations:** Framer Motion
- **State Management:** React Query (@tanstack/react-query), Zustand
- **Testing:** Vitest (Unit/Component), Cypress (E2E)

### Backend
- **Framework:** Node.js with Express.js
- **Language:** JavaScript (ES Modules)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Real-Time:** Socket.IO
- **Security:** Helmet, Express Rate Limit, bcrypt, JSONWebToken
- **Third-Party Integrations:** Google Gemini SDK (`@google/genai`), Octokit (GitHub REST API)

---

## 🚀 Local Development Setup

To run MergeMind locally, you will need Node.js (v18+) and a PostgreSQL database.

### 1. Clone the repository
```bash
git clone https://github.com/Aryns293/MergeMind.git
cd MergeMind
```

### 2. Backend Setup
Navigate to the backend and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:5432/YOUR_DB_NAME?sslmode=require"
DIRECT_DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DIRECT_DB_HOST:5432/YOUR_DB_NAME?sslmode=require"
JWT_SECRET="replace_with_your_own_long_random_jwt_secret"
GEMINI_API_KEY="your_google_gemini_api_key"
GITHUB_ACCESS_TOKEN="your_github_personal_access_token"
CLIENT_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```
Initialize the database and start the server:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```
Start the Next.js development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser to view the application!

---

## 🌍 Production Deployment

### Backend (Render / Railway / AWS)
1. Deploy the `backend` directory as a Node Web Service.
2. Ensure you run the build command: `npm install && npx prisma generate`
3. Set your production environment variables (crucially: `NODE_ENV=production` and `CORS_ORIGIN=https://your-frontend-url.vercel.app`).
4. **Note:** The backend utilizes strict CORS policies in production. It will reject requests from unrecognized origins.

### Frontend (Vercel)
1. Import the repository into Vercel and set the Root Directory to `frontend`.
2. Vercel automatically detects Next.js settings.
3. Add your `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` variables pointing to your deployed backend.
4. Deploy. The build process will automatically execute static generation for SEO (`sitemap.ts`, `robots.ts`) and bundle optimizations.

---

## 🧪 Testing

The frontend maintains high reliability through rigorous testing suites.

```bash
cd frontend

# Run unit and component tests (Vitest)
npm run test

# Run End-to-End browser tests (Cypress)
npx cypress open
```

---

*Built for the modern developer workflow.*
