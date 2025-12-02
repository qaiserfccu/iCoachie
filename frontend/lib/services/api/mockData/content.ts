// Mock data for content management
import type { Announcement, MediaItem } from '../types';

export const mockAnnouncements: Announcement[] = Array.from({ length: 20 }, (_, i) => ({
  id: `announcement-${i + 1}`,
  title: [
    'Welcome to the New Season!',
    'Schedule Changes for Next Week',
    'Important: Facility Maintenance Notice',
    'Upcoming Tournament Registration',
    'New Coach Introduction',
    'Holiday Schedule Update',
    'Safety Guidelines Reminder',
    'End of Season Celebration',
    'Equipment Pickup Information',
    'Parent Meeting Notice',
  ][i % 10],
  content: `This is the detailed content for announcement ${i + 1}. Please read carefully and follow any instructions provided.`,
  author: ['Admin', 'Coach Mike', 'Management', 'Front Desk'][i % 4],
  targetAudience: i % 3 === 0 ? 'all' : (['student', 'parent', 'coach'] as const)[i % 3] as any,
  priority: (['low', 'medium', 'high'] as const)[i % 3],
  status: (['draft', 'published', 'archived'] as const)[i % 3],
  publishDate: i % 3 === 1 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  expiryDate: i % 2 === 0 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockMediaItems: MediaItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `media-${i + 1}`,
  name: [
    'team_photo.jpg',
    'training_video.mp4',
    'schedule_2024.pdf',
    'podcast_episode.mp3',
    'logo.png',
    'banner.jpg',
    'promo_video.mp4',
    'handbook.pdf',
    'interview.mp3',
    'avatar.png',
  ][i % 10],
  type: (['image', 'video', 'document', 'audio'] as const)[i % 4],
  url: `/media/${i + 1}`,
  size: 1024 * (100 + Math.floor(Math.random() * 9900)),
  mimeType: ['image/jpeg', 'video/mp4', 'application/pdf', 'audio/mp3'][i % 4],
  uploadedBy: `user-${(i % 5) + 1}`,
  tags: i % 2 === 0 ? ['featured', 'public'] : ['internal'],
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const getAnnouncementById = (id: string): Announcement | undefined => {
  return mockAnnouncements.find(a => a.id === id);
};

export const getPublishedAnnouncements = (): Announcement[] => {
  return mockAnnouncements.filter(a => a.status === 'published');
};

export const getMediaByType = (type: MediaItem['type']): MediaItem[] => {
  return mockMediaItems.filter(m => m.type === type);
};
