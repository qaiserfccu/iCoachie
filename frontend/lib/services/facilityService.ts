import { apiClient } from '../api'

// =============================================================================
// Types
// =============================================================================

export interface PageInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pageInfo: PageInfo
  filtersApplied: Record<string, any>
}

export interface Manager {
  id: number
  name: string
  email: string
}

export interface Facility {
  id: number
  name: string
  location?: string
  address?: string
  description?: string
  amenities: string[]
  clubId: number
  managerId?: number
  manager?: Manager
  venueCount?: number
  groundCount?: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface CreateFacilityData {
  name: string
  location?: string
  address?: string
  description?: string
  amenities?: string[]
  managerId?: number
}

export interface UpdateFacilityData {
  name?: string
  location?: string
  address?: string
  description?: string
  amenities?: string[]
}

export interface Venue {
  id: number
  name: string
  type: string
  venueType: string
  capacity?: number
  hourlyRate?: number
  isAvailable: boolean
  amenities: string[]
  facilityId: number
  managerId?: number
  manager?: Manager
  facility?: { id: number; name: string; clubId: number }
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface CreateVenueData {
  name: string
  type: string
  capacity?: number
  hourlyRate?: number
  isAvailable?: boolean
  amenities?: string[]
  managerId?: number
}

export interface UpdateVenueData {
  name?: string
  type?: string
  capacity?: number
  hourlyRate?: number
  isAvailable?: boolean
  amenities?: string[]
}

export interface Ground {
  id: number
  name: string
  type: string
  groundType: string
  surface?: string
  surfaceType?: string
  dimensions?: string
  capacity?: number
  isAvailable: boolean
  facilityId: number
  managerId?: number
  manager?: Manager
  facility?: { id: number; name: string; clubId: number }
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface CreateGroundData {
  name: string
  type: string
  surface?: string
  dimensions?: string
  capacity?: number
  isAvailable?: boolean
  managerId?: number
}

export interface UpdateGroundData {
  name?: string
  type?: string
  surface?: string
  dimensions?: string
  capacity?: number
  isAvailable?: boolean
}

export interface Schedule {
  id: number
  dayOfWeek?: number
  specificDate?: string
  startTime: string
  endTime: string
  isRecurring: boolean
  isBlackout: boolean
  notes?: string
  createdBy: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface CreateScheduleData {
  dayOfWeek?: number
  specificDate?: string
  startTime: string
  endTime: string
  isRecurring?: boolean
  isBlackout?: boolean
  notes?: string
}

export interface UpdateScheduleData {
  dayOfWeek?: number
  specificDate?: string
  startTime?: string
  endTime?: string
  isRecurring?: boolean
  isBlackout?: boolean
  notes?: string
}

export interface StaffMember {
  id: number
  name: string
  email: string
  primaryRole?: { code: string; name: string }
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  includeDeleted?: boolean
}

export interface VenueListParams extends ListParams {
  available?: boolean
}

export interface GroundListParams extends ListParams {
  available?: boolean
}

export interface ScheduleListParams {
  includeDeleted?: boolean
  blackouts?: boolean
  dayOfWeek?: number
}

// =============================================================================
// Dashboard Stats Types (for display purposes)
// =============================================================================

export interface FacilityDashboardStats {
  totalVenues: number
  totalGrounds: number
  availableVenues: number
  availableGrounds: number
  totalBookings: number
  maintenanceRequests: number
  utilizationPercent: number
}

export interface VenueDashboardStats {
  totalVenues: number
  eventsToday: number
  capacityUsedPercent: number
  revenueToday: number
}

export interface GroundDashboardStats {
  totalGrounds: number
  averageCondition: string
  tasksToday: number
  irrigationStatus: string
}

export interface MaintenanceDashboardStats {
  openWorkOrders: number
  completedToday: number
  equipmentIssues: number
  scheduledTasks: number
}

export interface GroundskeeperDashboardStats {
  tasksToday: number
  tasksCompleted: number
  fieldsStatus: string
  irrigationZones: number
  weatherAlert: string
}

// Ground update payload type
interface UpdateGroundPayload {
  name?: string
  groundType?: string
  surfaceType?: string
  dimensions?: string
  capacity?: number
  isAvailable?: boolean
}

// =============================================================================
// Constants
// =============================================================================

// Default configuration for dashboard stats estimation
const DASHBOARD_STATS_CONFIG = {
  // Estimated percentage of venues/grounds that are available when real data not available
  DEFAULT_AVAILABILITY_RATIO: 0.8,
  // Maximum facilities to load per dashboard request
  MAX_FACILITIES_PER_REQUEST: 100,
  // Maximum facilities to iterate for venues/grounds loading in dashboard
  MAX_FACILITIES_TO_LOAD: 3,
  // Default page size for list requests
  DEFAULT_PAGE_SIZE: 5
}

// Placeholder values for stats that will be replaced by real API calls
const PLACEHOLDER_STATS = {
  totalBookings: 24,
  maintenanceRequests: 3,
  utilizationPercent: 78,
  eventsToday: 5,
  capacityUsedPercent: 72,
  revenueToday: 4200,
  tasksToday: 8,
  tasksCompleted: 5,
  fieldsStatus: 'Good',
  irrigationZones: 6,
  weatherAlert: 'Clear',
  averageCondition: 'Good',
  irrigationStatus: 'Active',
  openWorkOrders: 12,
  completedToday: 5,
  equipmentIssues: 4,
  scheduledTasks: 8
}

// =============================================================================
// Service Class
// =============================================================================

class FacilityService {
  private readonly baseUrl = '/facilities'

  // =============================================================================
  // Facilities
  // =============================================================================

  async getFacilities(params: ListParams = {}): Promise<PaginatedResponse<Facility>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', String(params.page))
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize))
    if (params.search) queryParams.append('search', params.search)
    if (params.includeDeleted) queryParams.append('includeDeleted', 'true')
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl
    return apiClient.get<PaginatedResponse<Facility>>(url)
  }

  async getFacility(id: number): Promise<Facility> {
    return apiClient.get<Facility>(`${this.baseUrl}/${id}`)
  }

  async createFacility(data: CreateFacilityData): Promise<Facility> {
    return apiClient.post<Facility>(this.baseUrl, data)
  }

  async updateFacility(id: number, data: UpdateFacilityData): Promise<Facility> {
    return apiClient.put<Facility>(`${this.baseUrl}/${id}`, data)
  }

  async deleteFacility(id: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  async restoreFacility(id: number): Promise<Facility> {
    return apiClient.post<Facility>(`${this.baseUrl}/${id}/restore`)
  }

  // Facility Manager Assignment
  async assignFacilityManager(facilityId: number, managerId: number | null): Promise<Facility> {
    return apiClient.put<Facility>(`${this.baseUrl}/${facilityId}/manager`, { managerId })
  }

  // Facility Staff Management
  async getFacilityStaff(facilityId: number): Promise<{ data: StaffMember[] }> {
    return apiClient.get(`${this.baseUrl}/${facilityId}/staff`)
  }

  async addFacilityStaff(facilityId: number, userId: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.post(`${this.baseUrl}/${facilityId}/staff`, { userId })
  }

  async removeFacilityStaff(facilityId: number, userId: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/${facilityId}/staff/${userId}`)
  }

  // =============================================================================
  // Venues
  // =============================================================================

  async getVenues(facilityId: number, params: VenueListParams = {}): Promise<PaginatedResponse<Venue>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', String(params.page))
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize))
    if (params.search) queryParams.append('search', params.search)
    if (params.includeDeleted) queryParams.append('includeDeleted', 'true')
    if (params.available) queryParams.append('available', 'true')
    
    const url = queryParams.toString() 
      ? `${this.baseUrl}/${facilityId}/venues?${queryParams}` 
      : `${this.baseUrl}/${facilityId}/venues`
    return apiClient.get<PaginatedResponse<Venue>>(url)
  }

  async getVenue(id: number): Promise<Venue> {
    return apiClient.get<Venue>(`${this.baseUrl}/venues/${id}`)
  }

  async createVenue(facilityId: number, data: CreateVenueData): Promise<Venue> {
    return apiClient.post<Venue>(`${this.baseUrl}/${facilityId}/venues`, { 
      ...data, 
      venueType: data.type 
    })
  }

  async updateVenue(id: number, data: UpdateVenueData): Promise<Venue> {
    const payload = data.type ? { ...data, venueType: data.type } : data
    return apiClient.put<Venue>(`${this.baseUrl}/venues/${id}`, payload)
  }

  async deleteVenue(id: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/venues/${id}`)
  }

  async restoreVenue(id: number): Promise<Venue> {
    return apiClient.post<Venue>(`${this.baseUrl}/venues/${id}/restore`)
  }

  async assignVenueManager(venueId: number, managerId: number | null): Promise<Venue> {
    return apiClient.put<Venue>(`${this.baseUrl}/venues/${venueId}/manager`, { managerId })
  }

  // Venue Schedule
  async getVenueSchedule(venueId: number, params: ScheduleListParams = {}): Promise<{ data: Schedule[] }> {
    const queryParams = new URLSearchParams()
    if (params.includeDeleted) queryParams.append('includeDeleted', 'true')
    if (params.blackouts) queryParams.append('blackouts', 'true')
    if (params.dayOfWeek !== undefined) queryParams.append('dayOfWeek', String(params.dayOfWeek))
    
    const url = queryParams.toString() 
      ? `${this.baseUrl}/venues/${venueId}/schedule?${queryParams}` 
      : `${this.baseUrl}/venues/${venueId}/schedule`
    return apiClient.get(url)
  }

  async createVenueSchedule(venueId: number, data: CreateScheduleData): Promise<Schedule> {
    return apiClient.post<Schedule>(`${this.baseUrl}/venues/${venueId}/schedule`, data)
  }

  async updateVenueSchedule(venueId: number, scheduleId: number, data: UpdateScheduleData): Promise<Schedule> {
    return apiClient.put<Schedule>(`${this.baseUrl}/venues/${venueId}/schedule/${scheduleId}`, data)
  }

  async deleteVenueSchedule(venueId: number, scheduleId: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/venues/${venueId}/schedule/${scheduleId}`)
  }

  // =============================================================================
  // Grounds
  // =============================================================================

  async getGrounds(facilityId: number, params: GroundListParams = {}): Promise<PaginatedResponse<Ground>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', String(params.page))
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize))
    if (params.search) queryParams.append('search', params.search)
    if (params.includeDeleted) queryParams.append('includeDeleted', 'true')
    if (params.available) queryParams.append('available', 'true')
    
    const url = queryParams.toString() 
      ? `${this.baseUrl}/${facilityId}/grounds?${queryParams}` 
      : `${this.baseUrl}/${facilityId}/grounds`
    return apiClient.get<PaginatedResponse<Ground>>(url)
  }

  async getGround(id: number): Promise<Ground> {
    return apiClient.get<Ground>(`${this.baseUrl}/grounds/${id}`)
  }

  async createGround(facilityId: number, data: CreateGroundData): Promise<Ground> {
    return apiClient.post<Ground>(`${this.baseUrl}/${facilityId}/grounds`, { 
      ...data, 
      groundType: data.type,
      surfaceType: data.surface
    })
  }

  async updateGround(id: number, data: UpdateGroundData): Promise<Ground> {
    const payload: UpdateGroundPayload = { ...data }
    if (data.type) payload.groundType = data.type
    if (data.surface) payload.surfaceType = data.surface
    return apiClient.put<Ground>(`${this.baseUrl}/grounds/${id}`, payload)
  }

  async deleteGround(id: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/grounds/${id}`)
  }

  async restoreGround(id: number): Promise<Ground> {
    return apiClient.post<Ground>(`${this.baseUrl}/grounds/${id}/restore`)
  }

  async assignGroundManager(groundId: number, managerId: number | null): Promise<Ground> {
    return apiClient.put<Ground>(`${this.baseUrl}/grounds/${groundId}/manager`, { managerId })
  }

  // Ground Schedule
  async getGroundSchedule(groundId: number, params: ScheduleListParams = {}): Promise<{ data: Schedule[] }> {
    const queryParams = new URLSearchParams()
    if (params.includeDeleted) queryParams.append('includeDeleted', 'true')
    if (params.blackouts) queryParams.append('blackouts', 'true')
    if (params.dayOfWeek !== undefined) queryParams.append('dayOfWeek', String(params.dayOfWeek))
    
    const url = queryParams.toString() 
      ? `${this.baseUrl}/grounds/${groundId}/schedule?${queryParams}` 
      : `${this.baseUrl}/grounds/${groundId}/schedule`
    return apiClient.get(url)
  }

  async createGroundSchedule(groundId: number, data: CreateScheduleData): Promise<Schedule> {
    return apiClient.post<Schedule>(`${this.baseUrl}/grounds/${groundId}/schedule`, data)
  }

  async updateGroundSchedule(groundId: number, scheduleId: number, data: UpdateScheduleData): Promise<Schedule> {
    return apiClient.put<Schedule>(`${this.baseUrl}/grounds/${groundId}/schedule/${scheduleId}`, data)
  }

  async deleteGroundSchedule(groundId: number, scheduleId: number): Promise<{ ok: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/grounds/${groundId}/schedule/${scheduleId}`)
  }

  // =============================================================================
  // Dashboard Stats Methods
  // These compute stats from the existing data - can be replaced with 
  // dedicated backend endpoints later for better performance
  // =============================================================================

  async getFacilityDashboardStats(): Promise<FacilityDashboardStats> {
    try {
      const facilitiesResponse = await this.getFacilities({ pageSize: DASHBOARD_STATS_CONFIG.MAX_FACILITIES_PER_REQUEST })
      const facilities = facilitiesResponse.data
      
      let totalVenues = 0
      let totalGrounds = 0
      
      // Aggregate venue and ground counts from all facilities
      for (const facility of facilities) {
        totalVenues += facility.venueCount || 0
        totalGrounds += facility.groundCount || 0
      }
      
      // TODO: Replace placeholder values with actual API calls when endpoints are available
      return {
        totalVenues,
        totalGrounds,
        availableVenues: Math.floor(totalVenues * DASHBOARD_STATS_CONFIG.DEFAULT_AVAILABILITY_RATIO),
        availableGrounds: Math.floor(totalGrounds * DASHBOARD_STATS_CONFIG.DEFAULT_AVAILABILITY_RATIO),
        totalBookings: PLACEHOLDER_STATS.totalBookings,
        maintenanceRequests: PLACEHOLDER_STATS.maintenanceRequests,
        utilizationPercent: PLACEHOLDER_STATS.utilizationPercent
      }
    } catch {
      // Return default stats on error
      return {
        totalVenues: 0,
        totalGrounds: 0,
        availableVenues: 0,
        availableGrounds: 0,
        totalBookings: 0,
        maintenanceRequests: 0,
        utilizationPercent: 0
      }
    }
  }

  async getVenueDashboardStats(): Promise<VenueDashboardStats> {
    try {
      const facilitiesResponse = await this.getFacilities({ pageSize: DASHBOARD_STATS_CONFIG.MAX_FACILITIES_PER_REQUEST })
      let totalVenues = 0
      
      for (const facility of facilitiesResponse.data) {
        totalVenues += facility.venueCount || 0
      }
      
      // TODO: Replace placeholder values with actual API calls when endpoints are available
      return {
        totalVenues,
        eventsToday: PLACEHOLDER_STATS.eventsToday,
        capacityUsedPercent: PLACEHOLDER_STATS.capacityUsedPercent,
        revenueToday: PLACEHOLDER_STATS.revenueToday
      }
    } catch {
      return {
        totalVenues: 0,
        eventsToday: 0,
        capacityUsedPercent: 0,
        revenueToday: 0
      }
    }
  }

  async getGroundDashboardStats(): Promise<GroundDashboardStats> {
    try {
      const facilitiesResponse = await this.getFacilities({ pageSize: DASHBOARD_STATS_CONFIG.MAX_FACILITIES_PER_REQUEST })
      let totalGrounds = 0
      
      for (const facility of facilitiesResponse.data) {
        totalGrounds += facility.groundCount || 0
      }
      
      // TODO: Replace placeholder values with actual API calls when endpoints are available
      return {
        totalGrounds,
        averageCondition: PLACEHOLDER_STATS.averageCondition,
        tasksToday: PLACEHOLDER_STATS.tasksToday,
        irrigationStatus: PLACEHOLDER_STATS.irrigationStatus
      }
    } catch {
      return {
        totalGrounds: 0,
        averageCondition: 'Unknown',
        tasksToday: 0,
        irrigationStatus: 'Unknown'
      }
    }
  }

  async getMaintenanceDashboardStats(): Promise<MaintenanceDashboardStats> {
    // TODO: Replace with actual API calls when maintenance/work order endpoints are available
    return {
      openWorkOrders: PLACEHOLDER_STATS.openWorkOrders,
      completedToday: PLACEHOLDER_STATS.completedToday,
      equipmentIssues: PLACEHOLDER_STATS.equipmentIssues,
      scheduledTasks: PLACEHOLDER_STATS.scheduledTasks
    }
  }

  async getGroundskeeperDashboardStats(): Promise<GroundskeeperDashboardStats> {
    // TODO: Replace with actual API calls when groundskeeper-specific endpoints are available
    return {
      tasksToday: PLACEHOLDER_STATS.tasksToday,
      tasksCompleted: PLACEHOLDER_STATS.tasksCompleted,
      fieldsStatus: PLACEHOLDER_STATS.fieldsStatus,
      irrigationZones: PLACEHOLDER_STATS.irrigationZones,
      weatherAlert: PLACEHOLDER_STATS.weatherAlert
    }
  }
}

// Export the config for use in dashboard components
export { DASHBOARD_STATS_CONFIG }

export const facilityService = new FacilityService()
export default facilityService
