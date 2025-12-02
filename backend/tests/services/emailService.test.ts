/**
 * Unit Tests for Email Service
 * 
 * Tests the email sending functionality for password resets
 * Note: nodemailer is listed as types-only in package.json (a bug in original setup)
 * This test mocks the module to validate service behavior
 */

// Setup mock before anything else
const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: mockSendMail,
  }),
}), { virtual: true });

// Now import the service
import { sendPasswordReset } from '../../src/services/emailService';

describe('Email Service', () => {
  beforeEach(() => {
    mockSendMail.mockClear();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
  });

  describe('sendPasswordReset', () => {
    it('should send password reset email with correct parameters', async () => {
      const email = 'test@example.com';
      const token = 'reset-token-123';

      await sendPasswordReset(email, token);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: 'iCoachie password reset',
        })
      );
    });

    it('should include reset URL with token in email body', async () => {
      const email = 'user@test.com';
      const token = 'abc123token';

      await sendPasswordReset(email, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.text).toContain(token);
      expect(callArgs.html).toContain(token);
      expect(callArgs.text).toContain('reset-password');
      expect(callArgs.html).toContain('reset-password');
    });

    it('should use default from address when SMTP_FROM is not set', async () => {
      const originalEnv = process.env.SMTP_FROM;
      delete process.env.SMTP_FROM;

      await sendPasswordReset('test@example.com', 'token');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.from).toBe('no-reply@icoachie.local');

      process.env.SMTP_FROM = originalEnv;
    });

    it('should use default FRONTEND_URL when not set', async () => {
      const originalEnv = process.env.FRONTEND_URL;
      delete process.env.FRONTEND_URL;

      await sendPasswordReset('test@example.com', 'token');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.text).toContain('localhost:3001');

      process.env.FRONTEND_URL = originalEnv;
    });

    it('should handle email sending failure', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('SMTP connection failed'));

      await expect(sendPasswordReset('test@example.com', 'token')).rejects.toThrow(
        'SMTP connection failed'
      );
    });

    it('should construct proper reset URL format', async () => {
      await sendPasswordReset('test@example.com', 'my-token-123');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('href="');
      expect(callArgs.html).toContain('reset-password?token=my-token-123');
    });
  });
});
