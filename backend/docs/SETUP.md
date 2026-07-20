# MergeMind Backend Setup Guide

Welcome to the MergeMind Real-Time AI Code Reviewer! This guide will help you set up the backend development environment on your local machine.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v20+ recommended)
- **PostgreSQL** (v14+ recommended)
- **Git**

## 1. Installation

Clone the repository and install the backend dependencies:

```bash
cd MergeMind/backend
npm install
```

## 2. Environment Configuration

Create a `.env` file in the root of the `backend` directory. You will need to configure the following variables:

```env
NODE_ENV=development
PORT=5000

# Database Configuration (replace with your own local PostgreSQL values)
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME?schema=public"

# JWT Auth Secrets
JWT_SECRET=replace_with_your_own_long_random_jwt_secret
JWT_EXPIRES_IN=7d

# Frontend Origin
CLIENT_URL=http://localhost:3000

# AI Provider Credentials
GEMINI_API_KEY=your_google_gemini_api_key

# GitHub (Optional: needed for accessing private repos during development)
GITHUB_ACCESS_TOKEN=your_personal_access_token
```

## 3. Database Setup

We use **Prisma ORM** to manage our PostgreSQL database. Once your `DATABASE_URL` is configured, push the schema to your database:

```bash
npm run db:push
```

To view and manage your data interactively, you can launch Prisma Studio:

```bash
npm run db:studio
```

## 4. Running the Server

Start the development server using nodemon (this will automatically restart the server when files change):

```bash
npm run dev
```

The server should now be running at `http://localhost:5000`.

## 5. Testing

We use **Vitest** for unit and integration testing.

To run the complete test suite once:
```bash
npm run test
```

To run the tests in interactive watch mode (great for TDD):
```bash
npm run test:watch
```

## 6. API Documentation

Once the server is running, you can access the interactive OpenAPI/Swagger documentation portal by visiting:

👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

This portal provides a complete overview of all available endpoints, required payloads, and authentication schemes.
