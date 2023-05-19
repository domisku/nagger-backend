import { NextFunction, Request, Response } from "express";
import { AuthorizationError } from "../errors/authorization-error";
import { ValidationError } from "../errors/validation-error";

export function handleErrors(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  console.error(err.stack);

  if (err instanceof ValidationError || err instanceof AuthorizationError) {
    return res.status(err.statusCode).send(err.message);
  }

  res.status(500).send(err.message ?? "Something went wrong!");
}
