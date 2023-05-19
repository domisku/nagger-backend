import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../../errors/validation-error";

export function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  throw new ValidationError("Invalid input(s)");
}
