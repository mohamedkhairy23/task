import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source.js";
import authRoutes from "./routes/authRoutes.js";
import creditCardRoutes from "./routes/creditCardRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/credit-cards", creditCardRoutes);
app.use("/products", productRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(console.error);
