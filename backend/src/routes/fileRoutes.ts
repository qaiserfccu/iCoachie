import { Router } from 'express';
import {
  uploadFile,
  downloadFile,
  getFileToken,
  serveFileByToken,
  getUserFiles,
  getClubFiles,
  deleteFile
} from '../controllers/fileController';

const router = Router();

// File upload endpoint
router.post('/upload', uploadFile);

// File download endpoint (authenticated)
router.get('/:id/download', downloadFile);

// Get file access token
router.get('/:id/token', getFileToken);

// Serve file by token (public endpoint for secure access)
router.get('/token/:token', serveFileByToken);

// Get user's uploaded files
router.get('/user', getUserFiles);

// Get club's files
router.get('/club', getClubFiles);

// Delete file
router.delete('/:id', deleteFile);

export default router;