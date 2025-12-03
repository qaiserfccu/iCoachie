/**
 * Centralized Mock Data Service
 * This file contains all mock data used across the iCoachie frontend application.
 * All pages should import their data from this service instead of using inline constants.
 */

import {
  Users,
  Building2,
  UserCog,
  CreditCard,
  Calendar,
  GraduationCap,
  UserCheck,
  DollarSign,
  Star,
  Baby,
  Clock,
  Shield,
  Heart,
  Wrench,
  Droplets,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Thermometer,
  CheckCircle,
  type LucideIcon,
} from "lucide-react"

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface StatItem {
  title: string
  value: string
  change?: string
  subtitle?: string
  trend?: "up" | "down"
  icon: LucideIcon
  color: string
}

export interface ActivityItem {
  user: string
  action: string
  time: string
  avatar: string
  type: string
}

export interface PendingAction {
  type: string
  count: number
  icon: LucideIcon
  color: string
}

// ============================================================================
// ADMIN DASHBOARD DATA
// ============================================================================

export const adminStats: StatItem[] = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Active Clubs",
    value: "284",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Verified Coaches",
    value: "1,456",
    change: "+15.3%",
    trend: "up",
    icon: UserCog,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Monthly Revenue",
    value: "$128,450",
    change: "-2.4%",
    trend: "down",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
  },
]

export const adminPendingActions: PendingAction[] = [
  { type: "Club Approval", count: 5, icon: Building2, color: "text-blue-500" },
  { type: "Coach Verification", count: 12, icon: UserCog, color: "text-teal-500" },
  { type: "Refund Requests", count: 3, icon: CreditCard, color: "text-yellow-500" },
  { type: "Support Tickets", count: 8, icon: AlertTriangle, color: "text-red-500" },
]

export const adminRecentActivities: ActivityItem[] = [
  {
    user: "Champions FC",
    action: "submitted club registration",
    time: "2 min ago",
    avatar: "CF",
    type: "club",
  },
  {
    user: "John Smith",
    action: "completed coach verification",
    time: "15 min ago",
    avatar: "JS",
    type: "coach",
  },
  {
    user: "Sarah Wilson",
    action: "requested refund for session",
    time: "1 hour ago",
    avatar: "SW",
    type: "payment",
  },
  {
    user: "Elite Sports Academy",
    action: "upgraded to premium plan",
    time: "2 hours ago",
    avatar: "ES",
    type: "subscription",
  },
  {
    user: "Mike Johnson",
    action: "registered as freelancer",
    time: "3 hours ago",
    avatar: "MJ",
    type: "user",
  },
]

export interface TopClub {
  name: string
  members: number
  revenue: string
  growth: string
}

export const adminTopClubs: TopClub[] = [
  { name: "Champions FC", members: 450, revenue: "$12,400", growth: "+18%" },
  { name: "Elite Sports Academy", members: 380, revenue: "$10,800", growth: "+12%" },
  { name: "Victory Athletics", members: 320, revenue: "$9,200", growth: "+8%" },
  { name: "Premier Training", members: 290, revenue: "$8,500", growth: "+15%" },
]

// ============================================================================
// ADMIN USERS DATA
// ============================================================================

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  joined: string
  avatar: string
}

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    role: "Coach",
    status: "Active",
    joined: "Jan 15, 2024",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Champions FC",
    email: "admin@championsfc.com",
    role: "Club Admin",
    status: "Active",
    joined: "Dec 20, 2023",
    avatar: "CF",
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah.w@email.com",
    role: "Parent",
    status: "Active",
    joined: "Feb 1, 2024",
    avatar: "SW",
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike.j@email.com",
    role: "Freelancer",
    status: "Pending",
    joined: "Feb 10, 2024",
    avatar: "MJ",
  },
  {
    id: 5,
    name: "Elite Academy",
    email: "contact@eliteacademy.com",
    role: "Club Admin",
    status: "Suspended",
    joined: "Nov 5, 2023",
    avatar: "EA",
  },
  {
    id: 6,
    name: "Emma Davis",
    email: "emma.d@email.com",
    role: "Kid",
    status: "Active",
    joined: "Jan 28, 2024",
    avatar: "ED",
  },
]

export interface RoleStat {
  role: string
  count: number
  icon: LucideIcon
  color: string
}

export const adminRoleStats: RoleStat[] = [
  { role: "Club Admins", count: 284, icon: Building2, color: "from-blue-500 to-blue-600" },
  { role: "Coaches", count: 1456, icon: UserCog, color: "from-teal-500 to-teal-600" },
  { role: "Freelancers", count: 328, icon: Users, color: "from-yellow-500 to-orange-500" },
  { role: "Parents & Kids", count: 10779, icon: Baby, color: "from-green-500 to-green-600" },
]

// ============================================================================
// ADMIN CLUBS DATA
// ============================================================================

export interface Club {
  id: number
  name: string
  logo: string
  location: string
  members: number
  coaches: number
  rating: number
  status: string
  revenue: string
  plan: string
}

export const adminClubs: Club[] = [
  {
    id: 1,
    name: "Champions FC",
    logo: "CF",
    location: "New York, NY",
    members: 450,
    coaches: 12,
    rating: 4.8,
    status: "Verified",
    revenue: "$12,400",
    plan: "Premium",
  },
  {
    id: 2,
    name: "Elite Sports Academy",
    logo: "ES",
    location: "Los Angeles, CA",
    members: 380,
    coaches: 10,
    rating: 4.7,
    status: "Verified",
    revenue: "$10,800",
    plan: "Premium",
  },
  {
    id: 3,
    name: "Victory Athletics",
    logo: "VA",
    location: "Chicago, IL",
    members: 320,
    coaches: 8,
    rating: 4.5,
    status: "Verified",
    revenue: "$9,200",
    plan: "Standard",
  },
  {
    id: 4,
    name: "Rising Stars Club",
    logo: "RS",
    location: "Houston, TX",
    members: 0,
    coaches: 0,
    rating: 0,
    status: "Pending",
    revenue: "$0",
    plan: "Free Trial",
  },
  {
    id: 5,
    name: "Premier Training Center",
    logo: "PT",
    location: "Miami, FL",
    members: 290,
    coaches: 7,
    rating: 4.6,
    status: "Verified",
    revenue: "$8,500",
    plan: "Standard",
  },
]

// ============================================================================
// ADMIN ROLES DATA
// ============================================================================

export interface Role {
  id: number
  name: string
  description: string
  users: number
  color: string
  icon: LucideIcon
}

export const adminRoles: Role[] = [
  { id: 1, name: "System Admin", description: "Full platform access", users: 3, color: "bg-red-500", icon: Shield },
  { id: 2, name: "Club Admin", description: "Manage club operations", users: 284, color: "bg-blue-500", icon: Building2 },
  { id: 3, name: "Coach", description: "Train and evaluate students", users: 1456, color: "bg-teal-500", icon: UserCog },
  { id: 4, name: "Freelancer", description: "Independent coaching", users: 328, color: "bg-yellow-500", icon: Briefcase },
  { id: 5, name: "Parent", description: "Manage children activities", users: 5234, color: "bg-green-500", icon: Users },
  { id: 6, name: "Student", description: "Access training sessions", users: 5545, color: "bg-purple-500", icon: Baby },
]

export interface RoleWithPermissions {
  id: number
  name: string
  icon: LucideIcon
  color: string
  description: string
  users: number
  permissions: string[]
}

export const adminRolesWithPermissions: RoleWithPermissions[] = [
  {
    id: 1,
    name: "Super Admin",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    description: "Full system access with all permissions",
    users: 3,
    permissions: ["All Access"],
  },
  {
    id: 2,
    name: "Club Admin",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    description: "Manage club operations, coaches, and members",
    users: 284,
    permissions: ["Club Management", "Coach Management", "Member Management", "Payments", "Reports"],
  },
  {
    id: 3,
    name: "Coach",
    icon: UserCog,
    color: "from-teal-500 to-teal-600",
    description: "Manage sessions, attendance, and student progress",
    users: 1456,
    permissions: ["Schedule Management", "Attendance", "Progress Tracking", "Evaluations", "Messaging"],
  },
  {
    id: 4,
    name: "Freelancer",
    icon: Briefcase,
    color: "from-yellow-500 to-orange-500",
    description: "Independent coach with booking and payment features",
    users: 328,
    permissions: ["Profile Management", "Booking Management", "Payments", "Client Communication"],
  },
  {
    id: 5,
    name: "Parent",
    icon: Users,
    color: "from-green-500 to-green-600",
    description: "Manage kids, bookings, and view progress",
    users: 8542,
    permissions: ["Kid Management", "Booking", "Progress View", "Payments", "Messaging"],
  },
  {
    id: 6,
    name: "Kid",
    icon: Baby,
    color: "from-purple-500 to-purple-600",
    description: "Limited access to view schedules and progress",
    users: 2237,
    permissions: ["View Schedule", "View Progress", "View Badges"],
  },
]

export interface PermissionMatrixItem {
  permission: string
  admin: boolean
  clubAdmin: boolean
  coach: boolean
  freelancer: boolean
  parent: boolean
  kid: boolean
}

export const adminPermissionsMatrix: PermissionMatrixItem[] = [
  { permission: "User Management", admin: true, clubAdmin: false, coach: false, freelancer: false, parent: false, kid: false },
  { permission: "Club Management", admin: true, clubAdmin: true, coach: false, freelancer: false, parent: false, kid: false },
  { permission: "Coach Management", admin: true, clubAdmin: true, coach: false, freelancer: false, parent: false, kid: false },
  { permission: "Session Management", admin: true, clubAdmin: true, coach: true, freelancer: true, parent: false, kid: false },
  { permission: "Attendance Tracking", admin: true, clubAdmin: true, coach: true, freelancer: true, parent: false, kid: false },
  { permission: "Progress & Evaluation", admin: true, clubAdmin: true, coach: true, freelancer: true, parent: true, kid: true },
  { permission: "Payment Processing", admin: true, clubAdmin: true, coach: false, freelancer: true, parent: true, kid: false },
  { permission: "Reports & Analytics", admin: true, clubAdmin: true, coach: true, freelancer: true, parent: false, kid: false },
  { permission: "Messaging", admin: true, clubAdmin: true, coach: true, freelancer: true, parent: true, kid: false },
]

export const adminPermissionMatrix: PermissionMatrix[] = [
  { permission: "Manage Users", systemAdmin: true, clubAdmin: true, coach: false, freelancer: false, parent: false, student: false },
  { permission: "View Dashboard", systemAdmin: true, clubAdmin: true, coach: true, freelancer: true, parent: true, student: true },
  { permission: "Manage Sessions", systemAdmin: true, clubAdmin: true, coach: true, freelancer: true, parent: false, student: false },
  { permission: "Process Payments", systemAdmin: true, clubAdmin: true, coach: false, freelancer: true, parent: true, student: false },
  { permission: "View Reports", systemAdmin: true, clubAdmin: true, coach: true, freelancer: true, parent: true, student: false },
  { permission: "Manage Evaluations", systemAdmin: true, clubAdmin: true, coach: true, freelancer: true, parent: false, student: false },
]

// ============================================================================
// COACH DASHBOARD DATA
// ============================================================================

export const coachStats: StatItem[] = [
  { title: "My Students", value: "45", change: "+3 this week", icon: Users, color: "from-teal-500 to-teal-600" },
  { title: "Sessions Today", value: "4", change: "2 completed", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { title: "Attendance Rate", value: "94%", change: "+2%", icon: UserCheck, color: "from-green-500 to-green-600" },
  {
    title: "Pending Evaluations",
    value: "8",
    change: "Due this week",
    icon: GraduationCap,
    color: "from-yellow-500 to-orange-500",
  },
]

export interface Session {
  time: string
  name: string
  status: string
  duration: string
  coach?: string
  /** Number of students in the session (use for display) */
  students?: number
  /** Number of enrolled students (same as students, for enrollment context) */
  enrolled?: number
  /** Maximum capacity of the session */
  capacity?: number
}

export const coachTodaySessions: Session[] = [
  { time: "09:00 AM", name: "Junior Swimming", students: 15, status: "completed", duration: "1h" },
  { time: "11:00 AM", name: "Intermediate Swimming", students: 12, status: "ongoing", duration: "1.5h" },
  { time: "02:00 PM", name: "Advanced Techniques", students: 8, status: "upcoming", duration: "1h" },
  { time: "04:00 PM", name: "Private Lesson", students: 1, status: "upcoming", duration: "45m" },
]

export interface StudentProgress {
  name: string
  avatar: string
  lastSession: string
  progress: number
  status: string
}

export const coachRecentStudents: StudentProgress[] = [
  { name: "Emma Davis", avatar: "ED", lastSession: "Today", progress: 92, status: "Excellent" },
  { name: "Jack Wilson", avatar: "JW", lastSession: "Yesterday", progress: 85, status: "Good" },
  { name: "Sophie Miller", avatar: "SM", lastSession: "Today", progress: 78, status: "Improving" },
  { name: "Lucas Brown", avatar: "LB", lastSession: "2 days ago", progress: 65, status: "Needs Focus" },
]

export interface PendingEvaluation {
  student: string
  type: string
  dueDate: string
}

export const coachPendingEvaluations: PendingEvaluation[] = [
  { student: "Emma Davis", type: "Monthly Progress", dueDate: "Nov 30" },
  { student: "Jack Wilson", type: "Skill Assessment", dueDate: "Dec 1" },
  { student: "Sophie Miller", type: "Monthly Progress", dueDate: "Dec 2" },
]

// ============================================================================
// CLUB DASHBOARD DATA
// ============================================================================

export const clubStats: StatItem[] = [
  { title: "Total Members", value: "450", change: "+12", icon: Users, color: "from-blue-500 to-blue-600" },
  { title: "Active Coaches", value: "12", change: "+2", icon: UserCog, color: "from-teal-500 to-teal-600" },
  { title: "Sessions Today", value: "8", change: "3 ongoing", icon: Calendar, color: "from-green-500 to-green-600" },
  {
    title: "Monthly Revenue",
    value: "$12,400",
    change: "+18%",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
  },
]

export const clubTodaySessions: Session[] = [
  { time: "09:00 AM", name: "Junior Swimming", coach: "John Smith", enrolled: 15, capacity: 20, students: 15, status: "completed", duration: "1h" },
  { time: "11:00 AM", name: "Basketball Training", coach: "Mike Johnson", enrolled: 18, capacity: 20, students: 18, status: "ongoing", duration: "1h" },
  { time: "02:00 PM", name: "Soccer Practice", coach: "Sarah Wilson", enrolled: 22, capacity: 25, students: 22, status: "upcoming", duration: "1.5h" },
  { time: "04:00 PM", name: "Tennis Lessons", coach: "David Lee", enrolled: 8, capacity: 10, students: 8, status: "upcoming", duration: "1h" },
]

export interface TopPerformer {
  name: string
  sport: string
  progress: number
  badge: string
}

export const clubTopPerformers: TopPerformer[] = [
  { name: "Emma Davis", sport: "Swimming", progress: 95, badge: "Gold" },
  { name: "Jack Wilson", sport: "Basketball", progress: 88, badge: "Silver" },
  { name: "Sophie Miller", sport: "Soccer", progress: 82, badge: "Bronze" },
]

export interface Payment {
  member: string
  amount: string
  type: string
  date: string
  status: string
}

export const clubRecentPayments: Payment[] = [
  { member: "John Smith", amount: "$150", type: "Monthly", date: "Today", status: "completed" },
  { member: "Emma Davis", amount: "$200", type: "Quarterly", date: "Yesterday", status: "completed" },
  { member: "Mike Brown", amount: "$150", type: "Monthly", date: "2 days ago", status: "pending" },
]

// ============================================================================
// PARENT DASHBOARD DATA
// ============================================================================

export const parentStats: StatItem[] = [
  { title: "My Kids", value: "2", subtitle: "Active enrollments", icon: Users, color: "from-pink-500 to-rose-500" },
  { title: "Upcoming Sessions", value: "5", subtitle: "This week", icon: Calendar, color: "from-blue-500 to-blue-600" },
  {
    title: "Avg Progress",
    value: "87%",
    subtitle: "+5% this month",
    icon: GraduationCap,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Total Spent",
    value: "$450",
    subtitle: "This month",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
  },
]

export interface Kid {
  name: string
  age: number
  avatar: string
  sport: string
  coach: string
  nextSession: string
  progress: number
  badges: number
}

export const parentKids: Kid[] = [
  {
    name: "Emma Thompson",
    age: 10,
    avatar: "ET",
    sport: "Swimming",
    coach: "John Smith",
    nextSession: "Today, 4:00 PM",
    progress: 92,
    badges: 5,
  },
  {
    name: "Jake Thompson",
    age: 8,
    avatar: "JT",
    sport: "Basketball",
    coach: "Mike Johnson",
    nextSession: "Tomorrow, 10:00 AM",
    progress: 78,
    badges: 3,
  },
]

export interface UpcomingSession {
  kid: string
  sport: string
  coach: string
  time: string
  duration: string
  location: string
}

export const parentUpcomingSessions: UpcomingSession[] = [
  { kid: "Emma", sport: "Swimming", coach: "John Smith", time: "Today, 4:00 PM", duration: "1h", location: "Pool A" },
  { kid: "Jake", sport: "Basketball", coach: "Mike Johnson", time: "Tomorrow, 10:00 AM", duration: "1.5h", location: "Court 3" },
  { kid: "Emma", sport: "Swimming", coach: "John Smith", time: "Dec 2, 4:00 PM", duration: "1h", location: "Pool A" },
  { kid: "Jake", sport: "Basketball", coach: "Mike Johnson", time: "Dec 3, 10:00 AM", duration: "1.5h", location: "Court 3" },
]

export interface Achievement {
  kid: string
  achievement: string
  date: string
  type: string
}

export const parentRecentAchievements: Achievement[] = [
  { kid: "Emma", achievement: "Completed 10 Swimming Sessions", date: "2 days ago", type: "milestone" },
  { kid: "Jake", achievement: "First Basket Score!", date: "1 week ago", type: "skill" },
  { kid: "Emma", achievement: "Perfect Attendance Badge", date: "1 week ago", type: "badge" },
]

// ============================================================================
// FREELANCER DASHBOARD DATA
// ============================================================================

export const freelancerStats: StatItem[] = [
  {
    title: "Total Earnings",
    value: "$4,850",
    change: "+$620 this week",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
  },
  { title: "Active Clients", value: "28", change: "+5 this month", icon: Users, color: "from-blue-500 to-blue-600" },
  {
    title: "Sessions This Week",
    value: "12",
    change: "4 completed",
    icon: Calendar,
    color: "from-yellow-500 to-orange-500",
  },
  { title: "Rating", value: "4.9", change: "32 reviews", icon: Star, color: "from-purple-500 to-purple-600" },
]

export interface Booking {
  time: string
  client: string
  type: string
  duration: string
  amount: string
  status: string
}

export const freelancerUpcomingBookings: Booking[] = [
  { time: "Today, 2:00 PM", client: "Emma Davis", type: "Swimming Lesson", duration: "1h", amount: "$75", status: "confirmed" },
  { time: "Today, 4:00 PM", client: "Jack Wilson", type: "Private Training", duration: "1.5h", amount: "$100", status: "confirmed" },
  { time: "Tomorrow, 10:00 AM", client: "Sophie Miller", type: "Swimming Lesson", duration: "1h", amount: "$75", status: "pending" },
  { time: "Tomorrow, 3:00 PM", client: "New Client", type: "Trial Session", duration: "45m", amount: "$50", status: "pending" },
]

export interface Client {
  name: string
  sessions: number
  totalSpent: string
  lastSession: string
  rating: number
}

export const freelancerRecentClients: Client[] = [
  { name: "Emma Davis", sessions: 12, totalSpent: "$900", lastSession: "Today", rating: 5 },
  { name: "Jack Wilson", sessions: 8, totalSpent: "$600", lastSession: "Yesterday", rating: 5 },
  { name: "Sophie Miller", sessions: 6, totalSpent: "$450", lastSession: "2 days ago", rating: 4 },
]

export interface Review {
  client: string
  rating: number
  comment: string
  date: string
}

export const freelancerRecentReviews: Review[] = [
  { client: "Emma Davis", rating: 5, comment: "Excellent coach! Very patient and knowledgeable.", date: "2 days ago" },
  { client: "Jack Wilson", rating: 5, comment: "Great session, learned a lot!", date: "1 week ago" },
]

// ============================================================================
// HEAD COACH DASHBOARD DATA
// ============================================================================

export const headCoachStats: StatItem[] = [
  { title: "Coaches", value: "8", subtitle: "Under supervision", icon: Users, color: "from-orange-500 to-red-500" },
  { title: "Programs", value: "12", subtitle: "Active training", icon: ClipboardList, color: "from-blue-500 to-blue-600" },
  { title: "Sessions", value: "24", subtitle: "This week", icon: Calendar, color: "from-green-500 to-green-600" },
  { title: "Athletes", value: "156", subtitle: "Total roster", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
]

export interface Coach {
  name: string
  specialty: string
  students: number
  sessions: number
  rating: number
}

export const headCoachCoaches: Coach[] = [
  { name: "Sarah Williams", specialty: "Swimming", students: 28, sessions: 8, rating: 4.9 },
  { name: "Mike Johnson", specialty: "Basketball", students: 24, sessions: 6, rating: 4.8 },
  { name: "David Brown", specialty: "Soccer", students: 32, sessions: 10, rating: 4.7 },
]

export interface HeadCoachSession {
  program: string
  coach: string
  time: string
  athletes: number
}

export const headCoachUpcomingSessions: HeadCoachSession[] = [
  { program: "Elite Swimming", coach: "Sarah Williams", time: "10:00 AM", athletes: 12 },
  { program: "Junior Basketball", coach: "Mike Johnson", time: "2:00 PM", athletes: 8 },
  { program: "Soccer Academy", coach: "David Brown", time: "4:00 PM", athletes: 15 },
]

// ============================================================================
// STUDENT DASHBOARD DATA
// ============================================================================

export const studentStats: StatItem[] = [
  { title: "Sessions Completed", value: "24", change: "+3 this week", icon: Calendar, color: "from-purple-500 to-purple-600" },
  { title: "Current Level", value: "Advanced", subtitle: "Swimming", icon: Star, color: "from-yellow-500 to-orange-500" },
  { title: "Attendance", value: "96%", change: "+2%", icon: UserCheck, color: "from-green-500 to-green-600" },
  { title: "Next Session", value: "Today", subtitle: "4:00 PM", icon: Clock, color: "from-blue-500 to-blue-600" },
]

export interface StudentSession {
  time: string
  name: string
  coach: string
  location: string
  duration: string
}

export const studentUpcomingSessions: StudentSession[] = [
  { time: "Today, 4:00 PM", name: "Swimming Practice", coach: "John Smith", location: "Pool A", duration: "1h" },
  { time: "Tomorrow, 10:00 AM", name: "Technique Training", coach: "John Smith", location: "Pool A", duration: "1.5h" },
  { time: "Dec 2, 4:00 PM", name: "Swimming Practice", coach: "John Smith", location: "Pool A", duration: "1h" },
]

export interface Evaluation {
  date: string
  type: string
  score: number
  coach: string
  feedback: string
}

export const studentRecentEvaluations: Evaluation[] = [
  { date: "Nov 25", type: "Monthly Progress", score: 92, coach: "John Smith", feedback: "Excellent improvement in technique" },
  { date: "Nov 15", type: "Skill Assessment", score: 88, coach: "John Smith", feedback: "Great stamina, work on turns" },
  { date: "Nov 1", type: "Monthly Progress", score: 85, coach: "John Smith", feedback: "Good progress overall" },
]

export interface StudentAchievement {
  title: string
  date: string
  icon: LucideIcon
  color: string
}

export const studentAchievements: StudentAchievement[] = [
  { title: "Perfect Attendance", date: "This Month", icon: Star, color: "text-yellow-500" },
  { title: "Advanced Level Achieved", date: "Nov 15", icon: TrendingUp, color: "text-green-500" },
  { title: "100 Laps Milestone", date: "Nov 1", icon: CheckCircle, color: "text-blue-500" },
]

export interface StudentPageStat {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: string
}

export const studentPageStats: StudentPageStat[] = [
  { title: "Upcoming Sessions", value: "4", subtitle: "This week", icon: Calendar, color: "from-indigo-500 to-purple-500" },
  { title: "Overall Progress", value: "78%", subtitle: "+5% this month", icon: TrendingUp, color: "from-green-500 to-green-600" },
  { title: "Badges Earned", value: "12", subtitle: "2 new this month", icon: Star, color: "from-yellow-500 to-orange-500" },
  { title: "Attendance", value: "95%", subtitle: "Excellent!", icon: CheckCircle, color: "from-blue-500 to-blue-600" },
]

export interface StudentPageSession {
  sport: string
  coach: string
  time: string
  location: string
  duration: string
}

export const studentPageUpcomingSessions: StudentPageSession[] = [
  { sport: "Swimming", coach: "John Smith", time: "Today, 4:00 PM", location: "Pool A", duration: "1h" },
  { sport: "Swimming", coach: "John Smith", time: "Tomorrow, 4:00 PM", location: "Pool A", duration: "1h" },
  { sport: "Fitness Training", coach: "Mike Brown", time: "Wed, 10:00 AM", location: "Gym B", duration: "45min" },
]

export interface StudentPageEvaluation {
  skill: string
  score: number
  date: string
  feedback: string
}

export const studentPageRecentEvaluations: StudentPageEvaluation[] = [
  { skill: "Freestyle Technique", score: 85, date: "Nov 28", feedback: "Great improvement!" },
  { skill: "Breathing Control", score: 78, date: "Nov 25", feedback: "Keep practicing" },
  { skill: "Endurance", score: 90, date: "Nov 20", feedback: "Excellent progress" },
]

export interface StudentPageAchievement {
  name: string
  description: string
  date: string
  icon: string
}

export const studentPageAchievements: StudentPageAchievement[] = [
  { name: "First Lap!", description: "Completed first 50m lap", date: "1 week ago", icon: "🏊" },
  { name: "Perfect Attendance", description: "Attended all sessions this month", date: "2 weeks ago", icon: "⭐" },
  { name: "Skill Master", description: "Mastered freestyle basics", date: "3 weeks ago", icon: "🏆" },
]

// ============================================================================
// FRONT DESK DASHBOARD DATA
// ============================================================================

export interface FrontDeskPageStat {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: string
}

export const frontDeskPageStats: FrontDeskPageStat[] = [
  { title: "Checked In Today", value: "47", subtitle: "15 pending", icon: UserCheck, color: "from-cyan-500 to-blue-500" },
  { title: "Today's Sessions", value: "12", subtitle: "3 in progress", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { title: "Walk-ins", value: "8", subtitle: "2 waiting", icon: Users, color: "from-teal-500 to-teal-600" },
  { title: "Inquiries", value: "5", subtitle: "3 unread", icon: AlertTriangle, color: "from-purple-500 to-purple-600" },
]

export interface FrontDeskPageSession {
  time: string
  name: string
  coach: string
  expected: number
  checkedIn: number
  location: string
}

export const frontDeskPageUpcomingSessions: FrontDeskPageSession[] = [
  { time: "10:00 AM", name: "Swimming - Beginners", coach: "John Smith", expected: 12, checkedIn: 8, location: "Pool A" },
  { time: "10:30 AM", name: "Basketball Training", coach: "Mike Johnson", expected: 8, checkedIn: 5, location: "Court 2" },
  { time: "11:00 AM", name: "Tennis - Advanced", coach: "Sarah Williams", expected: 6, checkedIn: 0, location: "Court 1" },
  { time: "11:30 AM", name: "Soccer Practice", coach: "David Brown", expected: 15, checkedIn: 0, location: "Field B" },
]

export interface FrontDeskPageCheckin {
  name: string
  time: string
  session: string
  avatar: string
}

export const frontDeskPageRecentCheckins: FrontDeskPageCheckin[] = [
  { name: "Emma Thompson", time: "2 min ago", session: "Swimming", avatar: "ET" },
  { name: "Jake Wilson", time: "5 min ago", session: "Basketball", avatar: "JW" },
  { name: "Lily Chen", time: "8 min ago", session: "Swimming", avatar: "LC" },
  { name: "Noah Davis", time: "12 min ago", session: "Tennis", avatar: "ND" },
]

export const frontDeskStats: StatItem[] = [
  { title: "Check-ins Today", value: "45", change: "+12", icon: UserCheck, color: "from-blue-500 to-blue-600" },
  { title: "Active Sessions", value: "4", subtitle: "Ongoing", icon: Calendar, color: "from-green-500 to-green-600" },
  { title: "Visitors", value: "8", change: "3 pending", icon: Users, color: "from-yellow-500 to-orange-500" },
  { title: "Inquiries", value: "6", change: "2 new", icon: AlertTriangle, color: "from-purple-500 to-purple-600" },
]

export interface Checkin {
  name: string
  type: string
  time: string
  session?: string
  status: string
}

export const frontDeskRecentCheckins: Checkin[] = [
  { name: "Emma Davis", type: "Student", time: "10:32 AM", session: "Junior Swimming", status: "checked-in" },
  { name: "John Smith", type: "Coach", time: "10:15 AM", status: "checked-in" },
  { name: "Sarah Wilson", type: "Parent", time: "10:00 AM", status: "checked-in" },
  { name: "Mike Brown", type: "Visitor", time: "9:45 AM", status: "pending" },
]

export interface FrontDeskSession {
  time: string
  name: string
  coach: string
  enrolled: number
  checkedIn: number
  status: string
}

export const frontDeskUpcomingSessions: FrontDeskSession[] = [
  { time: "11:00 AM", name: "Intermediate Swimming", coach: "John Smith", enrolled: 15, checkedIn: 12, status: "in-progress" },
  { time: "02:00 PM", name: "Advanced Techniques", coach: "Sarah Wilson", enrolled: 8, checkedIn: 0, status: "upcoming" },
  { time: "04:00 PM", name: "Private Lesson", coach: "Mike Johnson", enrolled: 1, checkedIn: 0, status: "upcoming" },
]

// ============================================================================
// ACCOUNTANT DASHBOARD DATA
// ============================================================================

export const accountantStats: StatItem[] = [
  { title: "Total Revenue", value: "$128,450", change: "+12.5%", icon: DollarSign, color: "from-green-500 to-green-600" },
  { title: "Outstanding", value: "$8,240", change: "-5.2%", icon: CreditCard, color: "from-red-500 to-red-600" },
  { title: "Invoices", value: "156", subtitle: "This month", icon: ClipboardList, color: "from-blue-500 to-blue-600" },
  { title: "Refunds", value: "$1,250", subtitle: "3 pending", icon: AlertTriangle, color: "from-yellow-500 to-orange-500" },
]

export interface Transaction {
  id: string
  client: string
  amount: string
  type: string
  date: string
  status: string
}

export const accountantRecentTransactions: Transaction[] = [
  { id: "TXN001", client: "Champions FC", amount: "$2,400", type: "Subscription", date: "Today", status: "completed" },
  { id: "TXN002", client: "John Smith", amount: "$150", type: "Session Fee", date: "Today", status: "completed" },
  { id: "TXN003", client: "Emma Davis", amount: "$75", type: "Refund", date: "Yesterday", status: "pending" },
  { id: "TXN004", client: "Elite Academy", amount: "$3,600", type: "Subscription", date: "Yesterday", status: "completed" },
]

export interface Invoice {
  id: string
  client: string
  amount: string
  dueDate: string
  status: string
}

export const accountantPendingInvoices: Invoice[] = [
  { id: "INV001", client: "Victory Athletics", amount: "$1,800", dueDate: "Dec 5", status: "pending" },
  { id: "INV002", client: "Premier Training", amount: "$2,100", dueDate: "Dec 7", status: "overdue" },
  { id: "INV003", client: "Rising Stars", amount: "$900", dueDate: "Dec 10", status: "pending" },
]

export interface AccountantPageStat {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: LucideIcon
  color: string
}

export const accountantPageStats: AccountantPageStat[] = [
  {
    title: "Monthly Revenue",
    value: "$128,450",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Pending Invoices",
    value: "$24,680",
    change: "15 invoices",
    trend: "neutral",
    icon: ClipboardList,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Collected Today",
    value: "$8,450",
    change: "+$2,100 from avg",
    trend: "up",
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Overdue Amount",
    value: "$5,280",
    change: "3 invoices",
    trend: "down",
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
  },
]

export interface AccountantPageTransaction {
  id: string
  member: string
  type: string
  amount: string
  status: string
  date: string
}

export const accountantPageRecentTransactions: AccountantPageTransaction[] = [
  { id: "TXN-1234", member: "Champions FC", type: "membership", amount: "$1,200", status: "completed", date: "Today" },
  { id: "TXN-1233", member: "John Smith", type: "session", amount: "$85", status: "completed", date: "Today" },
  { id: "TXN-1232", member: "Elite Academy", type: "bulk", amount: "$3,500", status: "pending", date: "Yesterday" },
  { id: "TXN-1231", member: "Sarah Wilson", type: "refund", amount: "-$45", status: "completed", date: "Yesterday" },
  { id: "TXN-1230", member: "Victory Sports", type: "membership", amount: "$950", status: "completed", date: "2 days ago" },
]

export interface AccountantPageInvoice {
  id: string
  client: string
  amount: string
  dueDate: string
  daysLeft: number
}

export const accountantPagePendingInvoices: AccountantPageInvoice[] = [
  { id: "INV-2024-001", client: "Champions FC", amount: "$4,500", dueDate: "Dec 5", daysLeft: 3 },
  { id: "INV-2024-002", client: "Elite Sports", amount: "$2,800", dueDate: "Dec 8", daysLeft: 6 },
  { id: "INV-2024-003", client: "Victory Club", amount: "$1,950", dueDate: "Dec 10", daysLeft: 8 },
]

// ============================================================================
// MEDICAL DASHBOARD DATA
// ============================================================================

export const medicalStats: StatItem[] = [
  { title: "Health Records", value: "1,284", subtitle: "Total", icon: Heart, color: "from-red-500 to-red-600" },
  { title: "Active Injuries", value: "12", change: "-3", icon: AlertTriangle, color: "from-yellow-500 to-orange-500" },
  { title: "Clearances Due", value: "8", subtitle: "This week", icon: CheckCircle, color: "from-green-500 to-green-600" },
  { title: "First Aid Cases", value: "3", subtitle: "Today", icon: Thermometer, color: "from-blue-500 to-blue-600" },
]

export interface Injury {
  student: string
  type: string
  date: string
  status: string
  severity: string
}

export const medicalRecentInjuries: Injury[] = [
  { student: "Jack Wilson", type: "Sprained Ankle", date: "Today", status: "Under Treatment", severity: "Moderate" },
  { student: "Emma Davis", type: "Minor Cut", date: "Yesterday", status: "Healed", severity: "Low" },
  { student: "Lucas Brown", type: "Muscle Strain", date: "2 days ago", status: "Recovering", severity: "Moderate" },
]

export interface Checkup {
  student: string
  type: string
  date: string
  doctor: string
}

export const medicalUpcomingCheckups: Checkup[] = [
  { student: "Sophie Miller", type: "Annual Physical", date: "Dec 5", doctor: "Dr. Johnson" },
  { student: "Jake Thompson", type: "Sports Clearance", date: "Dec 6", doctor: "Dr. Smith" },
  { student: "Emma Davis", type: "Follow-up", date: "Dec 8", doctor: "Dr. Johnson" },
]

// ============================================================================
// MAINTENANCE DASHBOARD DATA
// ============================================================================

export const maintenanceStats: StatItem[] = [
  { title: "Open Work Orders", value: "12", change: "+3", icon: Wrench, color: "from-blue-500 to-blue-600" },
  { title: "Completed Today", value: "5", subtitle: "Tasks", icon: CheckCircle, color: "from-green-500 to-green-600" },
  { title: "Equipment Issues", value: "4", change: "-2", icon: AlertTriangle, color: "from-yellow-500 to-orange-500" },
  { title: "Scheduled", value: "8", subtitle: "This week", icon: Calendar, color: "from-purple-500 to-purple-600" },
]

export interface MaintenanceTask {
  title: string
  location: string
  priority: string
  assignee: string
  dueDate: string
  status: string
}

export const maintenanceRecentTasks: MaintenanceTask[] = [
  { title: "Pool Filter Replacement", location: "Pool A", priority: "High", assignee: "Mike Tech", dueDate: "Today", status: "In Progress" },
  { title: "Court Lighting Repair", location: "Court 2", priority: "Medium", assignee: "John Maint", dueDate: "Tomorrow", status: "Pending" },
  { title: "HVAC Maintenance", location: "Gym", priority: "Low", assignee: "Sarah Fix", dueDate: "Dec 5", status: "Scheduled" },
]

// ============================================================================
// SECURITY DASHBOARD DATA
// ============================================================================

export const securityStats: StatItem[] = [
  { title: "Active Visitors", value: "8", subtitle: "On site", icon: Users, color: "from-blue-500 to-blue-600" },
  { title: "Incidents Today", value: "0", subtitle: "All clear", icon: Shield, color: "from-green-500 to-green-600" },
  { title: "Access Logs", value: "156", subtitle: "Today", icon: ClipboardList, color: "from-yellow-500 to-orange-500" },
  { title: "Patrols Completed", value: "4", subtitle: "Of 6", icon: CheckCircle, color: "from-purple-500 to-purple-600" },
]

export interface SecurityTask {
  title: string
  time: string
  location: string
  status: string
  priority: string
}

export const securityRecentTasks: SecurityTask[] = [
  { title: "Perimeter Check", time: "10:00 AM", location: "Building A", status: "Completed", priority: "Normal" },
  { title: "Visitor Escort", time: "10:30 AM", location: "Main Gate", status: "In Progress", priority: "Normal" },
  { title: "Equipment Check", time: "11:00 AM", location: "Security Room", status: "Pending", priority: "High" },
]

// ============================================================================
// EQUIPMENT DASHBOARD DATA
// ============================================================================

export const equipmentStats: StatItem[] = [
  { title: "Total Items", value: "1,256", subtitle: "In inventory", icon: ClipboardList, color: "from-blue-500 to-blue-600" },
  { title: "Checked Out", value: "89", change: "+12", icon: UserCheck, color: "from-green-500 to-green-600" },
  { title: "Maintenance Due", value: "15", subtitle: "This week", icon: Wrench, color: "from-yellow-500 to-orange-500" },
  { title: "Low Stock", value: "8", subtitle: "Items", icon: AlertTriangle, color: "from-red-500 to-red-600" },
]

export interface EquipmentTask {
  title: string
  category: string
  status: string
  assignee: string
  dueDate: string
}

export const equipmentRecentTasks: EquipmentTask[] = [
  { title: "Basketball Equipment Check", category: "Sports", status: "Pending", assignee: "Mike Equipment", dueDate: "Today" },
  { title: "Pool Equipment Inventory", category: "Aquatics", status: "In Progress", assignee: "Sarah Inv", dueDate: "Today" },
  { title: "Gym Equipment Maintenance", category: "Fitness", status: "Scheduled", assignee: "John Maint", dueDate: "Tomorrow" },
]

// ============================================================================
// FACILITY DASHBOARD DATA
// ============================================================================

export const facilityStats: StatItem[] = [
  { title: "Total Venues", value: "12", subtitle: "Active", icon: Building2, color: "from-blue-500 to-blue-600" },
  { title: "Bookings Today", value: "24", change: "+5", icon: Calendar, color: "from-green-500 to-green-600" },
  { title: "Maintenance", value: "3", subtitle: "Pending", icon: Wrench, color: "from-yellow-500 to-orange-500" },
  { title: "Utilization", value: "78%", change: "+12%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
]

export interface Venue {
  name: string
  type: string
  capacity: number
  status: string
  nextBooking: string
}

export const facilityVenues: Venue[] = [
  { name: "Olympic Pool", type: "Aquatics", capacity: 50, status: "Available", nextBooking: "10:00 AM" },
  { name: "Basketball Court 1", type: "Indoor", capacity: 30, status: "Occupied", nextBooking: "2:00 PM" },
  { name: "Soccer Field A", type: "Outdoor", capacity: 40, status: "Available", nextBooking: "4:00 PM" },
  { name: "Tennis Court 2", type: "Outdoor", capacity: 10, status: "Maintenance", nextBooking: "Tomorrow" },
]

export interface MaintenanceRequest {
  venue: string
  issue: string
  priority: string
  reportedBy: string
  status: string
}

export const facilityMaintenanceRequests: MaintenanceRequest[] = [
  { venue: "Tennis Court 2", issue: "Net replacement needed", priority: "High", reportedBy: "Coach David", status: "In Progress" },
  { venue: "Gym", issue: "AC not working", priority: "Medium", reportedBy: "Staff", status: "Pending" },
  { venue: "Pool A", issue: "Tile repair", priority: "Low", reportedBy: "Maintenance", status: "Scheduled" },
]

// ============================================================================
// GROUND DASHBOARD DATA
// ============================================================================

export const groundStats: StatItem[] = [
  { title: "Active Grounds", value: "6", subtitle: "Fields", icon: Building2, color: "from-green-500 to-green-600" },
  { title: "Condition", value: "Good", subtitle: "Average", icon: CheckCircle, color: "from-blue-500 to-blue-600" },
  { title: "Tasks Today", value: "8", change: "3 completed", icon: ClipboardList, color: "from-yellow-500 to-orange-500" },
  { title: "Irrigation", value: "Active", subtitle: "All zones", icon: Droplets, color: "from-cyan-500 to-cyan-600" },
]

export interface GroundTask {
  title: string
  field: string
  priority: string
  status: string
  assignee: string
}

export const groundRecentTasks: GroundTask[] = [
  { title: "Morning Mowing", field: "Soccer Field A", priority: "Normal", status: "Completed", assignee: "Tom Grounds" },
  { title: "Line Marking", field: "Football Field", priority: "High", status: "In Progress", assignee: "Mike Lines" },
  { title: "Aeration", field: "Practice Field 2", priority: "Medium", status: "Scheduled", assignee: "Sarah Turf" },
]

// ============================================================================
// GROUNDSKEEPER DASHBOARD DATA
// ============================================================================

export const groundskeeperStats: StatItem[] = [
  { title: "Tasks Today", value: "12", change: "5 completed", icon: ClipboardList, color: "from-green-500 to-green-600" },
  { title: "Fields Status", value: "Good", subtitle: "All fields", icon: CheckCircle, color: "from-blue-500 to-blue-600" },
  { title: "Irrigation", value: "Active", subtitle: "6 zones", icon: Droplets, color: "from-cyan-500 to-cyan-600" },
  { title: "Weather Alert", value: "Clear", subtitle: "Next 3 days", icon: Thermometer, color: "from-yellow-500 to-orange-500" },
]

export const groundskeeperRecentTasks: GroundTask[] = [
  { title: "Turf Mowing", field: "Main Stadium", priority: "High", status: "Completed", assignee: "Self" },
  { title: "Irrigation Check", field: "All Fields", priority: "Normal", status: "In Progress", assignee: "Self" },
  { title: "Fertilizer Application", field: "Training Pitch", priority: "Medium", status: "Pending", assignee: "Self" },
]

// ============================================================================
// VENUE DASHBOARD DATA
// ============================================================================

export const venueStats: StatItem[] = [
  { title: "Total Venues", value: "8", subtitle: "Managed", icon: Building2, color: "from-purple-500 to-purple-600" },
  { title: "Events Today", value: "5", change: "+2", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { title: "Capacity Used", value: "72%", subtitle: "Average", icon: Users, color: "from-green-500 to-green-600" },
  { title: "Revenue", value: "$4,200", subtitle: "Today", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
]

export interface VenueTask {
  title: string
  venue: string
  time: string
  status: string
}

export const venueRecentTasks: VenueTask[] = [
  { title: "Setup for Tournament", venue: "Main Court", time: "8:00 AM", status: "Completed" },
  { title: "Sound System Check", venue: "Auditorium", time: "10:00 AM", status: "In Progress" },
  { title: "Lighting Adjustment", venue: "Pool Area", time: "2:00 PM", status: "Scheduled" },
]

// ============================================================================
// CLEANING DASHBOARD DATA
// ============================================================================

export const cleaningStats: StatItem[] = [
  { title: "Areas Cleaned", value: "18", subtitle: "Today", icon: CheckCircle, color: "from-green-500 to-green-600" },
  { title: "In Progress", value: "4", subtitle: "Areas", icon: Clock, color: "from-blue-500 to-blue-600" },
  { title: "Pending", value: "6", subtitle: "Scheduled", icon: Calendar, color: "from-yellow-500 to-orange-500" },
  { title: "Staff Active", value: "8", subtitle: "On duty", icon: Users, color: "from-purple-500 to-purple-600" },
]

export interface CleaningTask {
  area: string
  type: string
  assignee: string
  status: string
  time: string
}

export const cleaningRecentTasks: CleaningTask[] = [
  { area: "Main Lobby", type: "Deep Clean", assignee: "Maria", status: "Completed", time: "9:00 AM" },
  { area: "Locker Room A", type: "Sanitization", assignee: "John", status: "In Progress", time: "10:30 AM" },
  { area: "Pool Deck", type: "Standard", assignee: "Sarah", status: "Pending", time: "11:00 AM" },
]

// ============================================================================
// BOOKINGS COORDINATOR DASHBOARD DATA
// ============================================================================

export const bookingsCoordinatorStats: StatItem[] = [
  { title: "Today's Bookings", value: "24", change: "+5", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { title: "Pending Confirmations", value: "8", subtitle: "Awaiting", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { title: "Cancellations", value: "2", subtitle: "Today", icon: AlertTriangle, color: "from-red-500 to-red-600" },
  { title: "Utilization", value: "78%", change: "+5%", icon: TrendingUp, color: "from-green-500 to-green-600" },
]

export interface BookingTask {
  title: string
  facility: string
  client: string
  time: string
  status: string
}

export const bookingsCoordinatorRecentTasks: BookingTask[] = [
  { title: "Tournament Setup", facility: "Main Court", client: "Champions FC", time: "9:00 AM", status: "Confirmed" },
  { title: "Training Session", facility: "Pool A", client: "Swim Academy", time: "10:00 AM", status: "Confirmed" },
  { title: "Private Event", facility: "Auditorium", client: "Corporate", time: "2:00 PM", status: "Pending" },
]

// ============================================================================
// CONTENT MANAGER DASHBOARD DATA
// ============================================================================

export const contentManagerStats: StatItem[] = [
  { title: "Published Content", value: "156", subtitle: "Total", icon: ClipboardList, color: "from-blue-500 to-blue-600" },
  { title: "Pending Review", value: "8", subtitle: "Items", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { title: "Engagement", value: "12.5K", change: "+18%", icon: TrendingUp, color: "from-green-500 to-green-600" },
  { title: "Newsletters", value: "4", subtitle: "This month", icon: Users, color: "from-purple-500 to-purple-600" },
]

export interface ContentItem {
  title: string
  type: string
  author: string
  status: string
  date: string
}

export const contentManagerRecentContent: ContentItem[] = [
  { title: "Winter Training Schedule", type: "Announcement", author: "Admin", status: "Published", date: "Today" },
  { title: "Holiday Hours", type: "Newsletter", author: "Content Team", status: "Draft", date: "Yesterday" },
  { title: "New Coach Introduction", type: "Social", author: "Marketing", status: "Pending", date: "Yesterday" },
]

// ============================================================================
// SYSTEM SUPPORT DASHBOARD DATA
// ============================================================================

export const systemSupportStats: StatItem[] = [
  { title: "Open Tickets", value: "24", change: "+3", icon: ClipboardList, color: "from-red-500 to-red-600" },
  { title: "Resolved Today", value: "12", subtitle: "Tickets", icon: CheckCircle, color: "from-green-500 to-green-600" },
  { title: "Avg Response", value: "2.5h", change: "-30min", icon: Clock, color: "from-blue-500 to-blue-600" },
  { title: "User Satisfaction", value: "94%", change: "+2%", icon: Star, color: "from-yellow-500 to-orange-500" },
]

export interface Ticket {
  id: string
  title: string
  priority: string
  status: string
  user: string
  created: string
}

export const systemSupportRecentTickets: Ticket[] = [
  { id: "TKT-001", title: "Login issues", priority: "High", status: "In Progress", user: "John Smith", created: "2 hours ago" },
  { id: "TKT-002", title: "Payment failed", priority: "Critical", status: "Open", user: "Emma Davis", created: "1 hour ago" },
  { id: "TKT-003", title: "Schedule not loading", priority: "Medium", status: "Pending", user: "Mike Johnson", created: "30 min ago" },
]

export interface SystemStatus {
  service: string
  status: string
  uptime: string
}

export const systemSupportSystemStatus: SystemStatus[] = [
  { service: "API Gateway", status: "Operational", uptime: "99.9%" },
  { service: "Database", status: "Operational", uptime: "99.8%" },
  { service: "Payment System", status: "Degraded", uptime: "98.5%" },
  { service: "Email Service", status: "Operational", uptime: "99.9%" },
]

// ============================================================================
// COACH SUB-PAGES DATA
// ============================================================================

export interface CoachStudent {
  id: number
  name: string
  avatar: string
  age: number
  level: string
  progress: number
  attendance: number
  nextSession: string
  parentContact: string
}

export const coachStudents: CoachStudent[] = [
  { id: 1, name: "Emma Davis", avatar: "ED", age: 12, level: "Advanced", progress: 92, attendance: 98, nextSession: "Today, 11:00 AM", parentContact: "Robert Davis" },
  { id: 2, name: "Jack Wilson", avatar: "JW", age: 14, level: "Intermediate", progress: 85, attendance: 95, nextSession: "Today, 2:00 PM", parentContact: "Sarah Wilson" },
  { id: 3, name: "Sophie Miller", avatar: "SM", age: 10, level: "Intermediate", progress: 78, attendance: 90, nextSession: "Tomorrow, 10:00 AM", parentContact: "Tom Miller" },
  { id: 4, name: "Lucas Brown", avatar: "LB", age: 13, level: "Beginner", progress: 65, attendance: 82, nextSession: "Tomorrow, 3:00 PM", parentContact: "Mike Brown" },
  { id: 5, name: "Olivia Johnson", avatar: "OJ", age: 11, level: "Intermediate", progress: 80, attendance: 92, nextSession: "Dec 2, 10:00 AM", parentContact: "Lisa Johnson" },
  { id: 6, name: "Noah Williams", avatar: "NW", age: 9, level: "Beginner", progress: 55, attendance: 88, nextSession: "Dec 2, 2:00 PM", parentContact: "James Williams" },
]

export interface AttendanceSession {
  name: string
  time: string
  date: string
  location: string
}

export const coachCurrentSession: AttendanceSession = {
  name: "Intermediate Swimming",
  time: "11:00 AM - 12:30 PM",
  date: "November 29, 2024",
  location: "Pool A",
}

export interface AttendanceStudent {
  id: number
  name: string
  avatar: string
  status: string
}

export const coachAttendanceStudents: AttendanceStudent[] = [
  { id: 1, name: "Emma Davis", avatar: "ED", status: "present" },
  { id: 2, name: "Jack Wilson", avatar: "JW", status: "present" },
  { id: 3, name: "Sophie Miller", avatar: "SM", status: "present" },
  { id: 4, name: "Lucas Brown", avatar: "LB", status: "absent" },
  { id: 5, name: "Olivia Johnson", avatar: "OJ", status: "present" },
  { id: 6, name: "Noah Williams", avatar: "NW", status: "late" },
  { id: 7, name: "Ava Martinez", avatar: "AM", status: "present" },
  { id: 8, name: "Liam Garcia", avatar: "LG", status: "present" },
]

export interface AttendanceStat {
  label: string
  count: number
  icon: LucideIcon
  color: string
}

export const coachAttendanceStats: AttendanceStat[] = [
  { label: "Present", count: 6, icon: CheckCircle, color: "text-green-500 bg-green-500/20" },
  { label: "Late", count: 1, icon: AlertTriangle, color: "text-yellow-500 bg-yellow-500/20" },
  { label: "Absent", count: 1, icon: AlertTriangle, color: "text-red-500 bg-red-500/20" },
]

export interface PendingEvaluation {
  student: string
  avatar: string
  type: string
  dueDate: string
  priority: string
}

export const coachPendingEvaluationsList: PendingEvaluation[] = [
  { student: "Emma Davis", avatar: "ED", type: "Monthly Progress", dueDate: "Nov 30, 2024", priority: "high" },
  { student: "Jack Wilson", avatar: "JW", type: "Skill Assessment", dueDate: "Dec 1, 2024", priority: "medium" },
  { student: "Sophie Miller", avatar: "SM", type: "Monthly Progress", dueDate: "Dec 2, 2024", priority: "medium" },
  { student: "Lucas Brown", avatar: "LB", type: "Performance Review", dueDate: "Dec 3, 2024", priority: "low" },
]

export interface EvaluationType {
  name: string
  count: number
}

export const coachEvaluationTypes: EvaluationType[] = [
  { name: "Monthly Progress", count: 12 },
  { name: "Skill Assessment", count: 8 },
  { name: "Performance Review", count: 5 },
  { name: "Level Upgrade", count: 3 },
]

export interface StudentProgressData {
  name: string
  avatar: string
  overallProgress: number
  trend: string
  skills: { name: string; level: number }[]
  recentAchievement: string
  lastEvaluation: string
}

export const coachStudentProgress: StudentProgressData[] = [
  {
    name: "Emma Davis", avatar: "ED", overallProgress: 92, trend: "up",
    skills: [{ name: "Freestyle", level: 95 }, { name: "Backstroke", level: 88 }, { name: "Breaststroke", level: 90 }, { name: "Butterfly", level: 85 }],
    recentAchievement: "Gold Badge - Freestyle", lastEvaluation: "Nov 25, 2024",
  },
  {
    name: "Jack Wilson", avatar: "JW", overallProgress: 85, trend: "up",
    skills: [{ name: "Freestyle", level: 88 }, { name: "Backstroke", level: 82 }, { name: "Breaststroke", level: 85 }, { name: "Butterfly", level: 78 }],
    recentAchievement: "Silver Badge - Endurance", lastEvaluation: "Nov 22, 2024",
  },
  {
    name: "Sophie Miller", avatar: "SM", overallProgress: 78, trend: "up",
    skills: [{ name: "Freestyle", level: 80 }, { name: "Backstroke", level: 75 }, { name: "Breaststroke", level: 78 }, { name: "Butterfly", level: 72 }],
    recentAchievement: "Bronze Badge - Technique", lastEvaluation: "Nov 20, 2024",
  },
  {
    name: "Lucas Brown", avatar: "LB", overallProgress: 65, trend: "down",
    skills: [{ name: "Freestyle", level: 70 }, { name: "Backstroke", level: 62 }, { name: "Breaststroke", level: 65 }, { name: "Butterfly", level: 58 }],
    recentAchievement: "Participation Badge", lastEvaluation: "Nov 18, 2024",
  },
]

export interface WeekScheduleDay {
  day: string
  date: string
  sessions: { time: string; name: string; students: number; location: string; duration: string }[]
}

export const coachWeekSchedule: WeekScheduleDay[] = [
  { day: "Monday", date: "Nov 25", sessions: [
    { time: "09:00 AM", name: "Junior Swimming", students: 15, location: "Pool A", duration: "1h" },
    { time: "02:00 PM", name: "Advanced Techniques", students: 8, location: "Pool B", duration: "1.5h" },
  ]},
  { day: "Tuesday", date: "Nov 26", sessions: [
    { time: "10:00 AM", name: "Intermediate Class", students: 12, location: "Pool A", duration: "1h" },
    { time: "04:00 PM", name: "Private Lesson", students: 1, location: "Pool B", duration: "45m" },
  ]},
  { day: "Wednesday", date: "Nov 27", sessions: [
    { time: "09:00 AM", name: "Junior Swimming", students: 15, location: "Pool A", duration: "1h" },
    { time: "11:00 AM", name: "Adult Beginners", students: 10, location: "Pool B", duration: "1h" },
  ]},
  { day: "Thursday", date: "Nov 28", sessions: [
    { time: "02:00 PM", name: "Competition Prep", students: 6, location: "Pool A", duration: "2h" },
  ]},
  { day: "Friday", date: "Nov 29", sessions: [
    { time: "09:00 AM", name: "Junior Swimming", students: 15, location: "Pool A", duration: "1h" },
    { time: "11:00 AM", name: "Intermediate Class", students: 12, location: "Pool A", duration: "1.5h" },
    { time: "04:00 PM", name: "Private Lesson", students: 1, location: "Pool B", duration: "45m" },
  ]},
]

// ============================================================================
// CLUB SUB-PAGES DATA
// ============================================================================

export interface ClubMember {
  id: number
  name: string
  avatar: string
  age: number
  sport: string
  coach: string
  membership: string
  status: string
  joined: string
  parent: string
}

export const clubMembers: ClubMember[] = [
  { id: 1, name: "Emma Davis", avatar: "ED", age: 12, sport: "Swimming", coach: "John Smith", membership: "Premium", status: "Active", joined: "Jan 15, 2024", parent: "Robert Davis" },
  { id: 2, name: "Jack Wilson", avatar: "JW", age: 14, sport: "Basketball", coach: "Mike Johnson", membership: "Standard", status: "Active", joined: "Dec 20, 2023", parent: "Sarah Wilson" },
  { id: 3, name: "Sophie Miller", avatar: "SM", age: 10, sport: "Soccer", coach: "Sarah Wilson", membership: "Premium", status: "Active", joined: "Feb 1, 2024", parent: "Tom Miller" },
  { id: 4, name: "Lucas Brown", avatar: "LB", age: 13, sport: "Tennis", coach: "David Lee", membership: "Standard", status: "Inactive", joined: "Nov 5, 2023", parent: "Mike Brown" },
  { id: 5, name: "Olivia Johnson", avatar: "OJ", age: 11, sport: "Swimming", coach: "John Smith", membership: "Premium", status: "Active", joined: "Jan 28, 2024", parent: "Lisa Johnson" },
  { id: 6, name: "Noah Williams", avatar: "NW", age: 9, sport: "Soccer", coach: "Sarah Wilson", membership: "Standard", status: "Active", joined: "Feb 10, 2024", parent: "James Williams" },
]

export interface MemberStat {
  title: string
  value: string
  icon: LucideIcon
  color: string
}

export const clubMemberStats: MemberStat[] = [
  { title: "Total Members", value: "450", icon: Users, color: "from-blue-500 to-blue-600" },
  { title: "Active", value: "420", icon: UserCheck, color: "from-green-500 to-green-600" },
  { title: "New This Month", value: "15", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { title: "Pending Renewal", value: "12", icon: AlertTriangle, color: "from-red-500 to-red-600" },
]

export interface ClubCoach {
  id: number
  name: string
  avatar: string
  sport: string
  students: number
  sessions: number
  rating: number
  status: string
  joined: string
}

export const clubCoaches: ClubCoach[] = [
  { id: 1, name: "John Smith", avatar: "JS", sport: "Swimming", students: 45, sessions: 24, rating: 4.9, status: "Active", joined: "Sep 2022" },
  { id: 2, name: "Mike Johnson", avatar: "MJ", sport: "Basketball", students: 38, sessions: 18, rating: 4.7, status: "Active", joined: "Jan 2023" },
  { id: 3, name: "Sarah Wilson", avatar: "SW", sport: "Soccer", students: 42, sessions: 20, rating: 4.8, status: "Active", joined: "Mar 2023" },
  { id: 4, name: "David Lee", avatar: "DL", sport: "Tennis", students: 25, sessions: 15, rating: 4.6, status: "Active", joined: "Jun 2023" },
  { id: 5, name: "Emily Davis", avatar: "ED", sport: "Swimming", students: 30, sessions: 16, rating: 4.5, status: "On Leave", joined: "Aug 2023" },
]

export interface ClubPaymentStat {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

export const clubPaymentStats: ClubPaymentStat[] = [
  { title: "Total Revenue", value: "$48,500", change: "+12%", icon: DollarSign, color: "from-green-500 to-green-600" },
  { title: "Pending", value: "$3,200", change: "-5%", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { title: "This Month", value: "$12,400", change: "+18%", icon: CreditCard, color: "from-blue-500 to-blue-600" },
  { title: "Overdue", value: "$850", change: "-20%", icon: AlertTriangle, color: "from-red-500 to-red-600" },
]

export interface ClubTransaction {
  id: string
  member: string
  amount: string
  type: string
  status: string
  date: string
}

export const clubTransactions: ClubTransaction[] = [
  { id: "TXN001", member: "Emma Davis", amount: "$150", type: "Monthly Fee", status: "Completed", date: "Today" },
  { id: "TXN002", member: "Jack Wilson", amount: "$85", type: "Session Fee", status: "Completed", date: "Today" },
  { id: "TXN003", member: "Sophie Miller", amount: "$200", type: "Quarterly Fee", status: "Pending", date: "Yesterday" },
  { id: "TXN004", member: "Lucas Brown", amount: "$150", type: "Monthly Fee", status: "Overdue", date: "Nov 25" },
  { id: "TXN005", member: "Olivia Johnson", amount: "$300", type: "Annual Fee", status: "Completed", date: "Nov 24" },
]

export const clubSessionWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const clubSessionTimeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

export interface ClubSessionSchedule {
  id: number
  name: string
  coach: string
  day: number
  time: string
  duration: string
  enrolled: number
  capacity: number
  sport: string
}

export const clubSessions: ClubSessionSchedule[] = [
  { id: 1, name: "Junior Swimming", coach: "John Smith", day: 0, time: "09:00", duration: "1h", enrolled: 15, capacity: 20, sport: "Swimming" },
  { id: 2, name: "Basketball Training", coach: "Mike Johnson", day: 0, time: "10:00", duration: "1.5h", enrolled: 18, capacity: 20, sport: "Basketball" },
  { id: 3, name: "Soccer Practice", coach: "Sarah Wilson", day: 1, time: "09:00", duration: "1h", enrolled: 22, capacity: 25, sport: "Soccer" },
  { id: 4, name: "Tennis Lessons", coach: "David Lee", day: 1, time: "14:00", duration: "1h", enrolled: 8, capacity: 10, sport: "Tennis" },
  { id: 5, name: "Advanced Swimming", coach: "John Smith", day: 2, time: "11:00", duration: "1.5h", enrolled: 12, capacity: 15, sport: "Swimming" },
]

export interface ClubUpcomingSession {
  name: string
  coach: string
  time: string
  enrolled: number
  capacity: number
}

export const clubUpcomingSessions: ClubUpcomingSession[] = [
  { name: "Junior Swimming", coach: "John Smith", time: "Today, 9:00 AM", enrolled: 15, capacity: 20 },
  { name: "Basketball Training", coach: "Mike Johnson", time: "Today, 10:00 AM", enrolled: 18, capacity: 20 },
  { name: "Soccer Practice", coach: "Sarah Wilson", time: "Today, 2:00 PM", enrolled: 22, capacity: 25 },
  { name: "Tennis Lessons", coach: "David Lee", time: "Tomorrow, 2:00 PM", enrolled: 8, capacity: 10 },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // General statuses
    Active: "bg-green-500/20 text-green-600",
    Verified: "bg-green-500/20 text-green-600",
    Completed: "bg-green-500/20 text-green-600",
    completed: "bg-green-500/20 text-green-600",
    confirmed: "bg-green-500/20 text-green-600",
    Confirmed: "bg-green-500/20 text-green-600",
    Pending: "bg-yellow-500/20 text-yellow-600",
    pending: "bg-yellow-500/20 text-yellow-600",
    ongoing: "bg-blue-500/20 text-blue-600",
    upcoming: "bg-yellow-500/20 text-yellow-600",
    "In Progress": "bg-blue-500/20 text-blue-600",
    "in-progress": "bg-blue-500/20 text-blue-600",
    Suspended: "bg-red-500/20 text-red-600",
    overdue: "bg-red-500/20 text-red-600",
    // Facility/Venue statuses
    Available: "bg-green-500/20 text-green-500",
    Occupied: "bg-blue-500/20 text-blue-500",
    Maintenance: "bg-yellow-500/20 text-yellow-600",
    Closed: "bg-red-500/20 text-red-500",
    // Content statuses
    Published: "bg-green-500/20 text-green-500",
    Draft: "bg-yellow-500/20 text-yellow-600",
    Scheduled: "bg-blue-500/20 text-blue-500",
  }
  return statusColors[status] || "bg-gray-500/20 text-gray-600"
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    High: "bg-red-500/20 text-red-600",
    high: "bg-red-500/20 text-red-600",
    Medium: "bg-yellow-500/20 text-yellow-600",
    medium: "bg-yellow-500/20 text-yellow-600",
    Low: "bg-green-500/20 text-green-500",
    low: "bg-green-500/20 text-green-500",
    Normal: "bg-blue-500/20 text-blue-600",
    normal: "bg-blue-500/20 text-blue-600",
  }
  return priorityColors[priority] || "bg-gray-500/20 text-gray-600"
}

/**
 * Get severity color class
 */
export function getSeverityColor(severity: string): string {
  const severityColors: Record<string, string> = {
    Low: "bg-green-500/20 text-green-500",
    low: "bg-green-500/20 text-green-500",
    Moderate: "bg-yellow-500/20 text-yellow-600",
    moderate: "bg-yellow-500/20 text-yellow-600",
    High: "bg-red-500/20 text-red-500",
    high: "bg-red-500/20 text-red-500",
  }
  return severityColors[severity] || "bg-gray-500/20 text-gray-600"
}

// ============================================================================
// ADMIN - EXTENDED DATA FOR SUB-PAGES
// ============================================================================

// Admin Users - Admins List
export const adminAdminUsers = [
  { id: 1, name: "Admin User 1", email: "admin1@icoachie.com", role: "Super Admin", status: "Active", lastLogin: "Today, 10:30 AM", avatar: "A1" },
  { id: 2, name: "Admin User 2", email: "admin2@icoachie.com", role: "Admin", status: "Active", lastLogin: "Today, 9:15 AM", avatar: "A2" },
  { id: 3, name: "Support Admin", email: "support@icoachie.com", role: "Support Admin", status: "Active", lastLogin: "Yesterday", avatar: "SA" },
  { id: 4, name: "Finance Admin", email: "finance@icoachie.com", role: "Finance Admin", status: "Active", lastLogin: "2 days ago", avatar: "FA" },
]

// Admin Users - Pending Approvals
export const adminPendingUsers = [
  { id: 1, name: "New Coach", email: "newcoach@email.com", role: "Coach", requestDate: "Feb 15, 2024", documents: 3, avatar: "NC" },
  { id: 2, name: "Sports Club", email: "sportsclub@email.com", role: "Club Admin", requestDate: "Feb 14, 2024", documents: 5, avatar: "SC" },
  { id: 3, name: "Freelance Trainer", email: "trainer@email.com", role: "Freelancer", requestDate: "Feb 13, 2024", documents: 2, avatar: "FT" },
  { id: 4, name: "New Parent", email: "parent@email.com", role: "Parent", requestDate: "Feb 12, 2024", documents: 1, avatar: "NP" },
]

// Admin Roles - Permissions
export const adminPermissions = [
  { id: 1, name: "User Management", description: "Create, edit, and delete users", roles: ["Super Admin", "Admin"] },
  { id: 2, name: "Club Management", description: "Manage clubs and approvals", roles: ["Super Admin", "Admin", "Club Admin"] },
  { id: 3, name: "Financial Access", description: "View and manage payments", roles: ["Super Admin", "Finance Admin"] },
  { id: 4, name: "Content Management", description: "Manage platform content", roles: ["Super Admin", "Content Manager"] },
  { id: 5, name: "Support Tickets", description: "Handle support requests", roles: ["Super Admin", "Support Admin"] },
  { id: 6, name: "Analytics View", description: "Access analytics dashboard", roles: ["Super Admin", "Admin"] },
  { id: 7, name: "Reports Generation", description: "Generate and export reports", roles: ["Super Admin", "Admin", "Finance Admin"] },
  { id: 8, name: "System Settings", description: "Configure system settings", roles: ["Super Admin"] },
]

// Admin Clubs - Pending Clubs
export const adminPendingClubs = [
  { id: 1, name: "New Sports Academy", location: "Miami, FL", owner: "John Doe", submittedDate: "Feb 15, 2024", documents: 4, logo: "NS" },
  { id: 2, name: "Youth Football Club", location: "Dallas, TX", owner: "Jane Smith", submittedDate: "Feb 14, 2024", documents: 3, logo: "YF" },
  { id: 3, name: "Tennis Pro Academy", location: "Seattle, WA", owner: "Mike Wilson", submittedDate: "Feb 13, 2024", documents: 5, logo: "TP" },
]

// Admin Clubs - Analytics
export const adminClubAnalytics = {
  totalClubs: 284,
  activeClubs: 256,
  newThisMonth: 12,
  churnRate: "2.3%",
  topRegions: [
    { region: "California", clubs: 45, growth: "+15%" },
    { region: "New York", clubs: 38, growth: "+12%" },
    { region: "Texas", clubs: 32, growth: "+18%" },
    { region: "Florida", clubs: 28, growth: "+8%" },
  ],
  revenueByPlan: [
    { plan: "Premium", revenue: "$85,000", clubs: 120 },
    { plan: "Standard", revenue: "$32,000", clubs: 98 },
    { plan: "Basic", revenue: "$11,450", clubs: 66 },
  ],
}

// Admin Coaches
export const adminCoaches = [
  { id: 1, name: "Coach Smith", email: "smith@email.com", specialty: "Football", rating: 4.8, students: 45, status: "Verified", avatar: "CS" },
  { id: 2, name: "Coach Johnson", email: "johnson@email.com", specialty: "Basketball", rating: 4.6, students: 32, status: "Verified", avatar: "CJ" },
  { id: 3, name: "Coach Williams", email: "williams@email.com", specialty: "Tennis", rating: 4.9, students: 28, status: "Verified", avatar: "CW" },
  { id: 4, name: "Coach Brown", email: "brown@email.com", specialty: "Swimming", rating: 4.7, students: 38, status: "Pending", avatar: "CB" },
  { id: 5, name: "Coach Davis", email: "davis@email.com", specialty: "Soccer", rating: 4.5, students: 52, status: "Verified", avatar: "CD" },
]

// Admin Coaches - Verifications
export const adminCoachVerifications = [
  { id: 1, name: "New Coach 1", email: "new1@email.com", specialty: "Football", submittedDate: "Feb 15, 2024", documents: ["ID", "Certification", "Background Check"], avatar: "N1" },
  { id: 2, name: "New Coach 2", email: "new2@email.com", specialty: "Basketball", submittedDate: "Feb 14, 2024", documents: ["ID", "Certification"], avatar: "N2" },
  { id: 3, name: "New Coach 3", email: "new3@email.com", specialty: "Tennis", submittedDate: "Feb 13, 2024", documents: ["ID", "Certification", "References"], avatar: "N3" },
]

// Admin Freelancers
export const adminFreelancers = [
  { id: 1, name: "Freelance Coach 1", email: "free1@email.com", specialty: "Personal Training", rating: 4.8, bookings: 45, earnings: "$3,200", status: "Active", avatar: "F1" },
  { id: 2, name: "Freelance Coach 2", email: "free2@email.com", specialty: "Yoga", rating: 4.6, bookings: 38, earnings: "$2,800", status: "Active", avatar: "F2" },
  { id: 3, name: "Freelance Coach 3", email: "free3@email.com", specialty: "Swimming", rating: 4.9, bookings: 52, earnings: "$4,100", status: "Active", avatar: "F3" },
  { id: 4, name: "Freelance Coach 4", email: "free4@email.com", specialty: "Tennis", rating: 4.4, bookings: 28, earnings: "$2,100", status: "Pending", avatar: "F4" },
]

// Admin Families (Parents & Kids)
export const adminFamilies = [
  { id: 1, parentName: "Parent Smith", email: "smith@email.com", kids: 2, activeSessions: 4, totalSpent: "$1,200", joined: "Jan 2024", avatar: "PS" },
  { id: 2, parentName: "Parent Johnson", email: "johnson@email.com", kids: 1, activeSessions: 2, totalSpent: "$800", joined: "Dec 2023", avatar: "PJ" },
  { id: 3, parentName: "Parent Williams", email: "williams@email.com", kids: 3, activeSessions: 5, totalSpent: "$2,100", joined: "Nov 2023", avatar: "PW" },
  { id: 4, parentName: "Parent Brown", email: "brown@email.com", kids: 1, activeSessions: 3, totalSpent: "$950", joined: "Jan 2024", avatar: "PB" },
]

// Admin Payments - Transactions
export const adminTransactions = [
  { id: "TXN-001", user: "Champions FC", amount: "$450", type: "Subscription", status: "Completed", date: "Feb 15, 2024" },
  { id: "TXN-002", user: "Sarah Wilson", amount: "$120", type: "Session Booking", status: "Completed", date: "Feb 15, 2024" },
  { id: "TXN-003", user: "Elite Academy", amount: "$890", type: "Subscription", status: "Pending", date: "Feb 14, 2024" },
  { id: "TXN-004", user: "John Smith", amount: "$75", type: "Session Booking", status: "Refunded", date: "Feb 14, 2024" },
  { id: "TXN-005", user: "Victory Athletics", amount: "$450", type: "Subscription", status: "Completed", date: "Feb 13, 2024" },
]

// Admin Payments - Subscriptions
export const adminSubscriptions = [
  { id: 1, club: "Champions FC", plan: "Premium", amount: "$450/mo", startDate: "Jan 1, 2024", status: "Active", nextBilling: "Mar 1, 2024" },
  { id: 2, club: "Elite Academy", plan: "Premium", amount: "$450/mo", startDate: "Dec 15, 2023", status: "Active", nextBilling: "Mar 15, 2024" },
  { id: 3, club: "Victory Athletics", plan: "Standard", amount: "$250/mo", startDate: "Feb 1, 2024", status: "Active", nextBilling: "Mar 1, 2024" },
  { id: 4, club: "Rising Stars", plan: "Basic", amount: "$99/mo", startDate: "Jan 20, 2024", status: "Cancelled", nextBilling: "-" },
]

// Admin Payments - Refunds
export const adminRefunds = [
  { id: "REF-001", user: "John Smith", originalAmount: "$75", refundAmount: "$75", reason: "Session cancelled", status: "Processed", date: "Feb 15, 2024" },
  { id: "REF-002", user: "Sarah Wilson", originalAmount: "$120", refundAmount: "$60", reason: "Partial refund", status: "Pending", date: "Feb 14, 2024" },
  { id: "REF-003", user: "Mike Johnson", originalAmount: "$200", refundAmount: "$200", reason: "Service issue", status: "Under Review", date: "Feb 13, 2024" },
]

// Admin Analytics
export const adminAnalyticsData = {
  userGrowth: [
    { month: "Sep", users: 8500 },
    { month: "Oct", users: 9200 },
    { month: "Nov", users: 10100 },
    { month: "Dec", users: 11200 },
    { month: "Jan", users: 12000 },
    { month: "Feb", users: 12847 },
  ],
  revenueBreakdown: [
    { category: "Subscriptions", amount: "$85,000", percentage: 66 },
    { category: "Session Bookings", amount: "$32,000", percentage: 25 },
    { category: "Other", amount: "$11,450", percentage: 9 },
  ],
  topMetrics: [
    { label: "Active Sessions", value: "2,456", change: "+12%" },
    { label: "Avg. Session Duration", value: "45 min", change: "+5%" },
    { label: "User Retention", value: "87%", change: "+3%" },
    { label: "NPS Score", value: "72", change: "+8" },
  ],
}

// Admin Reports
export const adminReports = [
  { id: 1, name: "Monthly Revenue Report", type: "Financial", lastGenerated: "Feb 1, 2024", frequency: "Monthly" },
  { id: 2, name: "User Growth Report", type: "Analytics", lastGenerated: "Feb 15, 2024", frequency: "Weekly" },
  { id: 3, name: "Club Performance Report", type: "Performance", lastGenerated: "Feb 10, 2024", frequency: "Monthly" },
  { id: 4, name: "Coach Activity Report", type: "Activity", lastGenerated: "Feb 14, 2024", frequency: "Weekly" },
  { id: 5, name: "Payment Summary Report", type: "Financial", lastGenerated: "Feb 15, 2024", frequency: "Daily" },
]

// Admin Notifications
export const adminNotifications = [
  { id: 1, title: "New Club Registration", message: "Champions FC submitted registration", type: "info", time: "2 min ago", read: false },
  { id: 2, title: "Payment Failed", message: "Subscription payment failed for Elite Academy", type: "error", time: "15 min ago", read: false },
  { id: 3, title: "Coach Verification", message: "New coach verification pending review", type: "warning", time: "1 hour ago", read: true },
  { id: 4, title: "System Update", message: "Scheduled maintenance tonight at 2 AM", type: "info", time: "2 hours ago", read: true },
  { id: 5, title: "Refund Request", message: "New refund request from John Smith", type: "warning", time: "3 hours ago", read: false },
]

// Admin Settings - Email Templates
export const adminEmailTemplates = [
  { id: 1, name: "Welcome Email", subject: "Welcome to iCoachie!", lastModified: "Jan 15, 2024", status: "Active" },
  { id: 2, name: "Password Reset", subject: "Reset Your Password", lastModified: "Jan 10, 2024", status: "Active" },
  { id: 3, name: "Session Reminder", subject: "Your Session is Coming Up", lastModified: "Feb 1, 2024", status: "Active" },
  { id: 4, name: "Payment Confirmation", subject: "Payment Received", lastModified: "Jan 20, 2024", status: "Active" },
  { id: 5, name: "Club Approval", subject: "Your Club Has Been Approved", lastModified: "Feb 5, 2024", status: "Active" },
]

// Admin Settings - Integrations
export const adminIntegrations = [
  { id: 1, name: "Stripe", description: "Payment processing", status: "Connected", icon: "stripe" },
  { id: 2, name: "Google Calendar", description: "Calendar sync", status: "Connected", icon: "google" },
  { id: 3, name: "Zoom", description: "Video conferencing", status: "Connected", icon: "zoom" },
  { id: 4, name: "Mailchimp", description: "Email marketing", status: "Not Connected", icon: "mailchimp" },
  { id: 5, name: "Slack", description: "Team notifications", status: "Not Connected", icon: "slack" },
]

// Admin Database
export const adminDatabaseStats = {
  totalSize: "2.4 GB",
  tablesCount: 45,
  lastBackup: "Feb 15, 2024, 3:00 AM",
  backupFrequency: "Daily",
  tables: [
    { name: "users", rows: "12,847", size: "450 MB" },
    { name: "sessions", rows: "45,230", size: "380 MB" },
    { name: "bookings", rows: "28,450", size: "320 MB" },
    { name: "payments", rows: "15,890", size: "280 MB" },
    { name: "clubs", rows: "284", size: "120 MB" },
  ],
}

// Admin Help
export const adminHelpTopics = [
  { id: 1, title: "Getting Started", articles: 12, icon: "book" },
  { id: 2, title: "User Management", articles: 8, icon: "users" },
  { id: 3, title: "Payment Setup", articles: 6, icon: "credit-card" },
  { id: 4, title: "Club Management", articles: 10, icon: "building" },
  { id: 5, title: "Reports & Analytics", articles: 5, icon: "chart" },
  { id: 6, title: "Troubleshooting", articles: 15, icon: "help" },
]

// ============================================================================
// MOCK LOGGED-IN USER DATA (for all roles)
// ============================================================================

export interface MockUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  roleLabel: string
  organization?: string
}

// Role-based mock users - use these in headers/sidebars instead of hardcoded values
export const mockUsers: Record<string, MockUser> = {
  admin: {
    id: "admin-001",
    name: "Super Admin",
    email: "admin@icoachie.com",
    avatar: "SA",
    role: "admin",
    roleLabel: "Super Admin",
  },
  clubAdmin: {
    id: "club-admin-001",
    name: "Champions FC",
    email: "admin@championsfc.com",
    avatar: "CF",
    role: "club_admin",
    roleLabel: "Club Admin",
    organization: "Champions FC",
  },
  coach: {
    id: "coach-001",
    name: "John Smith",
    email: "john.smith@email.com",
    avatar: "JS",
    role: "coach",
    roleLabel: "Head Coach",
    organization: "Champions FC",
  },
  freelancer: {
    id: "freelancer-001",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    avatar: "MJ",
    role: "freelancer",
    roleLabel: "Freelancer Coach",
  },
  parent: {
    id: "parent-001",
    name: "Sarah Wilson",
    email: "sarah.w@email.com",
    avatar: "SW",
    role: "parent",
    roleLabel: "Parent",
  },
  student: {
    id: "student-001",
    name: "Emma Davis",
    email: "emma.d@email.com",
    avatar: "ED",
    role: "student",
    roleLabel: "Student",
  },
  accountant: {
    id: "accountant-001",
    name: "David Chen",
    email: "david.chen@email.com",
    avatar: "DC",
    role: "accountant",
    roleLabel: "Accountant",
    organization: "Champions FC",
  },
  frontDesk: {
    id: "front-desk-001",
    name: "Lisa Brown",
    email: "lisa.brown@email.com",
    avatar: "LB",
    role: "front_desk",
    roleLabel: "Front Desk",
    organization: "Champions FC",
  },
  maintenance: {
    id: "maintenance-001",
    name: "Tom Wilson",
    email: "tom.w@email.com",
    avatar: "TW",
    role: "maintenance",
    roleLabel: "Maintenance Tech",
    organization: "Champions FC",
  },
  groundskeeper: {
    id: "groundskeeper-001",
    name: "Gary Fields",
    email: "gary.f@email.com",
    avatar: "GF",
    role: "groundskeeper",
    roleLabel: "Groundskeeper",
    organization: "Champions FC",
  },
  security: {
    id: "security-001",
    name: "Mark Stone",
    email: "mark.s@email.com",
    avatar: "MS",
    role: "security",
    roleLabel: "Security Staff",
    organization: "Champions FC",
  },
  medical: {
    id: "medical-001",
    name: "Dr. Emily Chen",
    email: "emily.chen@email.com",
    avatar: "EC",
    role: "medical",
    roleLabel: "Medical Staff",
    organization: "Champions FC",
  },
  bookingsCoordinator: {
    id: "bookings-001",
    name: "Anna Roberts",
    email: "anna.r@email.com",
    avatar: "AR",
    role: "bookings_coordinator",
    roleLabel: "Bookings Coordinator",
    organization: "Reservations Team",
  },
  contentManager: {
    id: "content-001",
    name: "Chris Martin",
    email: "chris.m@email.com",
    avatar: "CM",
    role: "content_manager",
    roleLabel: "Content Manager",
    organization: "Champions FC",
  },
}

// Helper to get mock user by role
export function getMockUser(role: string): MockUser {
  return mockUsers[role] || mockUsers.coach
}

// ============================================================================
// MOCK NOTIFICATIONS DATA
// ============================================================================

export interface MockNotification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  time: string
  read: boolean
  actionUrl?: string
}

export const mockNotifications: MockNotification[] = [
  {
    id: "notif-1",
    title: "New Registration",
    message: "Emma Wilson joined the Junior Soccer program",
    type: "success",
    time: "2 min ago",
    read: false,
    actionUrl: "/coach/students",
  },
  {
    id: "notif-2",
    title: "Payment Received",
    message: "$150 from Michael Brown for monthly subscription",
    type: "success",
    time: "15 min ago",
    read: false,
  },
  {
    id: "notif-3",
    title: "Session Reminder",
    message: "Basketball training starts in 30 minutes",
    type: "info",
    time: "30 min ago",
    read: false,
  },
  {
    id: "notif-4",
    title: "Booking Confirmed",
    message: "Main Court reserved for tomorrow 9:00 AM",
    type: "success",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "notif-5",
    title: "Weather Alert",
    message: "Rain expected tomorrow - consider indoor backup",
    type: "warning",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "notif-6",
    title: "Maintenance Required",
    message: "Equipment inspection due for Pool Area",
    type: "warning",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "notif-7",
    title: "Payment Failed",
    message: "Subscription payment failed for Elite Academy",
    type: "error",
    time: "4 hours ago",
    read: false,
  },
  {
    id: "notif-8",
    title: "New Message",
    message: "Coach Williams sent you a message",
    type: "info",
    time: "5 hours ago",
    read: true,
    actionUrl: "/messaging",
  },
]

// ============================================================================
// MOCK MESSAGING/CONVERSATIONS DATA
// ============================================================================

export interface MockConversation {
  id: string
  participantName: string
  participantAvatar: string
  participantRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

export interface MockMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  isOwn: boolean
  status: "sent" | "delivered" | "read"
}

export const mockConversations: MockConversation[] = [
  {
    id: "conv-1",
    participantName: "Coach Williams",
    participantAvatar: "CW",
    participantRole: "Head Coach",
    lastMessage: "The training schedule has been updated for next week",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "conv-2",
    participantName: "Sarah Wilson",
    participantAvatar: "SW",
    participantRole: "Parent",
    lastMessage: "Thank you for the update on Emma's progress!",
    lastMessageTime: "15 min ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "conv-3",
    participantName: "Champions FC Admin",
    participantAvatar: "CF",
    participantRole: "Club Admin",
    lastMessage: "Please review the new facility booking guidelines",
    lastMessageTime: "1 hour ago",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "conv-4",
    participantName: "Mike Johnson",
    participantAvatar: "MJ",
    participantRole: "Freelancer",
    lastMessage: "I'm available for the Saturday session",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "conv-5",
    participantName: "Dr. Emily Chen",
    participantAvatar: "EC",
    participantRole: "Medical Staff",
    lastMessage: "Player clearance forms are ready for review",
    lastMessageTime: "3 hours ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "conv-6",
    participantName: "Support Team",
    participantAvatar: "ST",
    participantRole: "iCoachie Support",
    lastMessage: "Your ticket has been resolved. Let us know if you need anything else!",
    lastMessageTime: "1 day ago",
    unreadCount: 0,
    isOnline: true,
  },
]

export const mockMessages: Record<string, MockMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      senderId: "coach-williams",
      senderName: "Coach Williams",
      senderAvatar: "CW",
      content: "Hi! I wanted to discuss the training schedule for next week.",
      timestamp: "10:30 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: "msg-2",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "JS",
      content: "Sure, what changes are you thinking about?",
      timestamp: "10:32 AM",
      isOwn: true,
      status: "read",
    },
    {
      id: "msg-3",
      senderId: "coach-williams",
      senderName: "Coach Williams",
      senderAvatar: "CW",
      content: "I think we should add an extra practice session on Thursday for the upcoming tournament.",
      timestamp: "10:35 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: "msg-4",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "JS",
      content: "That sounds good. I'll check the facility availability.",
      timestamp: "10:38 AM",
      isOwn: true,
      status: "read",
    },
    {
      id: "msg-5",
      senderId: "coach-williams",
      senderName: "Coach Williams",
      senderAvatar: "CW",
      content: "The training schedule has been updated for next week",
      timestamp: "Just now",
      isOwn: false,
      status: "delivered",
    },
  ],
  "conv-2": [
    {
      id: "msg-6",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "JS",
      content: "Hi Sarah! Emma has been doing great in practice lately.",
      timestamp: "Yesterday",
      isOwn: true,
      status: "read",
    },
    {
      id: "msg-7",
      senderId: "sarah-wilson",
      senderName: "Sarah Wilson",
      senderAvatar: "SW",
      content: "That's wonderful to hear! She's been really excited about the sessions.",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
    {
      id: "msg-8",
      senderId: "sarah-wilson",
      senderName: "Sarah Wilson",
      senderAvatar: "SW",
      content: "Thank you for the update on Emma's progress!",
      timestamp: "15 min ago",
      isOwn: false,
      status: "read",
    },
  ],
}

// Helper to get unread notification count
export function getUnreadNotificationCount(): number {
  return mockNotifications.filter(n => !n.read).length
}

// Helper to get unread message count
export function getUnreadMessageCount(): number {
  return mockConversations.reduce((acc, conv) => acc + conv.unreadCount, 0)
}
