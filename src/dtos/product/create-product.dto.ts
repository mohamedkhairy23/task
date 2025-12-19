import {
  IsString,
  Length,
  IsDecimal,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(1, 150)
  name!: string;

  @IsDecimal({ decimal_digits: "0,2" })
  price!: string;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
