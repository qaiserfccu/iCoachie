import { apiClient } from '../api'

// Types
export interface Review {
  id: string
  reviewerId: string
  revieweeId: string
  reviewType: 'coach_review' | 'student_review' | 'session_review' | 'club_review'
  sessionId?: string
  clubId?: string
  rating: number
  title?: string
  content: string
  isAnonymous: boolean
  isPublic: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateReviewData {
  revieweeId: string
  reviewType: 'coach_review' | 'student_review' | 'session_review' | 'club_review'
  sessionId?: string
  clubId?: string
  rating: number
  title?: string
  content: string
  isAnonymous?: boolean
  isPublic?: boolean
}

export interface UpdateReviewData {
  rating?: number
  title?: string
  content?: string
  isAnonymous?: boolean
  isPublic?: boolean
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

class ReviewService {
  private readonly baseUrl = '/reviews'

  // Get all reviews for current tenant
  async getReviews(revieweeId?: string, reviewType?: string): Promise<Review[]> {
    const params: any = {}
    if (revieweeId) params.revieweeId = revieweeId
    if (reviewType) params.reviewType = reviewType
    return apiClient.get<Review[]>(this.baseUrl, { params })
  }

  // Get review by ID
  async getReview(id: string): Promise<Review> {
    return apiClient.get<Review>(`${this.baseUrl}/${id}`)
  }

  // Create new review
  async createReview(data: CreateReviewData): Promise<Review> {
    return apiClient.post<Review>(this.baseUrl, data)
  }

  // Update review
  async updateReview(id: string, data: UpdateReviewData): Promise<Review> {
    return apiClient.put<Review>(`${this.baseUrl}/${id}`, data)
  }

  // Delete review
  async deleteReview(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get reviews for a specific entity (coach, student, session, club)
  async getEntityReviews(entityId: string, reviewType: string): Promise<Review[]> {
    return apiClient.get<Review[]>(`${this.baseUrl}/entity/${entityId}`, {
      params: { type: reviewType }
    })
  }

  // Get reviews by reviewer
  async getReviewerReviews(reviewerId: string): Promise<Review[]> {
    return apiClient.get<Review[]>(`${this.baseUrl}/reviewer/${reviewerId}`)
  }

  // Get public reviews
  async getPublicReviews(reviewType?: string): Promise<Review[]> {
    const params = reviewType ? { type: reviewType } : {}
    return apiClient.get<Review[]>(`${this.baseUrl}/public`, { params })
  }

  // Get review statistics for an entity
  async getReviewStats(entityId: string, reviewType: string): Promise<ReviewStats> {
    return apiClient.get<ReviewStats>(`${this.baseUrl}/entity/${entityId}/stats`, {
      params: { type: reviewType }
    })
  }

  // Report review (for inappropriate content)
  async reportReview(id: string, reason: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/${id}/report`, { reason })
  }

  // Moderate review (admin function)
  async moderateReview(id: string, action: 'approve' | 'reject' | 'hide'): Promise<Review> {
    return apiClient.patch<Review>(`${this.baseUrl}/${id}/moderate`, { action })
  }

  // Get pending reviews (for moderation)
  async getPendingReviews(): Promise<Review[]> {
    return apiClient.get<Review[]>(`${this.baseUrl}/pending`)
  }

  // Like/dislike review
  async toggleReviewLike(id: string): Promise<{ liked: boolean, likeCount: number }> {
    return apiClient.post<{ liked: boolean, likeCount: number }>(`${this.baseUrl}/${id}/like`)
  }
}

export const reviewService = new ReviewService()
export default reviewService