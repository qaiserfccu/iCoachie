import { apiClient } from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'CLUB_ADMIN' | 'COACH' | 'FREELANCER' | 'PARENT'
  clubId?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'coach' | 'student'
  clubId?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken'
  private readonly USER_KEY = 'userData'

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)

      // Store token and user data
      this.setToken(response.token)
      this.setUser(response.user)

      return response
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.')
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Combine firstName and lastName into name for backend compatibility
      const registerPayload = {
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role.toUpperCase(), // Backend expects uppercase roles
        clubId: userData.clubId
      };

      const response = await apiClient.post<AuthResponse>('/auth/register', registerPayload)

      // Store token and user data
      this.setToken(response.token)
      this.setUser(response.user)

      return response
    } catch (error) {
      throw new Error('Registration failed. Please try again.')
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('API logout failed, proceeding with local logout')
    } finally {
      // Clear local storage
      this.clearAuthData()
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin')
  }

  // Check if user is coach
  isCoach(): boolean {
    return this.hasRole('coach')
  }

  // Check if user is student
  isStudent(): boolean {
    return this.hasRole('student')
  }

  // Refresh token (if implemented on backend)
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh')
      this.setToken(response.token)
      return response.token
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearAuthData()
      return null
    }
  }

  // Private methods for token/user management
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService