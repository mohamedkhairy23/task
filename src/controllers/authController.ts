import { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, UserRole } from "../entities/User.js";
import { AppDataSource } from "../config/data-source.js";
import { SignupDto } from "../dtos/user/signup.dto.js";
import { SigninDto } from "../dtos/user/signin.dto.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

const userRepo = AppDataSource.getRepository(User);

export const signup = async (req: Request, res: Response) => {
  const dto = plainToInstance(SignupDto, req.body);

  const errors = await validate(dto);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existing = await userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role || UserRole.USER,
    });

    await userRepo.save(user);

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
const JWT_SECRET: Secret = process.env.JWT_SECRET;

const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || "1d";

export const signin = async (req: Request, res: Response) => {
  const dto = plainToInstance(SigninDto, req.body);

  const errors = await validate(dto);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await userRepo.findOne({ where: { email: dto.email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions // type-safe
    );

    res.json({ token, id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
