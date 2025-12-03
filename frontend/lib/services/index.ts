// Export all service modules
export * from './mockDataService'
export { default as clubService } from './clubService'
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
export { 
  bookingsCoordinatorService, 
  frontDeskService, 
  accountantService 
} from './operationsService'

// Export types from services
export type { Student } from './studentService'
export type { SessionAttendance, AttendanceStudent, CoachAttendanceStats } from './coachAttendanceService'
export type { User, Role } from './userService'
export type { Status, UserStatus, SessionStatus, AttendanceStatus, PaymentStatus, BookingStatus } from './statusService'
export type { DashboardStats, DashboardSession, DashboardAttendance } from './dashboardService'
export type { PaymentTransaction, PaymentStats } from './clubPaymentsService'
export type { CalendarSession, UpcomingSession, SessionStats } from './clubSessionsService'
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