"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../validators/auth");
const authRouter = express_1.default.Router();
authRouter.post("/signup", auth_2.signUpValidator, auth_1.signUp);
authRouter.post("/signin", auth_2.signInValidator, auth_1.signIn);
exports.default = authRouter;
//# sourceMappingURL=auth-router.js.map