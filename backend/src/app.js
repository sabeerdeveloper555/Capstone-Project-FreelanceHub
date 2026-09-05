import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// ============================================
// Security HTTP Headers
// ============================================
app.use(helmet());

// ============================================
// CORS Configuration
// ============================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://capstone-project-freelance-hub-sk8u.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (for example, server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    optionsSuccessStatus: 204,
  }),
);

// ============================================
// HTTP Request Logger
// ============================================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================
// Body Parsers
// ============================================
app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// ============================================
// API Routes
// ============================================

app.use("/api/health", healthRoutes);

app.use("/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/clients", clientRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/dashboard", dashboardRoutes);

// ============================================
// Root Route
// ============================================
app.get("/", (req, res) => {
  res.json({
    name: "FreelanceHub PK API",
    version: "1.0.0",
    status: "online",
    healthCheck: "/api/health",
  });
});

// ============================================
// Error Handling Middleware
// ============================================
app.use(notFound);

app.use(errorHandler);

export default app;
