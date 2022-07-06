import jwt from "jsonwebtoken";
import AppConfig from "../config/appConfig";
const config = AppConfig.getInstance().config;

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(config[keyName], "base64").toString("ascii");
  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): { valid: boolean; expired: boolean; decoded: T | null } {
  const publicKey = Buffer.from(config[keyName], "base64").toString("ascii");
  try {
    const decoded = jwt.verify(token, publicKey) as unknown as T;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
