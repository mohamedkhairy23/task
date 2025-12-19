import { Request, Response } from "express";
import { User } from "../entities/User.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AddCreditCardDto } from "../dtos/creditCard/add-credit-card.dto.js";
import { DeleteCreditCardDto } from "../dtos/creditCard/delete-credit-card.dto.js";

export const addCreditCard = async (req: Request, res: Response) => {
  const dto = plainToInstance(AddCreditCardDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) return res.status(400).json({ errors });

  const user = await User.findOne({ where: { id: (req as any).user.id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.creditCards = user.creditCards || [];

  if (user.creditCards.some((c) => c.cardNumber === dto.cardNumber)) {
    return res.status(400).json({ message: "Card already exists" });
  }

  user.creditCards.push(dto);
  await user.save();

  res
    .status(201)
    .json({ message: "Credit card added", creditCards: user.creditCards });
};

export const deleteCreditCard = async (req: Request, res: Response) => {
  const dto = plainToInstance(DeleteCreditCardDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) return res.status(400).json({ errors });

  const user = await User.findOne({ where: { id: (req as any).user.id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.creditCards = (user.creditCards || []).filter(
    (c) => c.cardNumber !== dto.cardNumber
  );
  await user.save();

  res.json({ message: "Credit card deleted", creditCards: user.creditCards });
};

export const getLoggedInUserCreditCards = async (
  req: Request,
  res: Response
) => {
  const user = await User.findOne({ where: { id: (req as any).user.id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ creditCards: user.creditCards || [] });
};
