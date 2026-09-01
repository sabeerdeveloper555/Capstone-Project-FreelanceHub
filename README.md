# FreelanceHub PK

FreelanceHub PK is a full-stack platform built for Pakistani freelance talent and global clients to manage clients, track projects, monitor deadlines, and analyze financial performance with multi-tenant data isolation.

---

## 🚀 Key Features & Implementation Status

- **Phase 1: Backend Foundation & Database Connection**
  - Modular MongoDB / MongoDB Atlas Mongoose connection with lifecycle event handlers (`connected`, `disconnected`, `reconnected`, `error`).
  - Express server with Helmet security headers, CORS, request parsing, and graceful shutdown (`SIGINT`, `SIGTERM`).
  - Health check endpoint (`GET /api/health`).

- **Phase 2: Database Models & Schema Validation**
  - **User**: Name, unique lowercased email, hashed password, role (`freelancer` | `client`), timestamps.
  - **Client**: Name, lowercased email, company, phone, country, notes, owner reference, timestamps.
  - **Project**: Title, description, client reference, budget, deadline, status (`Planning` | `In Progress` | `Review` | `Completed` | `On Hold`), owner reference, timestamps.

- **Phase 3: Authentication & Role-Based Access Control (RBAC)**
  - `bcryptjs` password hashing with Mongoose `pre('save')` hooks and `matchPassword` comparison.
  - Stateless JWT authentication via `protect` middleware.
  - Granular RBAC via `authorizeRoles('freelancer', 'client')` middleware.
  - Safe user serialization (passwords never stored or returned in plain text).

- **Phase 4: Client Management CRUD (Multi-tenant Isolation)**
  - Full CRUD operations restricted to the `freelancer` role.
  - Automatic `owner` assignment and query scoping ensuring zero cross-tenant access.

- **Phase 5: Project Management CRUD & Relationship Validation**
  - Project lifecycle management with client-project relationship verification.
  - Strict ownership check preventing freelancers from assigning projects to clients they do not own.
  - Populated client metadata in project query responses.

- **Phase 6: Financials, Analytics & Freelancer Dashboard**
  - High-performance MongoDB aggregation pipelines for metrics and financial computations.
  - Real-time client and project status metrics.
  - Server-side deadline analytics (`dueSoon`, `overdue`, `completed`).
  - Monthly project volume tracking (`YYYY-MM`) and comprehensive budget breakdowns.

---

## 🛠️ Technology Stack

- **Backend**: Node.js (ES Modules), Express.js
- **Database & ODM**: MongoDB / MongoDB Atlas, Mongoose
- **Security & Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios

---

## 📁 Project Structure

```
FreelanceHub-PK/
├── backend/                       # Node.js + Express backend API
│   ├── src/
│   │   ├── config/                # Database connection & lifecycle management (db.js)
│   │   ├── controllers/           # Business logic & request controllers
│   │   │   ├── authController.js
│   │   │   ├── clientController.js
│   │   │   ├── projectController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── authMiddleware.js  # JWT verification & RBAC authorization
│   │   │   ├── asyncHandler.js    # Async exception wrapper
│   │   │   └── errorMiddleware.js # Centralized 404 and global error handlers
│   │   ├── models/                # Mongoose database models
│   │   │   ├── User.js
│   │   │   ├── Client.js
│   │   │   ├── Project.js
│   │   │   └── index.js
│   │   ├── routes/                # Express route declarations
│   │   │   ├── healthRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── clientRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── utils/                 # Utilities (generateToken.js)
│   │   └── app.js                 # Express application pipeline & route mounting
│   ├── .env.example               # Backend environment variables template
│   ├── package.json               # Backend dependencies & scripts
│   └── server.js                  # Application bootloader & graceful shutdown handler
│
├── frontend/                      # React + Vite frontend application
│   ├── src/
│   │   ├── assets/                # Static assets
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Application page views
│   │   ├── services/              # Axios API client services
│   │   ├── App.jsx                # Root application component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind CSS directives
│   ├── .env.example               # Frontend environment variables template
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tailwind.config.js         # Tailwind configuration
│   └── vite.config.js             # Vite configuration
│
└── README.md
```

---

## 📡 API Reference & Endpoints

### System Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns server status, uptime, environment, and MongoDB readyState |

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`freelancer` or `client`) and receive JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and receive JWT |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile |

### Client Management (`/api/clients`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/clients` | Private (`freelancer`) | Create a new client (auto-assigns `owner`) |
| `GET` | `/api/clients` | Private (`freelancer`) | List all clients owned by authenticated freelancer |
| `GET` | `/api/clients/:id` | Private (`freelancer`) | Retrieve single client by ID (ownership verified) |
| `PUT` | `/api/clients/:id` | Private (`freelancer`) | Update client details (ownership verified) |
| `DELETE` | `/api/clients/:id` | Private (`freelancer`) | Delete client (ownership verified) |

### Project Management (`/api/projects`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/projects` | Private (`freelancer`) | Create project (validates client ownership) |
| `GET` | `/api/projects` | Private (`freelancer`) | List all projects owned by freelancer (populates `client`) |
| `GET` | `/api/projects/:id` | Private (`freelancer`) | Retrieve project by ID (populates `client`) |
| `PUT` | `/api/projects/:id` | Private (`freelancer`) | Update project (validates project & client ownership) |
| `DELETE` | `/api/projects/:id` | Private (`freelancer`) | Delete project (ownership verified) |

### Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Private (`freelancer`) | Overview (client counts, budget totals, status distribution, deadline metrics, recent projects) |
| `GET` | `/api/dashboard/projects/monthly` | Private (`freelancer`) | Monthly project creation timeline |
| `GET` | `/api/dashboard/projects/status` | Private (`freelancer`) | Project count grouped by status |
| `GET` | `/api/dashboard/financials` | Private (`freelancer`) | Detailed financial breakdown (total, completed, in-progress, average budget) |

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/freelancehub
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 Getting Started

### 1. Backend Server Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Application Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.
