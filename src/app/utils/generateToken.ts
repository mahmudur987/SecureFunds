import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
// adjust path as needed

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
): string => {
  if (!secret) {
    throw new Error("JWT secret is required to sign the token.");
  }

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};
