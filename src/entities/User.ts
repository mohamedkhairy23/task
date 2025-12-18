import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Order } from "./Order.js";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @CreateDateColumn()
  createdAt!: Date;
}
