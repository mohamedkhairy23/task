import {
  IsString,
  Length,
  IsDecimal,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: "0,2" })
  price?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
