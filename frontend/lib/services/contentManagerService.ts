/**
 * Content Manager Service
 * Handles API calls for content management functionality
 */

import { apiClient } from '../api';

// Types
export interface ContentManagerStats {
  totalPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  totalViews: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  status: string;
  views: number;
}

export interface MediaItem {
  id: number;
  filename: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
}

export interface ContentItem {
  id: number;
  title: string;
  type: string;
  lastModified: string;
  modifiedBy: string;
  status: string;
}

// Service class
class ContentManagerService {
  private readonly BASE_PATH = '/content-manager';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: ContentManagerStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get announcements
   */
  async getAnnouncements(): Promise<{ data: Announcement[] }> {
    return apiClient.get(`${this.BASE_PATH}/announcements`);
  }

  /**
   * Get media library
   */
  async getMedia(): Promise<{ data: MediaItem[] }> {
    return apiClient.get(`${this.BASE_PATH}/media`);
  }

  /**
   * Get content items
   */
  async getContent(): Promise<{ data: ContentItem[] }> {
    return apiClient.get(`${this.BASE_PATH}/content`);
  }
}

// Export singleton instance
export const contentManagerService = new ContentManagerService();
export default contentManagerService;
