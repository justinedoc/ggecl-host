// src/utils/tokenUtils.ts
import jwt from "jsonwebtoken";
import { envConfig } from "../config/envValidator.js";
type TokenType = "accessToken" | "refreshToken";
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
const TOKEN_CONFIG = {
  accessToken: {
    secret: envConfig.accessToken,
    expiresIn: "15m", // Short-lived
  },
  refreshToken: {
    secret: envConfig.refreshToken,
    expiresIn: "7d", // Long-lived
  },
} as const;

interface GenerateTokenParams {
  id: string;
  type: TokenType;
  role: any;
}

export function generateToken({ id, type, role }: GenerateTokenParams): string {
  return jwt.sign({ id, role }, TOKEN_CONFIG[type].secret, {
    expiresIn: TOKEN_CONFIG[type].expiresIn,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string, type: TokenType) {
  return jwt.verify(token, TOKEN_CONFIG[type].secret) as {
    id: string;
    role: string;
  };
}
