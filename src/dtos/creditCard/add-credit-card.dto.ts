import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  Length,
  IsOptional,
} from "class-validator";

export class AddCreditCardDto {
  @IsString()
  @IsNotEmpty()
  @Length(13, 19)
  cardNumber!: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth!: number;

  @IsNumber()
  @Min(new Date().getFullYear())
  expiryYear!: number;

  @IsString()
  @IsNotEmpty()
  cardHolderName!: string;

  @IsString()
  @IsOptional()
  brand?: string;
}
