/**
 * Unit tests for password hashing and verification
 *
 * @see src/lib/auth/password.ts
 * @see PRD Phase 1 Checkpoint CP-1.4
 */

import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  MIN_PASSWORD_LENGTH,
} from '@/lib/auth/password';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const password = 'my-secure-password-123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt hash format
      expect(hash).not.toBe(password);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'test-password-12345';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // bcrypt uses salt
    });

    it('should reject passwords shorter than minimum length', async () => {
      const shortPassword = 'short123'; // Less than 12 chars

      await expect(hashPassword(shortPassword)).rejects.toThrow(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
    });

    it('should accept passwords at minimum length', async () => {
      const minPassword = '123456789012'; // Exactly 12 chars

      const hash = await hashPassword(minPassword);
      expect(hash).toBeDefined();
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'my-secure-password-123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'correct-password-123';
      const wrongPassword = 'wrong-password-456';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should reject empty password', async () => {
      const password = 'my-secure-password-123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword('', hash);
      expect(isValid).toBe(false);
    });

    it('should handle invalid hash gracefully', async () => {
      const password = 'my-secure-password-123';
      const invalidHash = 'not-a-valid-bcrypt-hash';

      const isValid = await verifyPassword(password, invalidHash);
      expect(isValid).toBe(false);
    });

    it('should verify multiple correct passwords independently', async () => {
      const password1 = 'first-password-123';
      const password2 = 'second-password-456';

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      expect(await verifyPassword(password1, hash1)).toBe(true);
      expect(await verifyPassword(password2, hash2)).toBe(true);
      expect(await verifyPassword(password1, hash2)).toBe(false);
      expect(await verifyPassword(password2, hash1)).toBe(false);
    }, 60000); // 6 bcrypt operations at ~5-8s each in jsdom
  });

  describe('validatePassword', () => {
    it('should validate password meeting requirements', () => {
      const result = validatePassword('valid-password-123');

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject password shorter than minimum', () => {
      const result = validatePassword('short123');

      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
    });

    it('should reject empty password', () => {
      const result = validatePassword('');

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should accept password at exact minimum length', () => {
      const minPassword = '123456789012'; // 12 chars
      const result = validatePassword(minPassword);

      expect(result.valid).toBe(true);
    });
  });
});
