import dotenv from "dotenv";
dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "DB_URL",
  "NODE_ENV",
  "SUPER_ADMIN_PASSWORD",
  "SUPER_ADMIN_EMAIL",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRES",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRES",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "FRONT_END_URL",
  "EXPRESS_SESSION-SECRATE",
  "SSL_STORE_ID",
  "SSL_STORE_PASS",
  "SSL_PAYMENT_API",
  "SSL_VALIDATION_API",
  "SSL_SUCCESS_BACKEND_URL",
  "SSL_FAIL_BACKEND_URL",
  "SSL_CANCEL_BACKEND_URL",
  "SSL_SUCCESS_FRONTEND_URL",
  "SSL_FAIL_FRONTEND_URL",
  "SSL_CANCEL_FRONTEND_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "REDIS_USER_NAME",
  "REDIS_PASSWORD",
  "REDIS_HOST",
  "REDIS_PORT",
] as const;

type RequiredEnv = (typeof requiredEnvVariables)[number];

type EnvVariables = Record<RequiredEnv, string>;

const loadEnvVariable = (): EnvVariables => {
  const config: Partial<EnvVariables> = {};

  requiredEnvVariables.forEach((key) => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    config[key] = value;
  });

  return config as EnvVariables;
};

export const envVariables = loadEnvVariable();
