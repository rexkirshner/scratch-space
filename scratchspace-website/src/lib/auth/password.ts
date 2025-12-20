/**
 * Password hashing and verification utilities
 * Uses bcrypt with cost factor 12 for secure password storage
 *
 * @module lib/auth/password
 * @see PRD Phase 1: Database & Auth Foundation
 */

import * as bcrypt from 'bcryptjs';

/**
 * Cost factor for bcrypt hashing
 * Higher values = more secure but slower
 * 12 is recommended for production (takes ~300ms)
 */
const BCRYPT_ROUNDS = 12;

/**
 * Minimum password length requirement
 * PRD specifies 12+ characters minimum
 */
export const MIN_PASSWORD_LENGTH = 12;

/**
 * Hash a plaintext password using bcrypt
 *
 * @param password - Plaintext password to hash
 * @returns Promise<string> - Bcrypt hash string
 * @throws Error if password is too short
 *
 * @example
 * const hash = await hashPassword('my-secure-password-123');
 * // Returns: $2a$12$...
 */
export async function hashPassword(password: string): Promise<string> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  }

  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a plaintext password against a bcrypt hash
 *
 * @param password - Plaintext password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns Promise<boolean> - True if password matches, false otherwise
 *
 * @example
 * const isValid = await verifyPassword('my-password', storedHash);
 * if (isValid) {
 *   // Password correct
 * }
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    // Invalid hash format or other bcrypt error
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Validate password meets minimum requirements
 * Currently only checks length, but can be extended for complexity rules
 *
 * @param password - Password to validate
 * @returns { valid: boolean; error?: string }
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    };
  }

  return { valid: true };
}
