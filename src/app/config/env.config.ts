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
  "SUPER_ADMIN_PHONE",
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
