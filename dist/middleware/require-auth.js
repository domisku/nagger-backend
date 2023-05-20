"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authorization_error_1 = require("../errors/authorization-error");
function requireAuth(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        try {
            const token = (0, jsonwebtoken_1.verify)(authorizationHeader, process.env.JWT_SECRET);
            req.userId = token.userId;
            return next();
        }
        catch (_a) {
            throw new authorization_error_1.AuthorizationError("You must be logged in.");
        }
    }
    throw new authorization_error_1.AuthorizationError("You must be logged in.");
}
exports.requireAuth = requireAuth;
//# sourceMappingURL=require-auth.js.map