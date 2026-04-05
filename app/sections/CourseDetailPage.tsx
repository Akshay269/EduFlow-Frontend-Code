'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  FiStar, FiUsers, FiBarChart2, FiClock, FiArrowLeft,
  FiCheckCircle, FiEdit2, FiTrash2, FiAlertCircle
} from 'react-icons/fi';

interface CourseDetailPageProps {
  courseId: number;
  onNavigate: (page: string, data?: any) => void;
}

export default function CourseDetailPage({ courseId, onNavigate }: CourseDetailPageProps) {
  const { user, isAuthenticated, isStudent } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const data = await api.getCourse(courseId);
      setCourse(data);
    } catch (err) {
      console.error('Failed to fetch course:', err);
    }
  }, [courseId]);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await api.getCourseReviews(courseId);
      if (data && data.data.content) {
        setReviews(data.data.content);
      } else if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    }
  }, [courseId]);

  const checkEnrollment = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.checkEnrollment(courseId);
      setEnrolled(res.enrolled);
    } catch {
      // API might not have this endpoint — try via enrollments list
      try {
        const enrollments = await api.getMyEnrollments();
        const list = Array.isArray(enrollments) ? enrollments : enrollments?.content || [];
        setEnrolled(list.some((e: any) => e.courseId === courseId || e.course?.id === courseId));
      } catch {
        setEnrolled(false);
      }
    }
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCourse(), fetchReviews(), checkEnrollment()]).finally(() => setLoading(false));
  }, [fetchCourse, fetchReviews, checkEnrollment]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    setEnrolling(true);
    setError('');
    try {
      await api.enroll(courseId);
      setEnrolled(true);
    } catch (err: any) {
      setError(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      if (editingReview) {
        await api.updateReview(editingReview.id, { rating: reviewRating, comment: reviewComment });
      } else {
        await api.createReview(courseId, { rating: reviewRating, comment: reviewComment });
      }
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewRating(5);
      setReviewComment('');
      await fetchReviews();
      await fetchCourse();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.deleteReview(reviewId);
      await fetchReviews();
      await fetchCourse();
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
    }
  };

  const levelColor: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-700',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
    ADVANCED: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-200 rounded-xl mb-6" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
          <button onClick={() => onNavigate('courses')} className="text-indigo-600 hover:text-indigo-700">
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const userReview = reviews.find(
    (r) => r.studentId === user?.id || r.student?.id === user?.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiBarChart2 className="w-16 h-16 text-indigo-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {course.category && (
                  <span className="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${levelColor[course.level] || 'bg-gray-100 text-gray-700'}`}>
                    {course.level}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{course.title}</h1>
              {(course.instructorName || course.instructor?.name) && (
                <p className="mt-2 text-gray-500">
                  by <span className="font-medium text-gray-700">{course.instructorName || course.instructor?.name}</span>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                {course.averageRating != null && course.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-gray-700">{Number(course.averageRating).toFixed(1)}</span>
                    {course.totalReviews != null && <span>({course.totalReviews} reviews)</span>}
                  </div>
                )}
                {course.totalEnrollments != null && (
                  <div className="flex items-center gap-1">
                    <FiUsers className="w-4 h-4" />
                    <span>{course.totalEnrollments} students</span>
                  </div>
                )}
                {course.createdAt && (
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this course</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
                {enrolled && isStudent && !userReview && (
                  <button
                    onClick={() => { setShowReviewForm(true); setEditingReview(null); setReviewRating(5); setReviewComment(''); }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {editingReview ? 'Edit Review' : 'Write a Review'}
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <FiStar
                            className={`w-6 h-6 transition-colors ${
                              star <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                      placeholder="Share your thoughts about this course..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {reviewLoading ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowReviewForm(false); setEditingReview(null); }}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this course!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">
                              {review.studentName || review.student?.name || 'Student'}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.createdAt && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {(review.studentId === user?.id || review.student?.id === user?.id) && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>

              {enrolled ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">You are enrolled in this course</span>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 mb-4"
                >
                  {!isAuthenticated
                    ? 'Login to Enroll'
                    : enrolling
                    ? 'Enrolling...'
                    : course.price === 0
                    ? 'Enroll for Free'
                    : `Enroll for $${course.price}`}
                </button>
              )}

              <div className="space-y-3 text-sm text-gray-600">
                {course.level && (
                  <div className="flex items-center justify-between">
                    <span>Level</span>
                    <span className="font-medium text-gray-900">{course.level}</span>
                  </div>
                )}
                {course.category && (
                  <div className="flex items-center justify-between">
                    <span>Category</span>
                    <span className="font-medium text-gray-900">{course.category}</span>
                  </div>
                )}
                {course.totalEnrollments != null && (
                  <div className="flex items-center justify-between">
                    <span>Students</span>
                    <span className="font-medium text-gray-900">{course.totalEnrollments}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
