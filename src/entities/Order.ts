import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @Column("jsonb")
  products!: { productId: string; price: number }[];

  @Column("decimal")
  totalAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
