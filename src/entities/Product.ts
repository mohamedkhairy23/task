import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("decimal")
  price!: number;

  @Column({ default: true })
  isActive!: boolean;
}
