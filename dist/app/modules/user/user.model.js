"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(user_interface_1.Role), default: user_interface_1.Role.USER },
    phone: { type: String, required: true, unique: true },
    picture: { type: String },
    address: { type: String },
    isEmailVerified: { type: Boolean, default: true },
    isPhoneVerified: { type: Boolean, default: true },
    status: {
        type: String,
        enum: Object.values(user_interface_1.Status),
        default: user_interface_1.Status.ACTIVE,
    },
    auths: [authProviderSchema],
    isDeleted: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    loginWrongAttempts: { type: Number, default: 0 },
    lastLogin: { type: Date },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
}, { versionKey: false, timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
//
// export const userJsonForCreate: IUSER = ;
