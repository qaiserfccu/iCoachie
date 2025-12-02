// Mock data for security operations
import type { AccessLog, IncidentReport } from '../types';

export const mockAccessLogs: AccessLog[] = Array.from({ length: 100 }, (_, i) => {
  const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  return {
    id: `access-${i + 1}`,
    userId: i % 5 === 0 ? undefined : `user-${(i % 30) + 1}`,
    userName: i % 5 === 0 ? undefined : ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Emma Brown', 'David Jones'][i % 5],
    action: i % 2 === 0 ? 'entry' : 'exit',
    location: ['Main Entrance', 'Back Gate', 'Gym Door', 'Pool Access', 'Admin Building'][i % 5],
    method: (['card', 'biometric', 'manual'] as const)[i % 3],
    timestamp: timestamp.toISOString(),
    status: i % 20 === 0 ? 'denied' : 'success',
    notes: i % 20 === 0 ? 'Invalid credentials' : undefined,
  };
});

export const mockIncidentReports: IncidentReport[] = Array.from({ length: 15 }, (_, i) => ({
  id: `incident-${i + 1}`,
  reportNumber: `INC-${String(2024)}${String(i + 1).padStart(4, '0')}`,
  type: (['security', 'safety', 'theft', 'vandalism', 'other'] as const)[i % 5],
  title: [
    'Unauthorized Access Attempt',
    'Slip and Fall Incident',
    'Missing Equipment',
    'Graffiti on Wall',
    'Suspicious Activity',
    'Fire Alarm Activation',
    'Medical Emergency',
    'Vehicle Break-in',
    'Property Damage',
    'Trespassing',
  ][i % 10],
  description: 'Detailed description of the incident that occurred at the facility.',
  location: ['Main Field', 'Parking Lot', 'Gym', 'Pool Area', 'Admin Building'][i % 5],
  occurredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  reportedBy: `Security Officer ${['Smith', 'Johnson', 'Williams'][i % 3]}`,
  witnesses: i % 3 === 0 ? ['John Doe', 'Jane Smith'] : undefined,
  status: (['reported', 'investigating', 'resolved', 'closed'] as const)[i % 4],
  severity: (['low', 'medium', 'high', 'critical'] as const)[i % 4],
  actionTaken: i % 4 >= 2 ? 'Investigation completed. Appropriate measures taken.' : undefined,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const getRecentAccessLogs = (limit: number = 50): AccessLog[] => {
  return [...mockAccessLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const getDeniedAccessLogs = (): AccessLog[] => {
  return mockAccessLogs.filter(log => log.status === 'denied');
};

export const getIncidentById = (id: string): IncidentReport | undefined => {
  return mockIncidentReports.find(r => r.id === id);
};

export const getActiveIncidents = (): IncidentReport[] => {
  return mockIncidentReports.filter(r => r.status === 'reported' || r.status === 'investigating');
};
