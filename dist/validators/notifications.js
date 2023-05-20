"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushSubscriptionValidator = exports.createNotificationValidator = void 0;
const express_validator_1 = require("express-validator");
const validate_result_1 = require("./utils/validate-result");
exports.createNotificationValidator = [
    (0, express_validator_1.body)("title").isString().isLength({ min: 2, max: 100 }).trim().escape(),
    (0, express_validator_1.body)("body").isString().isLength({ max: 300 }).trim().escape(),
    (0, express_validator_1.body)("date").isISO8601(),
    (0, express_validator_1.body)("sendPush").isBoolean(),
    (0, express_validator_1.body)("sendEmail").isBoolean(),
    validate_result_1.validateResult,
];
exports.pushSubscriptionValidator = [
    (0, express_validator_1.body)("endpoint").isString().notEmpty().trim().escape(),
    (0, express_validator_1.body)("expirationTime").optional(),
    (0, express_validator_1.body)("keys")
        .exists()
        .custom((val) => {
        const hasExtraKeys = Object.keys(val).length > 2;
        if (hasExtraKeys) {
            throw new Error("Unexpected properties in 'keys' object");
        }
        return true;
    }),
    (0, express_validator_1.body)("keys.auth").isString(),
    (0, express_validator_1.body)("keys.p256dh").isString(),
    validate_result_1.validateResult,
];
//# sourceMappingURL=notifications.js.map