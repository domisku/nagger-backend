import { body } from "express-validator";
import { validateResult } from "./utils/validate-result";

export const createNotificationValidator = [
  body("title").isString().notEmpty().isLength({ max: 100 }).trim().escape(),
  body("body").optional().isString().isLength({ max: 300 }).trim().escape(),
  body("date")
    .isISO8601()
    .custom((date) => {
      const isFutureDate = new Date(date).getTime() >= new Date().getTime();

      if (!isFutureDate) {
        throw new Error("Date must be in the future");
      }

      return true;
    }),
  body("sendPush").isBoolean(),
  body("sendEmail").isBoolean(),
  validateResult,
];

export const pushSubscriptionValidator = [
  body("endpoint").isString().notEmpty(),
  body("expirationTime").optional(),
  body("keys")
    .exists()
    .custom((val) => {
      const hasExtraKeys = Object.keys(val).length > 2;

      if (hasExtraKeys) {
        throw new Error("Unexpected properties in 'keys' object");
      }

      return true;
    }),
  body("keys.auth").isString(),
  body("keys.p256dh").isString(),
  validateResult,
];
