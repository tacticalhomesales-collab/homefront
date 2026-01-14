/**
 * Authentication utilities
 * Token generation, hashing, and validation
 */

import { createHash, randomBytes } from "crypto";

/**
 * Generate a random public referral code (6 characters, alphanumeric)
 * Example: "AB12CD"
 */
export function generatePublicCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excluding I, O, 0, 1 for clarity
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Generate a secure random portal token (32 bytes, hex)
 * This is the secret token stored in httpOnly cookie
 */
export function generatePortalToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hash a portal token using SHA-256
 * Store this hash in the database, not the raw token
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Verify a portal token against a stored hash
 */
export function verifyToken(token: string, hash: string): boolean {
  return hashToken(token) === hash;
}

/**
 * Generate a unique partner ID
 */
export function generatePartnerId(): string {
  return `partner_${Date.now()}_${randomBytes(8).toString("hex")}`;
}

/**
 * Generate a unique referral ID
 */
export function generateReferralId(): string {
  return `ref_${Date.now()}_${randomBytes(8).toString("hex")}`;
}
