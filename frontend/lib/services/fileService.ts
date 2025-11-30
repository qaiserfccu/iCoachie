import { apiClient } from '../api'

// Types
export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  entityType?: 'student' | 'session' | 'club' | 'evaluation' | 'user'
  entityId?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface UploadFileData {
  file: File
  entityType?: 'student' | 'session' | 'club' | 'evaluation' | 'user'
  entityId?: string
}

export interface FileStats {
  totalFiles: number
  totalSize: number
  filesByType: Record<string, number>
}

class FileService {
  private readonly baseUrl = '/files'

  // Upload file
  async uploadFile(data: UploadFileData): Promise<FileUpload> {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.entityType) formData.append('entityType', data.entityType)
    if (data.entityId) formData.append('entityId', data.entityId)

    return apiClient.post<FileUpload>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // Get all files for current tenant
  async getFiles(entityType?: string, entityId?: string): Promise<FileUpload[]> {
    const params: any = {}
    if (entityType) params.entityType = entityType
    if (entityId) params.entityId = entityId
    return apiClient.get<FileUpload[]>(this.baseUrl, { params })
  }

  // Get file by ID
  async getFile(id: string): Promise<FileUpload> {
    return apiClient.get<FileUpload>(`${this.baseUrl}/${id}`)
  }

  // Delete file
  async deleteFile(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get files for a specific entity
  async getEntityFiles(entityType: string, entityId: string): Promise<FileUpload[]> {
    return apiClient.get<FileUpload[]>(`${this.baseUrl}/entity/${entityType}/${entityId}`)
  }

  // Get student documents
  async getStudentFiles(studentId: string): Promise<FileUpload[]> {
    return this.getEntityFiles('student', studentId)
  }

  // Get session files
  async getSessionFiles(sessionId: string): Promise<FileUpload[]> {
    return this.getEntityFiles('session', sessionId)
  }

  // Get club files
  async getClubFiles(clubId: string): Promise<FileUpload[]> {
    return this.getEntityFiles('club', clubId)
  }

  // Get evaluation files
  async getEvaluationFiles(evaluationId: string): Promise<FileUpload[]> {
    return this.getEntityFiles('evaluation', evaluationId)
  }

  // Get user avatar/profile files
  async getUserFiles(userId: string): Promise<FileUpload[]> {
    return this.getEntityFiles('user', userId)
  }

  // Get file statistics
  async getFileStats(): Promise<FileStats> {
    return apiClient.get<FileStats>(`${this.baseUrl}/stats`)
  }

  // Download file
  async downloadFile(id: string): Promise<Blob> {
    return apiClient.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob'
    })
  }

  // Get file URL for direct access
  getFileUrl(id: string): string {
    return `${apiClient.defaults.baseURL}${this.baseUrl}/${id}/download`
  }

  // Get thumbnail URL
  getThumbnailUrl(id: string): string {
    return `${apiClient.defaults.baseURL}${this.baseUrl}/${id}/thumbnail`
  }

  // Bulk delete files
  async bulkDeleteFiles(fileIds: string[]): Promise<void> {
    return apiClient.post(`${this.baseUrl}/bulk-delete`, { fileIds })
  }

  // Move file to different entity
  async moveFile(id: string, entityType: string, entityId: string): Promise<FileUpload> {
    return apiClient.patch<FileUpload>(`${this.baseUrl}/${id}/move`, {
      entityType,
      entityId
    })
  }
}

export const fileService = new FileService()
export default fileService