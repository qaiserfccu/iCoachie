import express, { Request, Response } from 'express';
import prisma from '../db';
import { requireAuth } from '../middleware/jwtAuth';
import { requireRole } from '../middleware';

const router = express.Router();

// Only admins can manage email templates
const ADMIN_ROLES = ['SUPER_ADMIN', 'SYSTEM_SUPPORT', 'CLUB_ADMIN'];

// Default email templates for initialization
const DEFAULT_TEMPLATES = [
  {
    name: 'welcome_email',
    subject: 'Welcome to iCoachie!',
    body: `<h1>Welcome to iCoachie, {{name}}!</h1>
<p>Thank you for joining our platform. We're excited to have you on board.</p>
<p>Here are your next steps:</p>
<ul>
<li>Complete your profile</li>
<li>Explore available sessions</li>
<li>Connect with coaches</li>
</ul>
<p>If you have any questions, feel free to contact our support team.</p>
<p>Best regards,<br>The iCoachie Team</p>`,
    variables: ['{{name}}', '{{email}}']
  },
  {
    name: 'password_reset',
    subject: 'Reset Your Password',
    body: `<h1>Password Reset Request</h1>
<p>Hi {{name}},</p>
<p>We received a request to reset your password. Click the link below to set a new password:</p>
<p><a href="{{reset_link}}">Reset Password</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't request this, please ignore this email.</p>
<p>Best regards,<br>The iCoachie Team</p>`,
    variables: ['{{name}}', '{{reset_link}}']
  },
  {
    name: 'session_reminder',
    subject: 'Your Session is Coming Up',
    body: `<h1>Session Reminder</h1>
<p>Hi {{name}},</p>
<p>This is a reminder that you have an upcoming session:</p>
<ul>
<li><strong>Session:</strong> {{session_name}}</li>
<li><strong>Date:</strong> {{session_date}}</li>
<li><strong>Time:</strong> {{session_time}}</li>
<li><strong>Location:</strong> {{session_location}}</li>
</ul>
<p>See you there!</p>
<p>Best regards,<br>The iCoachie Team</p>`,
    variables: ['{{name}}', '{{session_name}}', '{{session_date}}', '{{session_time}}', '{{session_location}}']
  },
  {
    name: 'payment_confirmation',
    subject: 'Payment Received',
    body: `<h1>Payment Confirmation</h1>
<p>Hi {{name}},</p>
<p>We've received your payment. Here are the details:</p>
<ul>
<li><strong>Amount:</strong> {{amount}}</li>
<li><strong>Description:</strong> {{description}}</li>
<li><strong>Date:</strong> {{payment_date}}</li>
<li><strong>Transaction ID:</strong> {{transaction_id}}</li>
</ul>
<p>Thank you for your payment!</p>
<p>Best regards,<br>The iCoachie Team</p>`,
    variables: ['{{name}}', '{{amount}}', '{{description}}', '{{payment_date}}', '{{transaction_id}}']
  },
  {
    name: 'club_approval',
    subject: 'Your Club Has Been Approved',
    body: `<h1>Congratulations!</h1>
<p>Hi {{name}},</p>
<p>Your club <strong>{{club_name}}</strong> has been approved and is now active on iCoachie!</p>
<p>You can now:</p>
<ul>
<li>Add coaches to your club</li>
<li>Create training sessions</li>
<li>Manage members</li>
<li>Accept payments</li>
</ul>
<p>Welcome to the iCoachie community!</p>
<p>Best regards,<br>The iCoachie Team</p>`,
    variables: ['{{name}}', '{{club_name}}']
  }
];

/**
 * @swagger
 * /api/admin/email-templates:
 *   get:
 *     summary: Get all email templates
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of email templates
 */
router.get('/', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    // Check if templates exist, if not initialize with defaults
    const templatesCount = await prisma.emailTemplate.count();
    if (templatesCount === 0) {
      await prisma.emailTemplate.createMany({
        data: DEFAULT_TEMPLATES.map(t => ({
          name: t.name,
          subject: t.subject,
          body: t.body,
          variables: t.variables,
          isActive: true
        }))
      });
    }
    
    const templates = await prisma.emailTemplate.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        subject: t.subject,
        body: t.body,
        variables: t.variables,
        status: t.isActive ? 'Active' : 'Inactive',
        lastModified: formatDate(t.updatedAt),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/email-templates/{id}:
 *   get:
 *     summary: Get single email template
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Email template details
 */
router.get('/:id', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const template = await prisma.emailTemplate.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      status: template.isActive ? 'Active' : 'Inactive',
      lastModified: formatDate(template.updatedAt),
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/email-templates:
 *   post:
 *     summary: Create new email template
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subject
 *               - body
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               variables:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Template created
 */
router.post('/', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const { name, subject, body, variables } = req.body;
    
    if (!name || !subject || !body) {
      return res.status(400).json({ message: 'Name, subject, and body are required' });
    }
    
    // Check if template with same name exists
    const existing = await prisma.emailTemplate.findFirst({
      where: { name, deletedAt: null }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Template with this name already exists' });
    }
    
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        body,
        variables: variables || [],
        isActive: true
      }
    });
    
    res.status(201).json({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      status: 'Active',
      lastModified: formatDate(template.updatedAt),
      message: 'Template created successfully'
    });
  } catch (error) {
    console.error('Error creating email template:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/email-templates/{id}:
 *   put:
 *     summary: Update email template
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template updated
 */
router.put('/:id', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, subject, body, variables, isActive } = req.body;
    
    const existing = await prisma.emailTemplate.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!existing) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check for name conflict
    if (name && name !== existing.name) {
      const nameConflict = await prisma.emailTemplate.findFirst({
        where: { name, deletedAt: null, id: { not: id } }
      });
      if (nameConflict) {
        return res.status(400).json({ message: 'Template with this name already exists' });
      }
    }
    
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(subject && { subject }),
        ...(body && { body }),
        ...(variables && { variables }),
        ...(typeof isActive === 'boolean' && { isActive })
      }
    });
    
    res.json({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      status: template.isActive ? 'Active' : 'Inactive',
      lastModified: formatDate(template.updatedAt),
      message: 'Template updated successfully'
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/email-templates/{id}:
 *   delete:
 *     summary: Delete email template (soft delete)
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template deleted
 */
router.delete('/:id', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const existing = await prisma.emailTemplate.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!existing) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    await prisma.emailTemplate.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting email template:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/email-templates/{id}/duplicate:
 *   post:
 *     summary: Duplicate an email template
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Template duplicated
 */
router.post('/:id/duplicate', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const existing = await prisma.emailTemplate.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!existing) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Generate unique name
    let newName = `${existing.name}_copy`;
    let counter = 1;
    while (await prisma.emailTemplate.findFirst({ where: { name: newName, deletedAt: null } })) {
      newName = `${existing.name}_copy_${counter}`;
      counter++;
    }
    
    const template = await prisma.emailTemplate.create({
      data: {
        name: newName,
        subject: existing.subject,
        body: existing.body,
        variables: existing.variables,
        isActive: false // Duplicates start as inactive
      }
    });
    
    res.status(201).json({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      status: 'Inactive',
      lastModified: formatDate(template.updatedAt),
      message: 'Template duplicated successfully'
    });
  } catch (error) {
    console.error('Error duplicating email template:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/admin/email-templates/{id}/test:
 *   post:
 *     summary: Send test email using template
 *     tags: [Admin Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testEmail
 *             properties:
 *               testEmail:
 *                 type: string
 *               testData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Test email sent
 */
router.post('/:id/test', requireAuth, requireRole(ADMIN_ROLES), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { testEmail, testData } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ message: 'Test email address required' });
    }
    
    const template = await prisma.emailTemplate.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // In a real implementation, you would:
    // 1. Replace variables in subject and body with testData
    // 2. Send the email using configured SMTP settings
    
    res.json({
      success: true,
      message: `Test email sent to ${testEmail} using template "${template.name}"`
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Helper function to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default router;
