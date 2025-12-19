import { IsString, IsNotEmpty } from "class-validator";

export class DeleteCreditCardDto {
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;
}
