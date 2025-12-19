import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
} from "class-validator";
import { UserRole } from "../../entities/User.js";

export class SignupDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "Role must be either 'user' or 'admin'" })
  role?: UserRole;
}
