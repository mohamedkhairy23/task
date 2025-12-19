import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    req.body = dto;
    next();
  };
};
