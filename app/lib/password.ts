import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const keyLength = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, keyLength)) as Buffer;

  return `scrypt:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash?: string | null) {
  if (!passwordHash) return false;

  const [scheme, salt, storedKey] = passwordHash.split(":");
  if (scheme !== "scrypt" || !salt || !storedKey) return false;

  const storedBuffer = Buffer.from(storedKey, "hex");
  const key = (await scryptAsync(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === key.length && timingSafeEqual(storedBuffer, key);
}
