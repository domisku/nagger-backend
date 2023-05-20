"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = void 0;
const express_validator_1 = require("express-validator");
const validation_error_1 = require("../../errors/validation-error");
function validateResult(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        return next();
    }
    throw new validation_error_1.ValidationError("Invalid input(s)");
}
exports.validateResult = validateResult;
//# sourceMappingURL=validate-result.js.map