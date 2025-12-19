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

  @Index()
  @CreateDateColumn()
  createdAt!: Date;
}
