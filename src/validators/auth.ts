import { body } from "express-validator";
import { validateResult } from "./utils/validate-result";

export const signUpValidator = [
  body("email").trim().isEmail().withMessage("Email is not valid"),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage("Password is not strong enough"),
  body("name")
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name is not valid"),
  validateResult,
];

export const signInValidator = [
  body("email").trim().isEmail().withMessage("Email is not valid"),
  body("password").trim().exists(),
  validateResult,
];
