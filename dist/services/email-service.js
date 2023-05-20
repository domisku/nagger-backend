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
exports.EmailService = void 0;
const nodemailer_1 = require("nodemailer");
class EmailService {
    static sendMail(to, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EmailService.transport.sendMail({
                from: `${process.env.SMTP_EMAIL}`,
                to,
                subject: "Notification",
                text,
                html,
            });
        });
    }
}
EmailService.transport = (0, nodemailer_1.createTransport)({
    service: "gmail",
    auth: {
        user: `${process.env.SMTP_EMAIL}`,
        pass: `${process.env.SMTP_PASSWORD}`,
    },
});
exports.EmailService = EmailService;
//# sourceMappingURL=email-service.js.map