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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("../config/env.config");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const transport = nodemailer_1.default.createTransport({
    host: env_config_1.envVariables.SMTP_HOST,
    port: Number(env_config_1.envVariables.SMTP_PORT),
    auth: {
        user: env_config_1.envVariables.SMTP_USER,
        pass: env_config_1.envVariables.SMTP_PASS,
    },
    secure: true,
});
const sendmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateData, attachments, }) {
    try {
        const templatePath = path_1.default.join(__dirname, `./template/${templateName}.ejs`);
        const templateContent = yield ejs_1.default.renderFile(templatePath, templateData || {});
        const info = yield transport.sendMail({
            from: env_config_1.envVariables.SMTP_FROM,
            to,
            subject,
            html: templateContent,
            text: templateContent.replace(/<[^>]*>/g, ""), // optional plain text
            attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((item) => ({
                filename: item.filename,
                content: item.content,
                contentType: item.contentType,
            })),
        });
        console.log("Email sent. Message ID:", info.messageId);
    }
    catch (error) {
        console.error("Email send error:", error);
        throw new Error("Failed to send email");
    }
});
exports.sendmail = sendmail;
