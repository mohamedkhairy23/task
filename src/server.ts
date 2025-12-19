import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source.js";
import authRoutes from "./routes/authRoutes.js";
import creditCardRoutes from "./routes/creditCardRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import webhookRoutes from "./routes/webHookRoutes.js"; // <-- import webhook

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    // credentials: true,
  })
);
// app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/credit-cards", creditCardRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Stripe webhook route (use express.raw)
app.use("/webhook", webhookRoutes);

// Initialize DB and start server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(console.error);
