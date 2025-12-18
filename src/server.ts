import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source.js";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(3000, () => console.log("🚀 Server running"));
  })
  .catch(console.error);
