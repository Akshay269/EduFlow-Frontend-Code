// EduFlow API Client - connects to Spring Boot REST API

const API_BASE = 'https://d35qzhxh4jwgyd.cloudfront.net';

// ── Response wrapper from backend ──
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Data Models ──
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  profilePictureUrl?: string;
}

export interface AuthData {
  token: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  averageRating: number;
  totalReviews: number;
  thumbnailUrl?: string;
  published: boolean;
  instructorName: string;
  createdAt: string;
}

export interface Review {
  id: number;
  courseId: number;
  studentId: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  enrolledAt: string;
  courseName: string;
  instructorName: string;
  thumbnailUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('eduflow_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // ignore parse error
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  // ────────────────────────────────────────
  // AUTH
  // ────────────────────────────────────────

  // POST /api/auth/login
  async login(email: string, password: string) {
    return this.request<ApiResponse<AuthData>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // POST /api/auth/register
  // role: "STUDENT" | "INSTRUCTOR"
  async register(name: string, email: string, password: string, role: string) {
    return this.request<ApiResponse<AuthData>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  // ────────────────────────────────────────
  // USER PROFILE
  // ────────────────────────────────────────

  // GET /api/users/me 🔐
  async getProfile() {
    return this.request<ApiResponse<User>>('/api/users/me');
  }

  // PUT /api/users/me 🔐
  async updateProfile(data: { name?: string }) {
    return this.request<ApiResponse<User>>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // POST /api/users/me/picture 🔐
  // field name must be "file"
  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<ApiResponse<User>>('/api/users/me/picture', {
      method: 'POST',
      body: formData,
    });
  }

  // ────────────────────────────────────────
  // COURSES
  // ────────────────────────────────────────

  // GET /api/courses 🔓
  // sortBy options: createdAt, price, averageRating
  async getCourses(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(params?.page ?? 0));
    searchParams.set('size', String(params?.size ?? 10));
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    return this.request<ApiResponse<PageResponse<Course>>>(
      `/api/courses?${searchParams.toString()}`
    );
  }

  // GET /api/courses/search 🔓
  // level options: BEGINNER | INTERMEDIATE | ADVANCED
  // category options: Programming | DevOps | Data Science
  async searchCourses(params?: {
    keyword?: string;
    category?: string;
    level?: string;
    page?: number;
    size?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.keyword) searchParams.set('keyword', params.keyword);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.level) searchParams.set('level', params.level);
    searchParams.set('page', String(params?.page ?? 0));
    searchParams.set('size', String(params?.size ?? 10));
    return this.request<ApiResponse<PageResponse<Course>>>(
      `/api/courses/search?${searchParams.toString()}`
    );
  }

  // GET /api/courses/{id} 🔓
  async getCourse(id: number) {
    return this.request<ApiResponse<Course>>(`/api/courses/${id}`);
  }

  // GET /api/courses/my-courses 🔐 (INSTRUCTOR only)
  async getMyCourses() {
    return this.request<ApiResponse<Course[]>>('/api/courses/my-courses');
  }

  // POST /api/courses 🔐 (INSTRUCTOR only)
  async createCourse(data: {
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
  }) {
    return this.request<ApiResponse<Course>>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT /api/courses/{id} 🔐 (INSTRUCTOR only)
  async updateCourse(id: number, data: {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    price?: number;
  }) {
    return this.request<ApiResponse<Course>>(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE /api/courses/{id} 🔐 (INSTRUCTOR only)
  async deleteCourse(id: number) {
    return this.request<ApiResponse<void>>(`/api/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // POST /api/courses/{id}/thumbnail 🔐 (INSTRUCTOR only)
  // field name must be "file"
  async uploadCourseThumbnail(courseId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<ApiResponse<Course>>(
      `/api/courses/${courseId}/thumbnail`,
      { method: 'POST', body: formData }
    );
  }

  // ────────────────────────────────────────
  // ENROLLMENTS
  // ────────────────────────────────────────

  // POST /api/enrollments/course/{courseId} 🔐 (STUDENT only)
  async enroll(courseId: number) {
    return this.request<ApiResponse<Enrollment>>(
      `/api/enrollments/course/${courseId}`,
      { method: 'POST' }
    );
  }

  // GET /api/enrollments/my-enrollments 🔐 (STUDENT only)
  async getMyEnrollments() {
    return this.request<ApiResponse<Enrollment[]>>(
      '/api/enrollments/my-enrollments'
    );
  }

  // GET /api/enrollments/check/{courseId} 🔓
  // returns true/false boolean directly
  async checkEnrollment(courseId: number) {
    return this.request<boolean>(
      `/api/enrollments/check/${courseId}`
    );
  }

  // GET /api/enrollments/course/{courseId}/students 🔐 (INSTRUCTOR only)
  async getCourseStudents(courseId: number) {
    return this.request<ApiResponse<any[]>>(
      `/api/enrollments/course/${courseId}/students`
    );
  }

  // ────────────────────────────────────────
  // REVIEWS
  // ────────────────────────────────────────

  // GET /api/reviews/course/{courseId} 🔓
  async getCourseReviews(courseId: number, page = 0, size = 10) {
    return this.request<ApiResponse<PageResponse<Review>>>(
      `/api/reviews/course/${courseId}?page=${page}&size=${size}`
    );
  }

  // GET /api/reviews/course/{courseId}/my-review 🔐 (STUDENT only)
  async getMyReview(courseId: number) {
    return this.request<ApiResponse<Review>>(
      `/api/reviews/course/${courseId}/my-review`
    );
  }

  // POST /api/reviews/course/{courseId} 🔐 (STUDENT only · must be enrolled)
  // rating: 1 to 5
  async createReview(courseId: number, data: { rating: number; comment: string }) {
    return this.request<ApiResponse<Review>>(
      `/api/reviews/course/${courseId}`,
      { method: 'POST', body: JSON.stringify(data) }
    );
  }

  // PUT /api/reviews/{reviewId} 🔐 (STUDENT only · own review)
  async updateReview(reviewId: number, data: { rating: number; comment: string }) {
    return this.request<ApiResponse<Review>>(
      `/api/reviews/${reviewId}`,
      { method: 'PUT', body: JSON.stringify(data) }
    );
  }

  // DELETE /api/reviews/{reviewId} 🔐 (STUDENT only · own review)
  async deleteReview(reviewId: number) {
    return this.request<ApiResponse<void>>(
      `/api/reviews/${reviewId}`,
      { method: 'DELETE' }
    );
  }

  // ────────────────────────────────────────
  // HEALTH
  // ────────────────────────────────────────

  // GET /actuator/health 🔓
  async healthCheck() {
    return this.request<{ status: string }>('/actuator/health');
  }
}

export const api = new ApiClient();