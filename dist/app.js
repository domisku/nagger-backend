"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const init_services_1 = require("./init/init-services");
const handle_errors_1 = require("./middleware/handle-errors");
const auth_router_1 = __importDefault(require("./routers/auth-router"));
const notifications_router_1 = __importDefault(require("./routers/notifications-router"));
const app = (0, express_1.default)();
const PORT = 3000;
exports.prisma = new client_1.PrismaClient();
(0, init_services_1.initServices)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_router_1.default, notifications_router_1.default);
app.use(handle_errors_1.handleErrors);
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map