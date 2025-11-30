import { Request, Response } from 'express';
import { FileService, FileUploadOptions } from '../services/fileService';
import { requireAuth } from '../middleware/jwtAuth';
import multer from 'multer';
import path from 'path';

const fileService = new FileService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Temporary storage - files will be moved by FileService
    cb(null, path.join(process.cwd(), 'temp'));
  },
  filename: (req, file, cb) => {
    // Generate temporary filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow common file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, documents, and zip files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const uploadFile = [
  requireAuth,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = (req as any).user;
      const { fileType, isPublic } = req.body;

      if (!fileType || !['AVATAR', 'DOCUMENT', 'CLUB_LOGO', 'CERTIFICATE', 'OTHER'].includes(fileType)) {
        return res.status(400).json({ error: 'Invalid file type' });
      }

      const options: FileUploadOptions = {
        fileType: fileType as any,
        isPublic: isPublic === 'true',
        clubId: user.clubId,
      };

      const fileMetadata = await fileService.uploadFile(req.file, user.id, options);

      res.status(201).json({
        message: 'File uploaded successfully',
        file: fileMetadata,
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
];

export const downloadFile = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const fileId = parseInt(req.params.id);

      if (isNaN(fileId)) {
        return res.status(400).json({ error: 'Invalid file ID' });
      }

      const filePath = await fileService.getFilePath(fileId, user.id, user.clubId);

      if (!filePath) {
        return res.status(404).json({ error: 'File not found or access denied' });
      }

      // Get file metadata for headers
      const fileMetadata = await fileService.getFileById(fileId, user.id, user.clubId);

      if (!fileMetadata) {
        return res.status(404).json({ error: 'File metadata not found' });
      }

      res.setHeader('Content-Type', fileMetadata.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.originalName}"`);

      res.sendFile(filePath);
    } catch (error) {
      console.error('File download error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  }
];

export const getFileToken = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const fileId = parseInt(req.params.id);

      if (isNaN(fileId)) {
        return res.status(400).json({ error: 'Invalid file ID' });
      }

      // Verify user has access to the file
      const fileMetadata = await fileService.getFileById(fileId, user.id, user.clubId);

      if (!fileMetadata) {
        return res.status(404).json({ error: 'File not found or access denied' });
      }

      const token = fileService.generateFileToken(fileId, user.id);

      res.json({ token });
    } catch (error) {
      console.error('File token generation error:', error);
      res.status(500).json({ error: 'Failed to generate file token' });
    }
  }
];

export const serveFileByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenData = fileService.verifyFileToken(token);

    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { fileId, userId } = tokenData;

    // Get user info for club context (optional for public files)
    const fileMetadata = await fileService.getFileById(fileId);

    if (!fileMetadata) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = await fileService.getFilePath(fileId);

    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', fileMetadata.mimeType);
    res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour

    // For images, allow inline display
    if (fileMetadata.mimeType.startsWith('image/')) {
      res.setHeader('Content-Disposition', 'inline');
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.originalName}"`);
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
};

export const getUserFiles = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      const files = await fileService.getUserFiles(user.id, user.clubId);

      res.json({ files });
    } catch (error) {
      console.error('Get user files error:', error);
      res.status(500).json({ error: 'Failed to retrieve files' });
    }
  }
];

export const getClubFiles = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      if (!user.clubId) {
        return res.status(400).json({ error: 'User is not associated with a club' });
      }

      const files = await fileService.getClubFiles(user.clubId);

      res.json({ files });
    } catch (error) {
      console.error('Get club files error:', error);
      res.status(500).json({ error: 'Failed to retrieve files' });
    }
  }
];

export const deleteFile = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const fileId = parseInt(req.params.id);

      if (isNaN(fileId)) {
        return res.status(400).json({ error: 'Invalid file ID' });
      }

      const success = await fileService.deleteFile(fileId, user.id);

      if (!success) {
        return res.status(404).json({ error: 'File not found or access denied' });
      }

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('File deletion error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }
];