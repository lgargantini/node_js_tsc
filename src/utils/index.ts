import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HTTP_STATUS_ERROR_CODES, JWT_SECRET_KEY } from "./constants";
import crypto from "crypto";
import { ValidationException } from "./types/exception";

export interface ResetTokenInfo{
  resetToken: string,
  resetTokenExpiration: number
}

export const generateBcryptSafePassword = async (password: string): Promise<string> => {
  //  Encrypt and hash the password
  if(!password){
    throw new ValidationException(
      "ValidationError",
      HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      "password must be provided",
    );
  }
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export const validateBcryptPassword = async (password: string, encripted: string): Promise<boolean> => (
  await bcrypt.compare(password, encripted)
)

export const generateJWTToken = (id: string): string => {
  return jwt.sign({ userId: id }, JWT_SECRET_KEY)
}

export const generateResetTokenInfo = (): ResetTokenInfo => {
  const randomValues = crypto.getRandomValues(new Uint8Array(32));
    return {
      resetToken:Array.from(randomValues, byte => byte.toString(16).padStart(2, '0')).join(''),
      resetTokenExpiration: Date.now() + 3600000
    }
}

export default {
  generateBcryptSafePassword,
  validateBcryptPassword,
  generateJWTToken,
  generateResetTokenInfo,
}

