import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";

import { AppDataSource } from "./config/data-source.js";
import authRoutes from "./routes/authRoutes.js";
import creditCardRoutes from "./routes/creditCardRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import webhookRoutes from "./routes/webHookRoutes.js";

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// INPUT PROTECTION
app.use(xss());
app.use(hpp());

// ROUTES
app.use("/auth", authRoutes);
app.use("/credit-cards", creditCardRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use("/webhook", webhookRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(console.error);
