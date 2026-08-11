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

## 9. Deployment Instructions (Production Ready)

### Frontend Deployment (Vercel / Netlify / Render Static)
1. Set `VITE_API_BASE_URL` in environment variables pointing to your backend production URL.
2. Build command: `npm run build`
3. Output directory: `dist`

### Backend Deployment (Render / Railway / AWS EC2)
1. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`.
2. Build command: `npm run build`
3. Start command: `npm start` (or `node dist/server.js`)
4. Run migrations: `npx prisma migrate deploy`

---

## 10. Security & Quality Audit Summary

- [x] No sensitive secrets or passwords committed in Git.
- [x] Passwords securely hashed with Bcrypt (10 salt rounds).
- [x] `passwordHash` stripped from all JSON user responses.
- [x] Backend authorization enforced on protected endpoints.
- [x] Transactional stock deduction prevents partial stock updates or negative stock.
- [x] Dual persistent themes (Semi-Dark Navy Theme default & Light Theme).
