import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { Order } from "./Order.js";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export class CreditCard {
  @Column()
  cardNumber!: string;

  @Column()
  expiryMonth!: number;

  @Column()
  expiryYear!: number;

  @Column()
  cardHolderName!: string;

  @Column({ nullable: true })
  brand?: string;
}

@Entity()
export class User extends BaseEntity {
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

  @Column("simple-json", { nullable: true })
  creditCards?: CreditCard[]; // array of embedded credit card objects

  @CreateDateColumn()
  createdAt!: Date;
}
