"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = void 0;
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
exports.AuthorizationError = AuthorizationError;
//# sourceMappingURL=authorization-error.js.map