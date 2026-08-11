# Mini ERP + CRM Operations Portal

> **FundsRoom Full Stack Developer Case Study Project**  
> **Repository**: [https://github.com/prakhar-bip/Mini-CRM](https://github.com/prakhar-bip/Mini-CRM)  

A production-ready full-stack enterprise operations platform for wholesale and distribution companies. Built to manage customer relationships, product catalogs, warehouse inventory stock movements (IN/OUT), sales challan fulfillment, product snapshot data persistence, and transactional stock deductions with negative stock prevention.

---

## 1. Core Features & Business Flow

### End-to-End Operational Workflow
```text
Landing Page
     │
Click "Get Started" / "Sign In"
     │
Floating Auth Modal ──(POST /api/auth/login)──► JWT Authentication & Role Resolution
     │
     ├── ADMIN     ──► /dashboard/admin     (Executive & System Governance)
     ├── SALES     ──► /dashboard/sales     (CRM, Opportunities, & Sales Challans)
     ├── WAREHOUSE ──► /dashboard/warehouse (Product Catalog & Inventory Stock Control)
     └── ACCOUNTS  ──► /dashboard/accounts  (Customer Overview & Order Tracking)
```

### Module Highlights
1. **Authentication & RBAC**:
   - JWT authentication with Bcrypt password hashing (10 salt rounds).
   - Backend-enforced authorization middleware across 4 roles: `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`.
2. **Customer CRM Module**:
   - Manages customer profiles (Name, Mobile, Email, Business Name, optional GST, Customer Type: `RETAIL`/`WHOLESALE`/`DISTRIBUTOR`, Address, Status: `LEAD`/`ACTIVE`/`INACTIVE`, Follow-up date, Notes).
   - Search, pagination, status filtering, and audit log history for follow-up notes (`POST /api/customers/:id/followups`).
3. **Product Catalog & Inventory Module**:
   - Manages products (Name, unique SKU, Category, Unit Price, Current Stock, Minimum Stock Alert, Warehouse Location).
   - Stock Movements (`IN`/`OUT`) with audit logging.
   - **Negative Stock Prevention**: Returns `400 Bad Request` on invalid stock deductions.
4. **Sales Challan Module & Transactional Stock Deduction**:
   - Multi-product line items with automatic total quantity calculation and auto-generated challan numbers (`#CH-YYYYMMDD-XXXX`).
   - Saving a draft captures **product snapshots** (`productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot`) on line items without touching stock.
   - **Atomic Transaction Confirmation**: `PUT /api/challans/:id/confirm` executes inside a `prisma.$transaction`. Verifies stock sufficiency for all items, deducts stock, creates `OUT` stock movement audit entries, and sets status to `CONFIRMED`. Atomic rollback prevents partial stock updates.

---

## 2. Technology Stack

| Layer                | Technology                                                       |
| -------------------- | ---------------------------------------------------------------- |
| **Backend**          | Node.js, TypeScript, Express.js, Prisma ORM, PostgreSQL          |
| **Authentication**   | JSON Web Tokens (JWT), BcryptJS, Zod Validation                  |
| **Frontend**         | React 18, TypeScript, Vite, Lucide Icons, Custom SVG Animations |
| **Styling & Themes** | Vanilla CSS Tokens (Semi-Dark Navy Theme default & Light Theme)  |
| **DevOps**           | Docker, Docker Compose, Nginx, CORS, Environment Variables       |

---

## 3. Seeded Test Credentials

All seeded test accounts use the password: **`Password@123`**

| Role        | Email                  | Backend Role Enum | Default Dashboard URL |
| ----------- | ---------------------- | ----------------- | --------------------- |
| **Admin**   | `admin@example.com`    | `ADMIN`           | `/dashboard/admin`    |
| **Sales**   | `sales@example.com`    | `SALES`           | `/dashboard/sales`    |
| **Manager** | `warehouse@example.com`| `WAREHOUSE`       | `/dashboard/warehouse`|
| **Employee**| `accounts@example.com` | `ACCOUNTS`        | `/dashboard/accounts` |

---

## 4. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_erp_db?schema=public"
JWT_SECRET="super-secret-jwt-key-minierp-2026"
JWT_EXPIRES_IN="1d"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## 5. Local Setup & Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/prakhar-bip/Mini-CRM.git
cd Mini-CRM
```

### Step 2: Database Setup & Migration
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
```

### Step 3: Start Backend API
```bash
npm run dev
# Server running at http://localhost:5000
```

### Step 4: Start Frontend App
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 6. Docker Compose Setup (Bonus)

To run the full stack (PostgreSQL + Express Backend + React Frontend) in containerized Docker:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 7. REST API Overview

```text
POST /api/auth/login                  Public        User login with email & password
GET  /api/auth/me                     Authenticated Get current user profile & role

POST /api/customers                   ADMIN, SALES  Create customer
GET  /api/customers                   All Roles     List customers (paginated, search, filter)
GET  /api/customers/:id               All Roles     Get customer detail
PUT  /api/customers/:id               ADMIN, SALES  Update customer
POST /api/customers/:id/followups     ADMIN, SALES  Log follow-up note
GET  /api/customers/:id/followups     All Roles     Get follow-up audit trail

POST /api/products                    ADMIN, WAREHOUSE  Create product
GET  /api/products                    All Roles         List products (lowStock filter)
GET  /api/products/:id                All Roles         Get product detail
PUT  /api/products/:id                ADMIN, WAREHOUSE  Update product
POST /api/products/:id/movements      ADMIN, WAREHOUSE  Log stock movement (IN/OUT)
GET  /api/products/:id/movements      All Roles         Get stock audit history

POST /api/challans                    ADMIN, SALES  Create Draft challan (snapshots saved)
GET  /api/challans                    All Roles     List challans (status filter)
GET  /api/challans/:id                All Roles     Get challan detail
PUT  /api/challans/:id/confirm        ADMIN, SALES  Confirm challan & deduct stock (transaction)
PUT  /api/challans/:id/cancel         ADMIN, SALES  Cancel draft challan

GET  /api/dashboard/stats             Authenticated Get real aggregated DB counts
GET  /api/health                      Public        Health check
```

---

## 8. Postman Collection

A master Postman collection file is available in the root directory:
👉 **`Mini_ERP_CRM_Postman_Collection.json`**

Import this file into Postman to test all endpoints across Auth, Customers, Products, Stock Movements, Challans (Draft, Confirm, Cancel, Insufficient Stock error), and Dashboard Stats.

---

## 9. Server Setup & Architecture

1. **Express & TypeScript Architecture**:
   - The backend server is initialized in [`server.ts`](file:///c:/Users/prakh/OneDrive/Desktop/CRM/backend/src/server.ts) and configured in [`app.ts`](file:///c:/Users/prakh/OneDrive/Desktop/CRM/backend/src/app.ts).
   - Uses Express.js with CORS middleware configured for cross-origin requests, JSON body parsing, and centralized error handling middleware [`errorHandler.ts`](file:///c:/Users/prakh/OneDrive/Desktop/CRM/backend/src/middleware/errorHandler.ts).
2. **Database Integration**:
   - PostgreSQL connection managed via **Prisma ORM** (`PrismaClient`).
   - Database schema defined in [`schema.prisma`](file:///c:/Users/prakh/OneDrive/Desktop/CRM/backend/prisma/schema.prisma) with models for `User`, `Customer`, `CustomerFollowUp`, `Product`, `StockMovement`, `Challan`, and `ChallanItem`.
3. **API Validation & Security**:
   - Request payloads strictly validated using **Zod schemas**.
   - Passwords hashed using **bcryptjs** (10 salt rounds) with `passwordHash` stripped from all JSON responses.
   - Protected routes guarded by JWT authentication middleware [`auth.middleware.ts`](file:///c:/Users/prakh/OneDrive/Desktop/CRM/backend/src/middleware/auth.middleware.ts) and role authorization [`role.middleware.ts`](file:///c:/Users/prakh/OneDrive/Desktop/CRM/backend/src/middleware/role.middleware.ts).

---

## 10. How Environment Variables Are Managed

Environment variables are isolated per layer and read centrally through typed config modules to ensure zero hardcoded secrets:

### Backend Configuration (`backend/src/config/env.ts`)
- Configured via `dotenv` loading variables from `backend/.env`.
- `PORT`: API server port (default: `5000`).
- `NODE_ENV`: Mode (`development` / `production`).
- `DATABASE_URL`: PostgreSQL connection string (`postgresql://user:pass@host:5432/dbname`).
- `JWT_SECRET`: Secret key for signing JSON Web Tokens.
- `JWT_EXPIRES_IN`: Token validity period (default: `1d`).
- `FRONTEND_URL`: Permitted CORS origin URL.

### Frontend Configuration (`frontend/src/api/axiosClient.ts`)
- `VITE_API_BASE_URL`: Base URL pointing to Express REST API (default: `http://localhost:5000/api`).

> 🔒 **Security Notice**: `.env` files are excluded from Git via `.gitignore`. Sample templates `.env.example` are committed for quick developer setup.

---

## 11. How to Run the Project Locally

### Prerequisites
- Node.js (v18+) & `npm`
- PostgreSQL database instance running locally or remotely (e.g. Supabase/Neon/Local Postgres)

### 1. Setup Backend
```bash
cd backend
npm install

# Configure backend environment
cp .env.example .env

# Run Prisma database migrations & seed initial test data
npx prisma migrate dev --name init
npm run seed

# Start Express API server (runs on http://localhost:5000)
npm run dev
```

### 2. Setup Frontend
```bash
# Open a new terminal
cd frontend
npm install

# Configure frontend environment
cp .env.example .env

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 12. How to Deploy the Project

### Option A: Free Cloud Hosting (Vercel + Render / Railway + Supabase)
1. **Database**:
   - Provision a PostgreSQL database on **Supabase** or **Neon**.
   - Copy the connection string into `DATABASE_URL`.
2. **Backend Deployment (Render / Railway / Fly.io)**:
   - Connect your GitHub repository (`https://github.com/prakhar-bip/Mini-CRM.git`).
   - Set Root Directory: `backend`.
   - Set Build Command: `npm install && npm run build`.
   - Set Start Command: `npx prisma migrate deploy && node dist/server.js`.
   - Set Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT=5000`.
3. **Frontend Deployment (Vercel / Netlify / Render Static)**:
   - Connect repository and select Root Directory: `frontend`.
   - Set Build Command: `npm run build`.
   - Set Output Directory: `dist`.
   - Set Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.

### Option B: Containerized Docker Deployment
To launch the entire stack (PostgreSQL DB + Backend API + Nginx Frontend) in Docker:
```bash
docker-compose up --build
```
- Frontend Web App: `http://localhost:3000`
- Backend REST API: `http://localhost:5000`

---

## 13. Business Domain Assumptions Made

1. **Wholesale & Distribution Focus**:
   - The business model assumes bulk stock handling with 4 core roles (`Admin`, `Sales`, `Warehouse`, `Accounts`).
2. **Customer Segmentation**:
   - Customers are classified into 3 operational types: `Retail`, `Wholesale`, and `Distributor`.
3. **Challan Inventory Deduction Logic**:
   - Saving a challan in `DRAFT` status preserves product snapshots without locking or deducting stock.
   - Stock deduction occurs **only when a challan status changes to `CONFIRMED`**, executing atomically in a database transaction.
4. **Product Snapshot Integrity**:
   - Line items store historical snapshots (`productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot`) at the time of creation so price adjustments in the catalog do not mutate old historical invoices.
5. **Currency Standard**:
   - Currency values are modeled in Indian Rupees (INR / ₹).

---

## 14. Security & Quality Audit Checklist

- [x] Zero sensitive credentials committed to Git.
- [x] Passwords securely hashed with Bcrypt (10 rounds).
- [x] `passwordHash` omitted from all API responses.
- [x] Atomic transactions prevent partial stock deductions or negative stock.
- [x] Strict RBAC enforced on protected routes.
- [x] Light theme default with Semi-Dark Navy toggle.

