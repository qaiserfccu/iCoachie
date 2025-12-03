import express, { Request, Response } from 'express';
import prisma from '../db';
import { requireAuth } from '../middleware/jwtAuth';
import { requireRole } from '../middleware';

const router = express.Router();

// Only super admins can access settings
const ADMIN_ROLES = ['SUPER_ADMIN', 'SYSTEM_SUPPORT'];

// Default settings for initialization
const DEFAULT_SETTINGS = [
  // General Settings
  { key: 'platform_name', value: 'iCoachie', category: 'general' },
  { key: 'support_email', value: 'support@icoachie.com', category: 'general' },
  { key: 'default_timezone', value: 'UTC', category: 'general' },
  { key: 'default_currency', value: 'USD', category: 'general' },
  { key: 'platform_description', value: 'The all-in-one platform for sports clubs, coaches, and families.', category: 'general' },
  { key: 'date_format', value: 'MM/DD/YYYY', category: 'general' },
  
  // Feature Toggles
  { key: 'enable_registrations', value: 'true', category: 'features' },
  { key: 'enable_club_registrations', value: 'true', category: 'features' },
  { key: 'enable_freelancer_mode', value: 'true', category: 'features' },
  { key: 'enable_online_payments', value: 'true', category: 'features' },
  { key: 'enable_chat_system', value: 'true', category: 'features' },
  { key: 'maintenance_mode', value: 'false', category: 'features' },
  
  // Email Settings
  { key: 'smtp_host', value: '', category: 'email' },
  { key: 'smtp_port', value: '587', category: 'email' },
  { key: 'smtp_username', value: '', category: 'email' },
  { key: 'smtp_password', value: '', category: 'email', isEncrypted: true },
  { key: 'smtp_from_email', value: '', category: 'email' },
  { key: 'smtp_from_name', value: 'iCoachie', category: 'email' },
  
  // Notification Settings
  { key: 'notify_new_user', value: 'true', category: 'notifications' },
  { key: 'notify_new_club', value: 'true', category: 'notifications' },
  { key: 'notify_payment_received', value: 'true', category: 'notifications' },
  { key: 'notify_refund_requests', value: 'true', category: 'notifications' },
  { key: 'notify_support_tickets', value: 'true', category: 'notifications' },
  
  // Security Settings
  { key: 'session_timeout', value: '30', category: 'security' },
  { key: 'max_login_attempts', value: '5', category: 'security' },
  { key: 'require_2fa_admin', value: 'true', category: 'security' },
  { key: 'force_password_change', value: 'false', category: 'security' },
  { key: 'ip_whitelisting', value: 'false', category: 'security' },
  
  // Payment Settings
  { key: 'payment_provider', value: 'stripe', category: 'payments' },
  { key: 'stripe_publishable_key', value: '', category: 'payments' },
  { key: 'stripe_secret_key', value: '', category: 'payments', isEncrypted: true },
  { key: 'platform_fee_percentage', value: '5', category: 'payments' },
];

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Get all system settings
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (general, email, notifications, security, payments, features)
 *     responses:
 *       200:
 *         description: System settings
 */
router.get('/', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    
    // Check if settings exist, if not initialize with defaults
    const settingsCount = await prisma.systemSettings.count();
    if (settingsCount === 0) {
      // Initialize default settings
      await prisma.systemSettings.createMany({
        data: DEFAULT_SETTINGS.map(s => ({
          key: s.key,
          value: s.value,
          category: s.category,
          isEncrypted: s.isEncrypted || false
        }))
      });
    }
    
    const where = category ? { category } : {};
    const settings = await prisma.systemSettings.findMany({ where });
    
    // Convert to object format for easier frontend consumption
    const settingsObj: Record<string, Record<string, string>> = {};
    
    for (const setting of settings) {
      if (!settingsObj[setting.category]) {
        settingsObj[setting.category] = {};
      }
      // Don't expose encrypted values directly - always mask if field is encrypted
      settingsObj[setting.category][setting.key] = setting.isEncrypted
        ? '********'
        : setting.value;
    }
    
    // Filter out encrypted values from raw response too
    const safeRaw = settings.map(s => ({
      ...s,
      value: s.isEncrypted ? '********' : s.value
    }));
    
    res.json({ settings: settingsObj, raw: safeRaw });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/settings:
 *   put:
 *     summary: Update system settings
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object required' });
    }
    
    const updates: Array<{ key: string; value: string }> = [];
    
    // Flatten nested settings object
    for (const category of Object.keys(settings)) {
      const categorySettings = settings[category];
      if (typeof categorySettings === 'object') {
        for (const key of Object.keys(categorySettings)) {
          // Skip encrypted placeholder values
          if (categorySettings[key] !== '********') {
            updates.push({ key, value: String(categorySettings[key]) });
          }
        }
      }
    }
    
    // Update each setting
    for (const update of updates) {
      await prisma.systemSettings.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: {
          key: update.key,
          value: update.value,
          category: getCategory(update.key),
          isEncrypted: isEncryptedField(update.key)
        }
      });
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/settings/test-email:
 *   post:
 *     summary: Test email configuration
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test email configuration validated (email sending not yet implemented)
 */
router.post('/test-email', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ message: 'Test email address required' });
    }
    
    // Get email settings from database
    const emailSettings = await prisma.systemSettings.findMany({
      where: { category: 'email' }
    });
    
    const smtpHost = emailSettings.find(s => s.key === 'smtp_host')?.value;
    const smtpPort = emailSettings.find(s => s.key === 'smtp_port')?.value;
    
    if (!smtpHost || !smtpPort) {
      return res.status(400).json({ 
        success: false,
        message: 'SMTP configuration incomplete. Please configure SMTP host and port.' 
      });
    }
    
    // Note: Email sending functionality is not yet implemented.
    // This endpoint validates the SMTP configuration is present.
    // To implement actual email sending, integrate with nodemailer or similar.
    
    res.json({ 
      success: true, 
      message: `Configuration validated. SMTP server: ${smtpHost}:${smtpPort}. Note: Actual email sending is not yet implemented - this validates your configuration is saved.`
    });
  } catch (error) {
    console.error('Error testing email:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Helper to determine category from key
function getCategory(key: string): string {
  if (key.startsWith('smtp_') || key.includes('email')) return 'email';
  if (key.startsWith('notify_')) return 'notifications';
  if (key.includes('security') || key.includes('password') || key.includes('2fa') || key.includes('session') || key.includes('login')) return 'security';
  if (key.includes('stripe') || key.includes('payment') || key.includes('fee')) return 'payments';
  if (key.startsWith('enable_') || key.includes('mode')) return 'features';
  return 'general';
}

// Helper to determine if field should be encrypted
function isEncryptedField(key: string): boolean {
  const encryptedFields = ['smtp_password', 'stripe_secret_key'];
  return encryptedFields.includes(key);
}

export default router;
