// Mock data for bookings and reservations
import type { Booking } from '../types';

const purposes = ['Training Session', 'Team Practice', 'Private Lesson', 'Tournament', 'Event', 'Maintenance', 'Meeting'];

export const mockBookings: Booking[] = Array.from({ length: 40 }, (_, i) => {
  const now = new Date();
  const dayOffset = Math.floor(Math.random() * 14) - 7;
  const startHour = 8 + Math.floor(Math.random() * 10);
  const startTime = new Date(now);
  startTime.setDate(startTime.getDate() + dayOffset);
  startTime.setHours(startHour, 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setHours(startHour + 1 + Math.floor(Math.random() * 2));

  return {
    id: `booking-${i + 1}`,
    facilityId: `facility-${(i % 5) + 1}`,
    facilityName: ['Main Field', 'Indoor Court A', 'Swimming Pool', 'Tennis Court 1', 'Conference Room'][i % 5],
    userId: `user-${(i % 20) + 1}`,
    userName: ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Emma Brown', 'David Jones'][i % 5],
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    purpose: purposes[i % purposes.length],
    status: dayOffset < -2 ? 'completed' : dayOffset < 0 ? (i % 3 === 0 ? 'cancelled' : 'completed') : (i % 4 === 0 ? 'pending' : 'confirmed'),
    price: 50 + Math.floor(Math.random() * 100),
    notes: i % 3 === 0 ? 'Special setup required' : undefined,
    createdAt: new Date(Date.now() - (14 + dayOffset) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const getBookingById = (id: string): Booking | undefined => {
  return mockBookings.find(booking => booking.id === id);
};

export const getBookingsByFacility = (facilityId: string): Booking[] => {
  return mockBookings.filter(booking => booking.facilityId === facilityId);
};

export const getBookingsByUser = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getUpcomingBookings = (): Booking[] => {
  const now = new Date();
  return mockBookings
    .filter(booking => new Date(booking.startTime) > now && booking.status !== 'cancelled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
};
