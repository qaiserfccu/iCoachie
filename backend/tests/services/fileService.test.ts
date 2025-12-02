/**
 * Unit Tests for File Service
 * 
 * Tests the file upload, download, and management service
 */

import jwt from 'jsonwebtoken';
import { FileService } from '../../src/services/fileService';

// Mock the Prisma client
jest.mock('../../src/db', () => ({
  __esModule: true,
  default: {
    file: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    unlink: jest.fn(),
  },
}));

import prisma from '../../src/db';
import { promises as fs } from 'fs';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock directory access to succeed
    (mockFs.access as jest.Mock).mockResolvedValue(undefined);
    fileService = new FileService();
  });

  describe('constructor', () => {
    it('should create uploads directory if it does not exist', async () => {
      (mockFs.access as jest.Mock).mockRejectedValueOnce(new Error('ENOENT'));
      (mockFs.mkdir as jest.Mock).mockResolvedValue(undefined);

      // Create new instance to trigger directory creation
      new FileService();

      // Give time for async operation
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockFs.mkdir).toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    const mockFile = {
      originalname: 'test-image.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
      path: '/tmp/upload-123',
    } as Express.Multer.File;

    it('should upload a file successfully', async () => {
      const mockFileRecord = {
        id: 1,
        filename: 'test-image-123-abc.jpg',
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        fileType: 'AVATAR',
        filePath: 'global/avatar/test-image-123-abc.jpg',
        uploadedBy: 1,
        clubId: null,
        isPublic: false,
        createdAt: new Date(),
      };

      (mockPrisma.file.create as jest.Mock).mockResolvedValue(mockFileRecord);
      (mockFs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (mockFs.rename as jest.Mock).mockResolvedValue(undefined);

      const result = await fileService.uploadFile(mockFile, 1, {
        fileType: 'AVATAR',
        isPublic: false,
      });

      expect(result.id).toBe(1);
      expect(result.originalName).toBe('test-image.jpg');
      expect(result.mimeType).toBe('image/jpeg');
      expect(mockFs.rename).toHaveBeenCalled();
    });

    it('should create club-specific path when clubId is provided', async () => {
      const mockFileRecord = {
        id: 2,
        filename: 'logo-123-abc.png',
        originalName: 'logo.png',
        mimeType: 'image/png',
        size: 2048,
        fileType: 'CLUB_LOGO',
        filePath: 'club-5/club_logo/logo-123-abc.png',
        uploadedBy: 1,
        clubId: 5,
        isPublic: true,
        createdAt: new Date(),
      };

      (mockPrisma.file.create as jest.Mock).mockResolvedValue(mockFileRecord);
      (mockFs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (mockFs.rename as jest.Mock).mockResolvedValue(undefined);

      const result = await fileService.uploadFile(
        { ...mockFile, originalname: 'logo.png', mimetype: 'image/png' } as Express.Multer.File,
        1,
        {
          fileType: 'CLUB_LOGO',
          isPublic: true,
          clubId: 5,
        }
      );

      expect(result.clubId).toBe(5);
      expect(result.isPublic).toBe(true);
    });
  });

  describe('getFileById', () => {
    it('should return file when user is the uploader', async () => {
      const mockFile = {
        id: 1,
        filename: 'test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        fileType: 'DOCUMENT',
        filePath: 'global/document/test.jpg',
        uploadedBy: 1,
        clubId: null,
        isPublic: false,
        createdAt: new Date(),
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.getFileById(1, 1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('should return null for deleted file', async () => {
      const mockFile = {
        id: 1,
        deletedAt: new Date(),
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.getFileById(1, 1);

      expect(result).toBeNull();
    });

    it('should return null when file does not exist', async () => {
      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await fileService.getFileById(999, 1);

      expect(result).toBeNull();
    });

    it('should return public file for any user', async () => {
      const mockFile = {
        id: 1,
        filename: 'public.jpg',
        originalName: 'public.jpg',
        mimeType: 'image/jpeg',
        size: 512,
        fileType: 'AVATAR',
        filePath: 'global/avatar/public.jpg',
        uploadedBy: 2,
        clubId: null,
        isPublic: true,
        createdAt: new Date(),
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.getFileById(1, 5);

      expect(result).not.toBeNull();
    });

    it('should return null for private file when user is not uploader or club member', async () => {
      const mockFile = {
        id: 1,
        filename: 'private.jpg',
        originalName: 'private.jpg',
        mimeType: 'image/jpeg',
        size: 512,
        fileType: 'DOCUMENT',
        filePath: 'club-1/document/private.jpg',
        uploadedBy: 2,
        clubId: 1,
        isPublic: false,
        createdAt: new Date(),
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.getFileById(1, 5, 2);

      expect(result).toBeNull();
    });

    it('should return private file for club member', async () => {
      const mockFile = {
        id: 1,
        filename: 'club-doc.pdf',
        originalName: 'club-doc.pdf',
        mimeType: 'application/pdf',
        size: 2048,
        fileType: 'DOCUMENT',
        filePath: 'club-1/document/club-doc.pdf',
        uploadedBy: 2,
        clubId: 1,
        isPublic: false,
        createdAt: new Date(),
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.getFileById(1, 5, 1);

      expect(result).not.toBeNull();
    });
  });

  describe('deleteFile', () => {
    it('should soft delete file when user is uploader', async () => {
      const mockFile = {
        id: 1,
        uploadedBy: 1,
        filePath: 'global/document/test.pdf',
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (mockPrisma.file.update as jest.Mock).mockResolvedValue({ ...mockFile, deletedAt: new Date() });
      (mockFs.unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await fileService.deleteFile(1, 1);

      expect(result).toBe(true);
      expect(mockPrisma.file.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should return false if file does not exist', async () => {
      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await fileService.deleteFile(999, 1);

      expect(result).toBe(false);
    });

    it('should return false if user is not the uploader', async () => {
      const mockFile = {
        id: 1,
        uploadedBy: 2,
        filePath: 'global/document/test.pdf',
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.deleteFile(1, 1);

      expect(result).toBe(false);
    });

    it('should return false if file is already deleted', async () => {
      const mockFile = {
        id: 1,
        uploadedBy: 1,
        filePath: 'global/document/test.pdf',
        deletedAt: new Date(),
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await fileService.deleteFile(1, 1);

      expect(result).toBe(false);
    });

    it('should still succeed even if physical file deletion fails', async () => {
      const mockFile = {
        id: 1,
        uploadedBy: 1,
        filePath: 'global/document/test.pdf',
        deletedAt: null,
      };

      (mockPrisma.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (mockPrisma.file.update as jest.Mock).mockResolvedValue({ ...mockFile, deletedAt: new Date() });
      (mockFs.unlink as jest.Mock).mockRejectedValue(new Error('File not found'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await fileService.deleteFile(1, 1);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('generateFileToken', () => {
    it('should generate a valid JWT token', () => {
      const token = fileService.generateFileToken(1, 1);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include fileId and userId in token', () => {
      const token = fileService.generateFileToken(5, 10);
      const decoded = jwt.decode(token) as any;

      expect(decoded.fileId).toBe(5);
      expect(decoded.userId).toBe(10);
      expect(decoded.type).toBe('file_access');
    });
  });

  describe('verifyFileToken', () => {
    it('should verify a valid token', () => {
      const token = fileService.generateFileToken(1, 2);
      const result = fileService.verifyFileToken(token);

      expect(result).not.toBeNull();
      expect(result?.fileId).toBe(1);
      expect(result?.userId).toBe(2);
    });

    it('should return null for invalid token', () => {
      const result = fileService.verifyFileToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null for token with wrong type', () => {
      const token = jwt.sign(
        { fileId: 1, userId: 2, type: 'other_type' },
        process.env.JWT_SECRET || 'fallback-secret'
      );

      const result = fileService.verifyFileToken(token);

      expect(result).toBeNull();
    });
  });

  describe('getUserFiles', () => {
    it('should return files for user', async () => {
      const mockFiles = [
        {
          id: 1,
          filename: 'file1.jpg',
          originalName: 'file1.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          fileType: 'AVATAR',
          filePath: 'global/avatar/file1.jpg',
          uploadedBy: 1,
          clubId: null,
          isPublic: false,
          createdAt: new Date(),
        },
      ];

      (mockPrisma.file.findMany as jest.Mock).mockResolvedValue(mockFiles);

      const result = await fileService.getUserFiles(1);

      expect(result).toHaveLength(1);
      expect(result[0].uploadedBy).toBe(1);
    });

    it('should filter by clubId when provided', async () => {
      (mockPrisma.file.findMany as jest.Mock).mockResolvedValue([]);

      await fileService.getUserFiles(1, 5);

      expect(mockPrisma.file.findMany).toHaveBeenCalledWith({
        where: {
          uploadedBy: 1,
          clubId: 5,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getClubFiles', () => {
    it('should return files for club', async () => {
      const mockFiles = [
        {
          id: 1,
          filename: 'club-file.pdf',
          originalName: 'club-file.pdf',
          mimeType: 'application/pdf',
          size: 2048,
          fileType: 'DOCUMENT',
          filePath: 'club-1/document/club-file.pdf',
          uploadedBy: 2,
          clubId: 1,
          isPublic: false,
          createdAt: new Date(),
        },
      ];

      (mockPrisma.file.findMany as jest.Mock).mockResolvedValue(mockFiles);

      const result = await fileService.getClubFiles(1);

      expect(result).toHaveLength(1);
      expect(mockPrisma.file.findMany).toHaveBeenCalledWith({
        where: {
          clubId: 1,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
