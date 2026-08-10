# Mini ERP + CRM Operations Portal

A lightweight, practical, full-stack Mini ERP and CRM Operations Portal designed for a wholesale/distribution business. Built as a college recruitment placement case-study project.

## Tech Stack

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database ORM**: Prisma ORM
- **Database**: PostgreSQL (AWS RDS ready)
- **Utilities**: `dotenv`, `cors`

### Frontend
- **Framework**: React & TypeScript (powered by Vite)
- **Routing**: React Router (`react-router-dom`)
- **HTTP Client**: Axios

---

## Project Structure

```
CRM/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema & entities
│   ├── src/
│   │   ├── config/             # Environment & configuration helpers
│   │   ├── middleware/         # Express middlewares (error handling)
│   │   ├── routes/             # API route handlers (health check)
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server entry point
│   ├── .env                    # Environment variables (Git-ignored)
│   ├── .env.example            # Environment template
│   ├── Dockerfile              # Production Docker build for AWS
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios HTTP client configuration
│   │   ├── App.tsx             # Main application shell & router
│   │   └── main.tsx            # React entry point
│   ├── .env                    # Frontend environment variables
│   ├── .env.example            # Frontend environment template
│   ├── Dockerfile              # Nginx production build for AWS
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml          # Local containerized stack
├── README.md                   # Project documentation
└── .gitignore
```

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Installed locally or running via Docker)
- npm

### 1. Database Setup & Prisma Migration

1. Make sure your local PostgreSQL database server is running.
2. In `backend/.env`, configure your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_erp_db?schema=public"
   ```
3. Navigate to `backend/` and run Prisma migrations:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### 2. Backend Setup & Run

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy environment file (if not created):
   ```bash
   cp .env.example .env
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
4. The server will start at `http://localhost:5000`. Test the health check endpoint:
   ```
   GET http://localhost:5000/api/health
   ```

### 3. Frontend Setup & Run

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your web browser.

---

## Environment Variables

### Backend (`backend/.env`)
- `PORT`: Port on which Express server runs (Default: `5000`)
- `DATABASE_URL`: PostgreSQL connection URI (`postgresql://<user>:<password>@<host>:<port>/<dbname>?schema=public`)
- `FRONTEND_URL`: Client URL allowed by CORS (Default: `http://localhost:5173`)
- `JWT_SECRET`: Secure 256-bit cryptographically generated random key for future authentication.

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`: Base backend API endpoint (`http://localhost:5000/api`)

---

## AWS Deployment Guide

### Step 1: Managed Database (AWS RDS PostgreSQL)
1. Create a **PostgreSQL DB Instance** on **AWS RDS** (Free Tier eligible).
2. Configure Security Group inbound rules to allow port `5432` from your backend AWS service or IP address.
3. Note the Database Endpoint, Username, Password, and Database Name.
4. Set the backend `DATABASE_URL` to:
   ```env
   DATABASE_URL="postgresql://<RDS_USER>:<RDS_PASSWORD>@<RDS_ENDPOINT>:5432/<DB_NAME>?schema=public&sslmode=require"
   ```

### Step 2: Deploy Backend to AWS App Runner / EC2
#### Option A: AWS App Runner (Easiest)
1. Connect your GitHub repository to AWS App Runner.
2. Select `backend/` directory or use `backend/Dockerfile`.
3. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT=5000`.
4. App Runner will automatically build and expose your Express API over HTTPS.

#### Option B: AWS EC2 / Docker Compose
1. Launch an Ubuntu EC2 instance on AWS.
2. Clone the repository and update `docker-compose.yml` environment variables.
3. Run:
   ```bash
   docker-compose up -d --build
   ```

### Step 3: Production Database Migration on AWS
Run the production migration command from your deployment pipeline or build machine:
```bash
npx prisma migrate deploy
```

### Step 4: Deploy Frontend to AWS Amplify
1. Go to **AWS Amplify Console** -> Create new app from GitHub repo.
2. Set build directory to `frontend/` and build command:
   ```bash
   cd frontend && npm install && npm run build
   ```
3. Set environment variable `VITE_API_BASE_URL` to your AWS Backend App Runner URL (e.g. `https://xxxx.awsapprunner.com/api`).
4. Trigger deploy.

---

## Database Entities (Phase 1 Initial Schema)

- **User**: System users with role-based access (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`).
- **Customer**: Wholesale & retail customer directory (`LEAD`, `ACTIVE`, `INACTIVE`).
- **CustomerFollowUp**: Communication and follow-up history linked to Customer & User.
- **Product**: Inventory catalog with unique SKU, pricing (`Decimal`), and stock thresholds.
- **StockMovement**: Stock audit log for `IN` and `OUT` inventory adjustments.
- **Challan**: Delivery challans (`DRAFT`, `CONFIRMED`, `CANCELLED`).
- **ChallanItem**: Itemized challan entries with product snapshot details (`productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot`).
