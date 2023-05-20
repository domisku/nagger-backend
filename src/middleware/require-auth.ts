import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";
import { AuthorizationError } from "../errors/authorization-error";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    try {
      const token = verify(authorizationHeader, config.JWT_SECRET) as any;
      req.userId = token.userId;
      return next();
    } catch {
      throw new AuthorizationError("You must be logged in.");
    }
  }

  throw new AuthorizationError("You must be logged in.");
}
