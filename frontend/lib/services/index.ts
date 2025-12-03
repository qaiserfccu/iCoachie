// Export all service modules
export * from './mockDataService'
export { default as clubService } from './clubService'
export { default as clubAdminService } from './clubAdminService'
export { default as studentService } from './studentService'
export { default as sessionService } from './sessionService'
export { default as attendanceService } from './attendanceService'
export { default as evaluationService } from './evaluationService'
export { default as paymentService } from './paymentService'
export { default as messagingService } from './messagingService'
export { default as bookingService } from './bookingService'
export { default as reviewService } from './reviewService'
export { default as fileService } from './fileService'
export { default as dashboardService } from './dashboardService'
export { default as userService } from './userService'
export { default as clubDashboardService } from './clubDashboardService'
export { default as coachService } from './coachService'
export { default as clubMembersService } from './clubMembersService'
export { default as clubPaymentsService } from './clubPaymentsService'
export { default as clubSessionsService } from './clubSessionsService'
export { default as statusService } from './statusService'
export { default as coachAttendanceService } from './coachAttendanceService'
export { default as coachEvaluationsService } from './coachEvaluationsService'
export { default as coachProgressService } from './coachProgressService'
export { default as coachScheduleService } from './coachScheduleService'
export { default as freelancerDashboardService } from './freelancerDashboardService'
export { default as freelancerBookingsService } from './freelancerBookingsService'
export { freelancerClientsService } from './freelancerClientsService'
export { freelancerEarningsService } from './freelancerEarningsService'
export { freelancerProfileService } from './freelancerProfileService'
export { default as facilityService } from './facilityService'
export { DASHBOARD_STATS_CONFIG } from './facilityService'
export { 
  bookingsCoordinatorService, 
  frontDeskService, 
  accountantService,
  getOperationsStatusColor
} from './operationsService'
export { default as systemSupportService } from './systemSupportService'

// Export types from services
export type { Student } from './studentService'
export type { SessionAttendance, AttendanceStudent, CoachAttendanceStats } from './coachAttendanceService'
export type { User, Role } from './userService'
export type { Status, UserStatus, SessionStatus, AttendanceStatus, PaymentStatus, BookingStatus } from './statusService'
export type { DashboardStats, DashboardSession, DashboardAttendance } from './dashboardService'
export type { PaymentTransaction, PaymentStats } from './clubPaymentsService'
export type { CalendarSession, UpcomingSession, SessionStats } from './clubSessionsService'
export type { 
  Facility, 
  Venue, 
  Ground, 
  Schedule, 
  StaffMember,
  FacilityDashboardStats,
  VenueDashboardStats,
  GroundDashboardStats,
  MaintenanceDashboardStats,
  GroundskeeperDashboardStats,
  PaginatedResponse,
  PageInfo
} from './facilityService'
export type {
  OperationsBooking,
  BookingsCoordinatorStats,
  BookingTask,
  FrontDeskStats,
  FrontDeskSession,
  FrontDeskCheckin,
  AccountantStats,
  AccountantTransaction,
  AccountantInvoice,
  FinancialStats,
  MonthlyCollectionProgress
} from './operationsService'

// Club Admin types
export type {
  ClubInfo,
  ClubDashboardStats,
  ClubSession,
  ClubMember,
  ClubMemberStats,
  ClubCoach,
  ClubPaymentStats,
  ClubTransaction,
  ClubAnalytics,
  TopPerformer
} from './clubAdminService'
export type {
  DashboardStat as SystemSupportStat,
  Ticket,
  TicketDetail,
  SystemStatus,
  DiagnosticsResponse,
  LogEntry,
  PerformanceMetrics,
  SupportUser,
  SupportUserDetail,
  AccessRole,
  Report,
  AuditLog,
  KnowledgeBaseArticle
} from './systemSupportService'
