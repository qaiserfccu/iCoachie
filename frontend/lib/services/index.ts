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
export { default as equipmentService } from './equipmentService'
export { default as securityService } from './securityService'
export { default as cleaningService } from './cleaningService'
export { default as medicalService } from './medicalService'
export { default as contentManagerService } from './contentManagerService'
export { default as frontDeskService } from './frontDeskService'
export { default as accountantService } from './accountantService'
export { default as maintenanceService } from './maintenanceService'
export { default as groundskeeperService } from './groundskeeperService'
export { default as bookingsCoordinatorService } from './bookingsCoordinatorService'
export { 
  getOperationsStatusColor
} from './operationsService'
export { default as systemSupportService } from './systemSupportService'
export { default as parentService } from './parentService'

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

// Parent types
export type {
  ParentChild,
  ParentBooking,
  ParentPayment,
  ParentEvaluation,
  EvaluationStats,
  ParentMessage,
  ParentProfile,
  ParentDashboardStats
} from './parentService'

// Equipment Manager types
export type {
  EquipmentStats,
  EquipmentInventoryItem,
  EquipmentCheckout,
  EquipmentMaintenance,
  ProcurementRequest
} from './equipmentService'

// Security Staff types
export type {
  SecurityStats,
  SecurityIncident,
  AccessControlLog,
  PatrolLog
} from './securityService'

// Cleaning Staff types
export type {
  CleaningStats,
  CleaningSchedule,
  CleaningSupply,
  QualityInspection
} from './cleaningService'

// Medical Staff types
export type {
  MedicalStats,
  HealthRecord,
  InjuryReport,
  FirstAidIncident
} from './medicalService'

// Content Manager types
export type {
  ContentManagerStats,
  Announcement,
  MediaItem,
  ContentItem
} from './contentManagerService'

// Front Desk types (from new service)
export type {
  FrontDeskStats as FrontDeskServiceStats,
  CheckIn,
  Inquiry,
  FrontDeskSchedule
} from './frontDeskService'

// Accountant types (from new service)
export type {
  AccountantStats as AccountantServiceStats,
  Invoice,
  PaymentTransaction as AccountantPaymentTransaction,
  FinancialReport
} from './accountantService'

// Maintenance Tech types
export type {
  MaintenanceStats as MaintenanceServiceStats,
  WorkOrder,
  PreventiveMaintenance,
  MaintenanceInventory
} from './maintenanceService'

// Groundskeeper types (from new service)
export type {
  GroundskeeperStats as GroundskeeperServiceStats,
  DailyTask,
  TurfManagement,
  IrrigationSystem,
  PestControl
} from './groundskeeperService'

// Bookings Coordinator types (from new service)
export type {
  BookingsCoordinatorStats as BookingsCoordinatorServiceStats,
  BookingCalendarEvent,
  Reservation,
  VenueAvailability,
  VenuePricing
} from './bookingsCoordinatorService'
