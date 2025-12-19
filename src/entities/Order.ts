import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Index,
  BaseEntity,
} from "typeorm";
import { User } from "./User.js";

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "SET NULL" })
  user!: any;

  @Column("jsonb")
  products!: { productId: string; price: number }[];

  @Column("decimal", { precision: 12, scale: 2 })
  totalAmount!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Index()
  @CreateDateColumn()
  createdAt!: Date;
}
