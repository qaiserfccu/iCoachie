import { apiClient } from '../api'
import userService, { User } from './userService'
import { freelancerDashboardService, FreelancerStats } from './freelancerDashboardService'

// Types
export interface FreelancerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  avatarUrl?: string
  rating: number
  totalReviews: number
  experience: number // years
  specialties: string[]
  certifications: string[]
  services: Service[]
  stats: FreelancerStats
}

export interface Service {
  id: string
  name: string
  duration: string
  price: number
  description?: string
}

export interface UpdateProfileData {
  name?: string
  phone?: string
  location?: string
  bio?: string
  specialties?: string[]
}

export interface CreateServiceData {
  name: string
  duration: string
  price: number
  description?: string
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string
}

class FreelancerProfileService {
  // Get freelancer profile data
  async getProfile(): Promise<FreelancerProfile> {
    try {
      // Get user data
      const users = await userService.getUsers()
      const currentUser = users.find(u => u.roles.includes('freelancer'))
      if (!currentUser) {
        throw new Error('Freelancer profile not found')
      }

      // Get freelancer stats
      const stats = await freelancerDashboardService.getFreelancerStats()

      // For now, return mock data for services and certifications
      // In a real implementation, these would come from dedicated endpoints
      const services: Service[] = [
        { id: '1', name: 'Swimming Lesson', duration: '1 hour', price: 75, description: 'Individual swimming instruction' },
        { id: '2', name: 'Private Training', duration: '1.5 hours', price: 100, description: 'Personalized training session' },
        { id: '3', name: 'Trial Session', duration: '45 min', price: 50, description: 'Introductory session' },
        { id: '4', name: 'Group Class', duration: '1 hour', price: 40, description: 'Small group instruction' },
      ]

      const certifications: string[] = [
        'Certified Swimming Instructor',
        'CPR & First Aid Certified',
        'Lifeguard Certification',
        'Youth Sports Coach Certification',
      ]

      const specialties: string[] = [
        'Swimming',
        'Freestyle',
        'Backstroke',
        'Kids Training',
        'Adult Beginners'
      ]

      return {
        id: currentUser.id.toString(),
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.profile?.phone || '+1 234 567 8903',
        location: 'New York, NY', // Would come from profile data
        bio: currentUser.profile?.bio || 'Professional swimming coach with over 3 years of experience. Specialized in teaching kids and adults of all skill levels. Passionate about helping people achieve their swimming goals safely and confidently.',
        avatarUrl: currentUser.profile?.avatarUrl,
        rating: stats.averageRating,
        totalReviews: stats.totalReviews,
        experience: 3, // Would come from profile data
        specialties,
        certifications,
        services,
        stats
      }
    } catch (error) {
      console.error('Error fetching freelancer profile:', error)
      throw error
    }
  }

  // Update freelancer profile
  async updateProfile(profileData: UpdateProfileData): Promise<FreelancerProfile> {
    try {
      // Update user data via userService
      const users = await userService.getUsers()
      const currentUser = users.find(u => u.roles.includes('freelancer'))
      if (!currentUser) {
        throw new Error('Freelancer profile not found')
      }

      await userService.updateUser(currentUser.id, {
        name: profileData.name,
        // email: profileData.email // Email updates might need special handling
      })

      // For profile-specific data, we'd need dedicated endpoints
      // For now, return updated profile
      return this.getProfile()
    } catch (error) {
      console.error('Error updating freelancer profile:', error)
      throw error
    }
  }

  // Add a new service
  async addService(serviceData: CreateServiceData): Promise<Service> {
    try {
      // In a real implementation, this would call a backend endpoint
      // For now, return mock data
      const newService: Service = {
        id: Date.now().toString(),
        ...serviceData
      }
      return newService
    } catch (error) {
      console.error('Error adding service:', error)
      throw error
    }
  }

  // Update a service
  async updateService(serviceData: UpdateServiceData): Promise<Service> {
    try {
      // In a real implementation, this would call a backend endpoint
      // For now, return updated service
      return {
        id: serviceData.id,
        name: serviceData.name || 'Service',
        duration: serviceData.duration || '1 hour',
        price: serviceData.price || 0,
        description: serviceData.description
      }
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  // Delete a service
  async deleteService(serviceId: string): Promise<void> {
    try {
      // In a real implementation, this would call a backend endpoint
      // For now, just simulate success
      console.log(`Service ${serviceId} deleted`)
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  }

  // Add a certification
  async addCertification(certification: string): Promise<string[]> {
    try {
      // In a real implementation, this would call a backend endpoint
      // For now, return mock updated certifications
      const profile = await this.getProfile()
      return [...profile.certifications, certification]
    } catch (error) {
      console.error('Error adding certification:', error)
      throw error
    }
  }

  // Remove a certification
  async removeCertification(certification: string): Promise<string[]> {
    try {
      // In a real implementation, this would call a backend endpoint
      // For now, return mock updated certifications
      const profile = await this.getProfile()
      return profile.certifications.filter(cert => cert !== certification)
    } catch (error) {
      console.error('Error removing certification:', error)
      throw error
    }
  }
}

// Export singleton instance
export const freelancerProfileService = new FreelancerProfileService()
export default freelancerProfileService