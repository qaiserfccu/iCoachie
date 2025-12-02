// Mock data for schedules and calendar events
import type { ScheduleEvent } from '../types';

const eventTypes: ScheduleEvent['type'][] = ['training', 'match', 'meeting', 'event', 'maintenance'];
const locations = ['Main Field', 'Indoor Court A', 'Swimming Pool', 'Tennis Courts', 'Gym', 'Conference Room', 'Stadium'];

const generateEvents = (count: number): ScheduleEvent[] => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const dayOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
    const startHour = 8 + Math.floor(Math.random() * 10);
    const duration = 1 + Math.floor(Math.random() * 2);
    const startTime = new Date(now);
    startTime.setDate(startTime.getDate() + dayOffset);
    startTime.setHours(startHour, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startHour + duration);

    return {
      id: `event-${i + 1}`,
      title: [
        'Morning Training Session',
        'U-12 Soccer Practice',
        'Swimming Competition',
        'Team Meeting',
        'Parent Orientation',
        'Equipment Maintenance',
        'Friendly Match',
        'Skill Assessment',
        'Coach Meeting',
        'End of Season Event',
      ][i % 10],
      description: 'Regular scheduled event',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type: eventTypes[i % eventTypes.length],
      location: locations[i % locations.length],
      participants: [`user-${(i % 10) + 1}`, `student-${(i % 20) + 1}`],
      status: dayOffset < 0 ? 'completed' : 'scheduled',
      createdBy: `user-${(i % 5) + 1}`,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

export const mockScheduleEvents = generateEvents(50);

export const getEventById = (id: string): ScheduleEvent | undefined => {
  return mockScheduleEvents.find(event => event.id === id);
};

export const getEventsByType = (type: ScheduleEvent['type']): ScheduleEvent[] => {
  return mockScheduleEvents.filter(event => event.type === type);
};

export const getUpcomingEvents = (): ScheduleEvent[] => {
  const now = new Date();
  return mockScheduleEvents
    .filter(event => new Date(event.startTime) > now && event.status === 'scheduled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
};
