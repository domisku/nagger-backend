"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const app_1 = require("../app");
const config_1 = require("../config/config");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    const hash = (0, crypto_1.pbkdf2Sync)(password, salt, 1000, 64, `sha512`).toString(`hex`);
    try {
        const user = yield app_1.prisma.user.create({
            data: { email, password: hash, name, salt },
        });
        const tokenExpirationInSeconds = 60 * 60;
        const token = (0, jsonwebtoken_1.sign)({ userId: user.id, email }, config_1.config.JWT_SECRET, {
            expiresIn: tokenExpirationInSeconds,
        });
        return res.status(200).send({ token, expiresIn: tokenExpirationInSeconds });
    }
    catch (_a) {
        throw new Error("Failed to create user");
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield app_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new Error("User does not exist");
        }
        const hash = (0, crypto_1.pbkdf2Sync)(password, existingUser.salt, 1000, 64, `sha512`).toString(`hex`);
        if (hash === existingUser.password) {
            const tokenExpirationInSeconds = 60 * 60;
            const token = (0, jsonwebtoken_1.sign)({ userId: existingUser.id, email }, config_1.config.JWT_SECRET, {
                expiresIn: tokenExpirationInSeconds,
            });
            return res
                .status(200)
                .send({ token, expiresIn: tokenExpirationInSeconds });
        }
    }
    catch (_b) {
        throw new Error("Failed to sign in");
    }
});
exports.signIn = signIn;
//# sourceMappingURL=auth.js.map