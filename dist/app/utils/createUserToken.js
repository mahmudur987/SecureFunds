"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const env_config_1 = require("../config/env.config");
const generateToken_1 = require("./generateToken");
const createUserToken = (user) => {
    const jwtPayload = {
        name: user.name,
        email: user.email,
        _id: user._id,
        phone: user.phone,
        role: user.role,
    };
    const accessToken = (0, generateToken_1.generateToken)(jwtPayload, env_config_1.envVariables.ACCESS_TOKEN_SECRET, env_config_1.envVariables.ACCESS_TOKEN_EXPIRES);
    const refreshToken = (0, generateToken_1.generateToken)(jwtPayload, env_config_1.envVariables.REFRESH_TOKEN_SECRET, env_config_1.envVariables.REFRESH_TOKEN_EXPIRES);
    return { accessToken, refreshToken };
};
exports.createUserToken = createUserToken;
