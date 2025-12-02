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

export interface PermissionMatrix {
  permission: string
  systemAdmin: boolean
  clubAdmin: boolean
  coach: boolean
  freelancer: boolean
  parent: boolean
  student: boolean
}

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
  students: number
  status: string
  duration: string
  coach?: string
  enrolled?: number
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

// ============================================================================
// FRONT DESK DASHBOARD DATA
// ============================================================================

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
    Active: "bg-green-500/20 text-green-600",
    Verified: "bg-green-500/20 text-green-600",
    Completed: "bg-green-500/20 text-green-600",
    completed: "bg-green-500/20 text-green-600",
    confirmed: "bg-green-500/20 text-green-600",
    Pending: "bg-yellow-500/20 text-yellow-600",
    pending: "bg-yellow-500/20 text-yellow-600",
    ongoing: "bg-blue-500/20 text-blue-600",
    upcoming: "bg-yellow-500/20 text-yellow-600",
    "In Progress": "bg-blue-500/20 text-blue-600",
    "in-progress": "bg-blue-500/20 text-blue-600",
    Suspended: "bg-red-500/20 text-red-600",
    overdue: "bg-red-500/20 text-red-600",
  }
  return statusColors[status] || "bg-gray-500/20 text-gray-600"
}
