/**
 * Unit Tests for Password Utilities
 * 
 * Tests the password hashing and verification functions
 */

import { hashPassword, verifyPassword } from '../../src/utils/password';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'samePassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string password', async () => {
      const hash = await hashPassword('');
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    it('should handle special characters in password', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
    });

    it('should handle unicode characters in password', async () => {
      const password = '密码测试🔐';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'correctPassword';
      const hash = await hashPassword(password);
      
      const result = await verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const hash = await hashPassword(password);
      
      const result = await verifyPassword(wrongPassword, hash);
      expect(result).toBe(false);
    });

    it('should handle case sensitivity', async () => {
      const password = 'CaseSensitive';
      const hash = await hashPassword(password);
      
      const result = await verifyPassword('casesensitive', hash);
      expect(result).toBe(false);
    });

    it('should handle empty string password verification', async () => {
      const hash = await hashPassword('');
      
      const result = await verifyPassword('', hash);
      expect(result).toBe(true);
    });

    it('should handle whitespace-only passwords', async () => {
      const password = '   ';
      const hash = await hashPassword(password);
      
      const resultCorrect = await verifyPassword('   ', hash);
      const resultIncorrect = await verifyPassword('', hash);
      
      expect(resultCorrect).toBe(true);
      expect(resultIncorrect).toBe(false);
    });

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(100);
      const hash = await hashPassword(longPassword);
      
      const result = await verifyPassword(longPassword, hash);
      expect(result).toBe(true);
    });
  });
});
