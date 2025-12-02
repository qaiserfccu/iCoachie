// API Types for all entities

// Common types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface QueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean>;
}

// User and Role types
export type UserRole = 
  | 'admin' 
  | 'coach' 
  | 'head-coach' 
  | 'parent' 
  | 'guardian' 
  | 'student' 
  | 'accountant' 
  | 'front-desk' 
  | 'content-manager' 
  | 'medical' 
  | 'facility' 
  | 'system-support' 
  | 'bookings-coordinator' 
  | 'maintenance' 
  | 'equipment' 
  | 'security' 
  | 'cleaning' 
  | 'venue' 
  | 'ground' 
  | 'groundskeeper' 
  | 'academy-owner' 
  | 'club' 
  | 'freelancer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// Student/Athlete types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  guardianId?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  sport: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Coach/Staff types
export interface Coach {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  rating: number;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Schedule/Calendar types
export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'training' | 'match' | 'meeting' | 'event' | 'maintenance';
  location?: string;
  participants?: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Booking/Reservation types
export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Equipment types
export interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  purchaseDate?: string;
  cost?: number;
  status: 'available' | 'in-use' | 'maintenance' | 'disposed';
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCheckout {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  checkoutDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  quantity: number;
  status: 'checked-out' | 'returned' | 'overdue';
  notes?: string;
  createdAt: string;
}

// Facility/Venue types
export interface Facility {
  id: string;
  name: string;
  type: 'field' | 'court' | 'pool' | 'gym' | 'room' | 'stadium';
  capacity: number;
  location: string;
  amenities: string[];
  hourlyRate?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'closed';
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  facilityId: string;
  facilityName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  reportedBy: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Financial types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'check';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

// Medical types
export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastCheckup?: string;
  nextCheckup?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InjuryRecord {
  id: string;
  studentId: string;
  studentName: string;
  injuryType: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  location: string;
  occurredAt: string;
  reportedBy: string;
  treatment: string;
  status: 'active' | 'recovered' | 'ongoing-treatment';
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalClearance {
  id: string;
  studentId: string;
  studentName: string;
  type: 'participation' | 'return-to-play' | 'annual-physical';
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'pending';
  notes?: string;
  documentUrl?: string;
  createdAt: string;
}

// Support/Ticket types
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'account' | 'feature-request' | 'other';
  assignedTo?: string;
  responses?: TicketResponse[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
}

// Content types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetAudience: UserRole[] | 'all';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'published' | 'archived';
  publishDate?: string;
  expiryDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  tags?: string[];
  createdAt: string;
}

// Security types
export interface AccessLog {
  id: string;
  userId?: string;
  userName?: string;
  action: 'entry' | 'exit';
  location: string;
  method: 'card' | 'biometric' | 'manual';
  timestamp: string;
  status: 'success' | 'denied';
  notes?: string;
}

export interface IncidentReport {
  id: string;
  reportNumber: string;
  type: 'security' | 'safety' | 'theft' | 'vandalism' | 'other';
  title: string;
  description: string;
  location: string;
  occurredAt: string;
  reportedBy: string;
  witnesses?: string[];
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken?: string;
  createdAt: string;
  updatedAt: string;
}

// Cleaning types
export interface CleaningSchedule {
  id: string;
  facilityId: string;
  facilityName: string;
  assignedTo: string;
  assigneeName: string;
  scheduledDate: string;
  scheduledTime: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  tasks: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'missed';
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyInventory {
  id: string;
  name: string;
  category: 'cleaning' | 'sanitization' | 'equipment' | 'consumables';
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  lastRestocked?: string;
  supplier?: string;
  cost?: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  createdAt: string;
  updatedAt: string;
}

// Grounds types
export interface GroundCondition {
  id: string;
  facilityId: string;
  facilityName: string;
  inspectedBy: string;
  inspectionDate: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  grassHeight?: number;
  moistureLevel?: number;
  issues?: string[];
  recommendations?: string[];
  nextInspection?: string;
  photos?: string[];
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  facilityId?: string;
  facilityName?: string;
  assignedTo?: string;
  assigneeName?: string;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  parts?: WorkOrderPart[];
  status: 'open' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  startDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderPart {
  name: string;
  quantity: number;
  unitCost: number;
}

// Evaluation types
export interface Evaluation {
  id: string;
  studentId: string;
  studentName: string;
  evaluatorId: string;
  evaluatorName: string;
  type: 'skill' | 'performance' | 'progress' | 'behavior';
  scores: EvaluationScore[];
  overallScore: number;
  comments?: string;
  recommendations?: string;
  evaluationDate: string;
  createdAt: string;
}

export interface EvaluationScore {
  category: string;
  score: number;
  maxScore: number;
  notes?: string;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionName: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

// Achievement types
export interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  type: 'badge' | 'certificate' | 'trophy' | 'milestone';
  category: string;
  awardedBy: string;
  awardedDate: string;
  imageUrl?: string;
  createdAt: string;
}
