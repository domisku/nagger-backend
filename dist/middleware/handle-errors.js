"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const authorization_error_1 = require("../errors/authorization-error");
const validation_error_1 = require("../errors/validation-error");
function handleErrors(err, _, res, __) {
    var _a;
    console.error(err.stack);
    if (err instanceof validation_error_1.ValidationError || err instanceof authorization_error_1.AuthorizationError) {
        return res.status(err.statusCode).send(err.message);
    }
    res.status(500).send((_a = err.message) !== null && _a !== void 0 ? _a : "Something went wrong!");
}
exports.handleErrors = handleErrors;
//# sourceMappingURL=handle-errors.js.map