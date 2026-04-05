// EduFlow Type Definitions

export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  thumbnailUrl?: string;
  instructor?: User;
  instructorId?: number;
  instructorName?: string;
  averageRating?: number;
  totalReviews?: number;
  totalEnrollments?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseCreateRequest {
  title: string;
  description: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  course?: Course;
  student?: User;
  enrolledAt?: string;
  status?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  studentId?: number;
  studentName?: string;
  student?: User;
  courseId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewCreateRequest {
  rating: number;
  comment: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CourseFilters {
  keyword?: string;
  category?: string;
  level?: string;
  page?: number;
  size?: number;
  sort?: string;
}
