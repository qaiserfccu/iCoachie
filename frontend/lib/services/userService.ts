import { apiClient } from '../api'

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
  profile?: {
    displayName?: string
    bio?: string
    avatarUrl?: string
    phone?: string
  }
  role?: {
    code: string
    name: string
    description?: string
    scope?: string
  }
  roles?: string[] // Legacy support for existing components
}

export interface CreateUserData {
  email: string
  password: string
  name: string
  role: string
  display_name?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
}

export interface Role {
  id: number
  code: string
  name: string
  description?: string
  scope: string
  isActive: boolean
  sortOrder: number
}

class UserService {
  // Get all users in the club
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users')
      return response
    } catch (error) {
      throw new Error('Failed to fetch users')
    }
  }

  // Create a new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.post<User>('/users', userData)
      return response
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Email already exists')
      }
      throw new Error('Failed to create user')
    }
  }

  // Update a user
  async updateUser(userId: number, userData: UpdateUserData): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/users/${userId}`, userData)
      return response
    } catch (error) {
      throw new Error('Failed to update user')
    }
  }

  // Delete a user (soft delete)
  async deleteUser(userId: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}`)
    } catch (error) {
      throw new Error('Failed to delete user')
    }
  }

  // Get available roles
  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get<Role[]>('/users/roles')
      return response
    } catch (error) {
      throw new Error('Failed to fetch roles')
    }
  }

  // Assign role to user
  async assignRole(userId: number, roleName: string): Promise<void> {
    try {
      await apiClient.post('/assign-role', { userId, roleName })
    } catch (error) {
      throw new Error('Failed to assign role')
    }
  }
}

// Export singleton instance
const userService = new UserService()
export default userService