// Mock data for support tickets
import type { SupportTicket } from '../types';

const subjects = [
  'Cannot login to my account',
  'Payment processing failed',
  'Session booking not showing',
  'Password reset not working',
  'Mobile app crashes',
  'Calendar sync issues',
  'Invoice discrepancy',
  'Unable to download reports',
  'Feature request: Dark mode',
  'Profile photo not uploading',
];

const descriptions = [
  'I have been trying to access my account but keep getting an error message.',
  'The payment was declined even though my card is valid.',
  'I booked a session yesterday but it is not appearing in my calendar.',
  'I requested a password reset but never received the email.',
  'The mobile app keeps crashing when I try to view my schedule.',
  'My calendar is not syncing with Google Calendar properly.',
  'The invoice amount does not match what I expected to pay.',
  'When I click download on reports, nothing happens.',
  'It would be great to have a dark mode option for the dashboard.',
  'I am trying to upload a profile photo but it keeps failing.',
];

export const mockSupportTickets: SupportTicket[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ticket-${i + 1}`,
  ticketNumber: `TKT-${String(1000 + i).padStart(4, '0')}`,
  userId: `user-${(i % 20) + 1}`,
  userName: ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Emma Brown', 'David Jones', 'Lisa Garcia'][i % 6],
  subject: subjects[i % subjects.length],
  description: descriptions[i % descriptions.length],
  priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
  status: (['open', 'in-progress', 'resolved', 'closed'] as const)[i % 4],
  category: (['technical', 'billing', 'account', 'feature-request', 'other'] as const)[i % 5],
  assignedTo: i % 2 === 0 ? `user-${(i % 3) + 1}` : undefined,
  responses: i % 3 === 0 ? [
    {
      id: `response-${i}-1`,
      ticketId: `ticket-${i + 1}`,
      userId: `user-1`,
      userName: 'Support Agent',
      message: 'Thank you for reaching out. We are looking into this issue.',
      isStaff: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ] : undefined,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  resolvedAt: i % 4 === 2 ? new Date().toISOString() : undefined,
}));

export const getTicketById = (id: string): SupportTicket | undefined => {
  return mockSupportTickets.find(t => t.id === id);
};

export const getTicketsByStatus = (status: SupportTicket['status']): SupportTicket[] => {
  return mockSupportTickets.filter(t => t.status === status);
};

export const getTicketsByUser = (userId: string): SupportTicket[] => {
  return mockSupportTickets.filter(t => t.userId === userId);
};

export const getOpenTickets = (): SupportTicket[] => {
  return mockSupportTickets.filter(t => t.status === 'open' || t.status === 'in-progress');
};

export const getUrgentTickets = (): SupportTicket[] => {
  return mockSupportTickets.filter(t => t.priority === 'urgent' && t.status !== 'closed');
};
