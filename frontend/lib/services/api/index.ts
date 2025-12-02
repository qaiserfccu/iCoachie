// Mock API Service - Comprehensive API layer with mock data support
import type { PaginatedResponse, QueryParams, ApiResponse } from './types';
import * as mockData from './mockData';

// Configuration
interface ApiConfig {
  useMock: boolean;
  mockDelay: number;
  baseUrl: string;
  simulateErrors: boolean;
  errorRate: number;
}

const defaultConfig: ApiConfig = {
  useMock: true, // Toggle this to switch between mock and real API
  mockDelay: 300, // Simulated network delay in ms
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  simulateErrors: false,
  errorRate: 0.05, // 5% error rate when simulateErrors is true
};

let config = { ...defaultConfig };

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldError = () => config.simulateErrors && Math.random() < config.errorRate;

const paginate = <T>(items: T[], params: QueryParams): PaginatedResponse<T> => {
  const page = params.page || 1;
  const perPage = params.perPage || 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  let filteredItems = [...items];

  // Apply search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      JSON.stringify(item).toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting if provided
  if (params.sortBy) {
    filteredItems.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[params.sortBy!];
      const bVal = (b as Record<string, unknown>)[params.sortBy!];
      const comparison = String(aVal).localeCompare(String(bVal));
      return params.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return {
    data: filteredItems.slice(start, end),
    total: filteredItems.length,
    page,
    perPage,
    totalPages: Math.ceil(filteredItems.length / perPage),
  };
};

const wrapResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

const errorResponse = (message: string): ApiResponse<null> => ({
  success: false,
  data: null,
  error: message,
});

// API Service Factory
export const createApiService = (customConfig?: Partial<ApiConfig>) => {
  if (customConfig) {
    config = { ...config, ...customConfig };
  }

  return {
    // Users
    users: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        if (shouldError()) throw new Error('Failed to fetch users');
        return paginate(mockData.mockUsers, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const user = mockData.getUserById(id);
        if (!user) throw new Error('User not found');
        return wrapResponse(user);
      },
      getByRole: async (role: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const users = mockData.getUsersByRole(role as any);
        return paginate(users, params);
      },
    },

    // Students
    students: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockStudents, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const student = mockData.getStudentById(id);
        if (!student) throw new Error('Student not found');
        return wrapResponse(student);
      },
      getByLevel: async (level: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const students = mockData.getStudentsByLevel(level as any);
        return paginate(students, params);
      },
      getBySport: async (sport: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const students = mockData.getStudentsBySport(sport);
        return paginate(students, params);
      },
    },

    // Coaches
    coaches: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockCoaches, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const coach = mockData.getCoachById(id);
        if (!coach) throw new Error('Coach not found');
        return wrapResponse(coach);
      },
      getBySpecialty: async (specialty: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const coaches = mockData.getCoachesBySpecialty(specialty);
        return paginate(coaches, params);
      },
    },

    // Schedules
    schedules: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockScheduleEvents, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const event = mockData.getEventById(id);
        if (!event) throw new Error('Event not found');
        return wrapResponse(event);
      },
      getByType: async (type: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const events = mockData.getEventsByType(type as any);
        return paginate(events, params);
      },
      getUpcoming: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const events = mockData.getUpcomingEvents();
        return paginate(events, params);
      },
    },

    // Bookings
    bookings: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockBookings, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const booking = mockData.getBookingById(id);
        if (!booking) throw new Error('Booking not found');
        return wrapResponse(booking);
      },
      getByFacility: async (facilityId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const bookings = mockData.getBookingsByFacility(facilityId);
        return paginate(bookings, params);
      },
      getByUser: async (userId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const bookings = mockData.getBookingsByUser(userId);
        return paginate(bookings, params);
      },
      getUpcoming: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const bookings = mockData.getUpcomingBookings();
        return paginate(bookings, params);
      },
    },

    // Equipment
    equipment: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockEquipment, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const equipment = mockData.getEquipmentById(id);
        if (!equipment) throw new Error('Equipment not found');
        return wrapResponse(equipment);
      },
      getByCategory: async (category: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const equipment = mockData.getEquipmentByCategory(category);
        return paginate(equipment, params);
      },
      getCheckouts: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockEquipmentCheckouts, params);
      },
      getActiveCheckouts: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const checkouts = mockData.getActiveCheckouts();
        return paginate(checkouts, params);
      },
    },

    // Facilities
    facilities: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockFacilities, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const facility = mockData.getFacilityById(id);
        if (!facility) throw new Error('Facility not found');
        return wrapResponse(facility);
      },
      getByType: async (type: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const facilities = mockData.getFacilitiesByType(type as any);
        return paginate(facilities, params);
      },
      getMaintenance: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockMaintenanceRequests, params);
      },
      getPendingMaintenance: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const requests = mockData.getPendingMaintenance();
        return paginate(requests, params);
      },
    },

    // Financial
    financial: {
      getInvoices: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockInvoices, params);
      },
      getInvoiceById: async (id: string) => {
        await delay(config.mockDelay);
        const invoice = mockData.getInvoiceById(id);
        if (!invoice) throw new Error('Invoice not found');
        return wrapResponse(invoice);
      },
      getInvoicesByStatus: async (status: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const invoices = mockData.getInvoicesByStatus(status as any);
        return paginate(invoices, params);
      },
      getPayments: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockPayments, params);
      },
      getPaymentsByUser: async (userId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const payments = mockData.getPaymentsByUser(userId);
        return paginate(payments, params);
      },
      getRecentPayments: async (limit: number = 10) => {
        await delay(config.mockDelay);
        const payments = mockData.getRecentPayments(limit);
        return wrapResponse(payments);
      },
    },

    // Medical
    medical: {
      getHealthRecords: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockHealthRecords, params);
      },
      getHealthRecordByStudent: async (studentId: string) => {
        await delay(config.mockDelay);
        const record = mockData.getHealthRecordByStudent(studentId);
        if (!record) throw new Error('Health record not found');
        return wrapResponse(record);
      },
      getInjuries: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockInjuryRecords, params);
      },
      getInjuriesByStudent: async (studentId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const injuries = mockData.getInjuriesByStudent(studentId);
        return paginate(injuries, params);
      },
      getActiveInjuries: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const injuries = mockData.getActiveInjuries();
        return paginate(injuries, params);
      },
      getClearances: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockMedicalClearances, params);
      },
      getClearancesByStudent: async (studentId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const clearances = mockData.getClearancesByStudent(studentId);
        return paginate(clearances, params);
      },
      getExpiringClearances: async (days: number = 30, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const clearances = mockData.getExpiringClearances(days);
        return paginate(clearances, params);
      },
    },

    // Support Tickets
    tickets: {
      getAll: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockSupportTickets, params);
      },
      getById: async (id: string) => {
        await delay(config.mockDelay);
        const ticket = mockData.getTicketById(id);
        if (!ticket) throw new Error('Ticket not found');
        return wrapResponse(ticket);
      },
      getByStatus: async (status: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const tickets = mockData.getTicketsByStatus(status as any);
        return paginate(tickets, params);
      },
      getByUser: async (userId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const tickets = mockData.getTicketsByUser(userId);
        return paginate(tickets, params);
      },
      getOpen: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const tickets = mockData.getOpenTickets();
        return paginate(tickets, params);
      },
      getUrgent: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const tickets = mockData.getUrgentTickets();
        return paginate(tickets, params);
      },
    },

    // Content
    content: {
      getAnnouncements: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockAnnouncements, params);
      },
      getAnnouncementById: async (id: string) => {
        await delay(config.mockDelay);
        const announcement = mockData.getAnnouncementById(id);
        if (!announcement) throw new Error('Announcement not found');
        return wrapResponse(announcement);
      },
      getPublishedAnnouncements: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const announcements = mockData.getPublishedAnnouncements();
        return paginate(announcements, params);
      },
      getMedia: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockMediaItems, params);
      },
      getMediaByType: async (type: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const media = mockData.getMediaByType(type as any);
        return paginate(media, params);
      },
    },

    // Security
    security: {
      getAccessLogs: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockAccessLogs, params);
      },
      getRecentAccessLogs: async (limit: number = 50) => {
        await delay(config.mockDelay);
        const logs = mockData.getRecentAccessLogs(limit);
        return wrapResponse(logs);
      },
      getDeniedAccessLogs: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const logs = mockData.getDeniedAccessLogs();
        return paginate(logs, params);
      },
      getIncidents: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockIncidentReports, params);
      },
      getIncidentById: async (id: string) => {
        await delay(config.mockDelay);
        const incident = mockData.getIncidentById(id);
        if (!incident) throw new Error('Incident not found');
        return wrapResponse(incident);
      },
      getActiveIncidents: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const incidents = mockData.getActiveIncidents();
        return paginate(incidents, params);
      },
    },

    // Cleaning
    cleaning: {
      getSchedules: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockCleaningSchedules, params);
      },
      getSchedulesByFacility: async (facilityId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const schedules = mockData.getSchedulesByFacility(facilityId);
        return paginate(schedules, params);
      },
      getTodaySchedules: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const schedules = mockData.getTodaySchedules();
        return paginate(schedules, params);
      },
      getPendingSchedules: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const schedules = mockData.getPendingSchedules();
        return paginate(schedules, params);
      },
      getSupplies: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockSupplyInventory, params);
      },
      getLowStockSupplies: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const supplies = mockData.getLowStockSupplies();
        return paginate(supplies, params);
      },
    },

    // Grounds
    grounds: {
      getConditions: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockGroundConditions, params);
      },
      getConditionById: async (id: string) => {
        await delay(config.mockDelay);
        const condition = mockData.getConditionById(id);
        if (!condition) throw new Error('Condition not found');
        return wrapResponse(condition);
      },
      getConditionsByFacility: async (facilityId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const conditions = mockData.getConditionsByFacility(facilityId);
        return paginate(conditions, params);
      },
      getLatestCondition: async (facilityId: string) => {
        await delay(config.mockDelay);
        const condition = mockData.getLatestCondition(facilityId);
        if (!condition) throw new Error('No conditions found');
        return wrapResponse(condition);
      },
      getWorkOrders: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockWorkOrders, params);
      },
      getWorkOrderById: async (id: string) => {
        await delay(config.mockDelay);
        const order = mockData.getWorkOrderById(id);
        if (!order) throw new Error('Work order not found');
        return wrapResponse(order);
      },
      getOpenWorkOrders: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const orders = mockData.getOpenWorkOrders();
        return paginate(orders, params);
      },
      getWorkOrdersByPriority: async (priority: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const orders = mockData.getWorkOrdersByPriority(priority as any);
        return paginate(orders, params);
      },
    },

    // Progress (Evaluations, Attendance, Achievements)
    progress: {
      getEvaluations: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockEvaluations, params);
      },
      getEvaluationsByStudent: async (studentId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const evaluations = mockData.getEvaluationsByStudent(studentId);
        return paginate(evaluations, params);
      },
      getAttendance: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockAttendanceRecords, params);
      },
      getAttendanceByStudent: async (studentId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const records = mockData.getAttendanceByStudent(studentId);
        return paginate(records, params);
      },
      getAttendanceBySession: async (sessionId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const records = mockData.getAttendanceBySession(sessionId);
        return paginate(records, params);
      },
      getAchievements: async (params: QueryParams = {}) => {
        await delay(config.mockDelay);
        return paginate(mockData.mockAchievements, params);
      },
      getAchievementsByStudent: async (studentId: string, params: QueryParams = {}) => {
        await delay(config.mockDelay);
        const achievements = mockData.getAchievementsByStudent(studentId);
        return paginate(achievements, params);
      },
      getRecentAchievements: async (limit: number = 10) => {
        await delay(config.mockDelay);
        const achievements = mockData.getRecentAchievements(limit);
        return wrapResponse(achievements);
      },
    },

    // Config methods
    config: {
      setUseMock: (useMock: boolean) => {
        config.useMock = useMock;
      },
      setMockDelay: (delay: number) => {
        config.mockDelay = delay;
      },
      setSimulateErrors: (simulate: boolean, rate?: number) => {
        config.simulateErrors = simulate;
        if (rate !== undefined) config.errorRate = rate;
      },
      getConfig: () => ({ ...config }),
    },
  };
};

// Default API instance
export const api = createApiService();

export default api;
