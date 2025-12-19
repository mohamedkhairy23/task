import "reflect-metadata";
import { DataSource } from "typeorm";

import { requiredEnv } from "./env.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { Order } from "../entities/Order.js";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: requiredEnv("PGHOST"),
  port: 5432,
  username: requiredEnv("PGUSER"),
  password: requiredEnv("PGPASSWORD"),
  database: requiredEnv("PGDATABASE"),

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: true,
  logging: false,
  entities: [User, Product, Order],
});
