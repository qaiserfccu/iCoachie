import prisma from '../db';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export interface FileUploadOptions {
  fileType: 'AVATAR' | 'DOCUMENT' | 'CLUB_LOGO' | 'CERTIFICATE' | 'OTHER';
  isPublic?: boolean;
  clubId?: number;
}

export interface FileMetadata {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileType: string;
  filePath: string;
  uploadedBy: number;
  clubId?: number;
  isPublic: boolean;
  createdAt: Date;
}

export class FileService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  private getTenantPath(clubId?: number): string {
    if (!clubId) return 'global';
    return `club-${clubId}`;
  }

  private generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const timestamp = Date.now();
    const randomId = uuidv4().substring(0, 8);
    return `${baseName}-${timestamp}-${randomId}${ext}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadedBy: number,
    options: FileUploadOptions
  ): Promise<FileMetadata> {
    const { fileType, isPublic = false, clubId } = options;

    // Generate unique filename
    const uniqueFilename = this.generateUniqueFilename(file.originalname);

    // Create tenant-specific directory path
    const tenantPath = this.getTenantPath(clubId);
    const fullDirPath = path.join(this.uploadsDir, tenantPath, fileType.toLowerCase());
    const relativeFilePath = path.join(tenantPath, fileType.toLowerCase(), uniqueFilename);
    const fullFilePath = path.join(this.uploadsDir, relativeFilePath);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullFilePath), { recursive: true });

    // Move file to final location
    await fs.rename(file.path, fullFilePath);

    // Save file metadata to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: uniqueFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        fileType: fileType as any,
        filePath: relativeFilePath,
        uploadedBy,
        clubId,
        isPublic,
      },
    });

    return {
      id: fileRecord.id,
      filename: fileRecord.filename,
      originalName: fileRecord.originalName,
      mimeType: fileRecord.mimeType,
      size: fileRecord.size,
      fileType: fileRecord.fileType,
      filePath: fileRecord.filePath,
      uploadedBy: fileRecord.uploadedBy,
      clubId: fileRecord.clubId || undefined,
      isPublic: fileRecord.isPublic,
      createdAt: fileRecord.createdAt,
    };
  }

  async getFileById(fileId: number, userId?: number, clubId?: number): Promise<FileMetadata | null> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.deletedAt) return null;

    // Check access permissions
    if (!file.isPublic) {
      // Private files can only be accessed by the uploader or users in the same club
      if (file.uploadedBy !== userId && file.clubId !== clubId) {
        return null;
      }
    }

    return {
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      fileType: file.fileType,
      filePath: file.filePath,
      uploadedBy: file.uploadedBy,
      clubId: file.clubId || undefined,
      isPublic: file.isPublic,
      createdAt: file.createdAt,
    };
  }

  async getFilePath(fileId: number, userId?: number, clubId?: number): Promise<string | null> {
    const file = await this.getFileById(fileId, userId, clubId);
    if (!file) return null;

    return path.join(this.uploadsDir, file.filePath);
  }

  async deleteFile(fileId: number, userId: number): Promise<boolean> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.deletedAt || file.uploadedBy !== userId) {
      return false;
    }

    // Soft delete the file record
    await prisma.file.update({
      where: { id: fileId },
      data: { deletedAt: new Date() },
    });

    // Optionally remove the physical file
    try {
      const filePath = path.join(this.uploadsDir, file.filePath);
      await fs.unlink(filePath);
    } catch (error) {
      // Log error but don't fail the operation
      console.error('Failed to delete physical file:', error);
    }

    return true;
  }

  generateFileToken(fileId: number, userId: number, expiresIn: string = '1h'): string {
    return jwt.sign({ fileId, userId, type: 'file_access' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
  }

  verifyFileToken(token: string): { fileId: number; userId: number } | null {
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      const decoded = jwt.verify(token, secret) as any;
      if (decoded.type !== 'file_access') return null;
      return { fileId: decoded.fileId, userId: decoded.userId };
    } catch {
      return null;
    }
  }

  async getUserFiles(userId: number, clubId?: number): Promise<FileMetadata[]> {
    const files = await prisma.file.findMany({
      where: {
        uploadedBy: userId,
        clubId: clubId || null,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => ({
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      fileType: file.fileType,
      filePath: file.filePath,
      uploadedBy: file.uploadedBy,
      clubId: file.clubId || undefined,
      isPublic: file.isPublic,
      createdAt: file.createdAt,
    }));
  }

  async getClubFiles(clubId: number): Promise<FileMetadata[]> {
    const files = await prisma.file.findMany({
      where: {
        clubId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => ({
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      fileType: file.fileType,
      filePath: file.filePath,
      uploadedBy: file.uploadedBy,
      clubId: file.clubId || undefined,
      isPublic: file.isPublic,
      createdAt: file.createdAt,
    }));
  }
}