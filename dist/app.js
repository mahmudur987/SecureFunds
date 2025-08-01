"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
// import "./config/passport";
const globalError_1 = require("./app/middleware/globalError");
const notFound_1 = require("./app/middleware/notFound");
const modules_route_1 = require("./app/routes/modules.route");
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "your secrete",
    resave: false,
    saveUninitialized: false,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1/", modules_route_1.router);
app.get("/", (req, res) => {
    res.send("Hello from Express with TypeScript!");
});
app.use(globalError_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
