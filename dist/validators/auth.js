"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidator = exports.signUpValidator = void 0;
const express_validator_1 = require("express-validator");
const validate_result_1 = require("./utils/validate-result");
exports.signUpValidator = [
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Email is not valid"),
    (0, express_validator_1.body)("password")
        .trim()
        .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    })
        .withMessage("Password is not strong enough"),
    (0, express_validator_1.body)("name")
        .optional()
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name is not valid"),
    validate_result_1.validateResult,
];
exports.signInValidator = [
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Email is not valid"),
    (0, express_validator_1.body)("password").trim().exists(),
    validate_result_1.validateResult,
];
//# sourceMappingURL=auth.js.map