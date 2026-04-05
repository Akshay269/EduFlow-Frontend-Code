'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import CourseCard from './CourseCard';
import { FiBookOpen, FiGrid, FiRefreshCw } from 'react-icons/fi';

interface StudentDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await api.getMyEnrollments();
      if (Array.isArray(data)) {
        setEnrollments(data);
      } else if (data?.content) {
        setEnrollments(data.content);
      } else {
        setEnrollments([]);
      }
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
              <p className="text-gray-500 mt-2">
                Welcome back, {user?.name}! You have {enrollments.length} enrolled course{enrollments.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <button
              onClick={fetchEnrollments}
              className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              <FiBookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Start your learning journey by browsing our course catalog</p>
            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <FiGrid className="w-4 h-4" />
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrollments.map((enrollment) => {
              const course = enrollment.course || enrollment;
              return (
                <CourseCard
                  key={enrollment.id}
                  course={course}
                  onClick={() => onNavigate('course-detail', { courseId: course.id })}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
