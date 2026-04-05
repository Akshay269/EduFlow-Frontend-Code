'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import CourseCard from './CourseCard';
import { FiArrowRight } from 'react-icons/fi';

interface FeaturedCoursesProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function FeaturedCourses({ onNavigate }: FeaturedCoursesProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const resdata = await api.getCourses({ page: 0, size: 8 });
        if (resdata && resdata.data.content) {
          setCourses(resdata.data.content);
        } else if (Array.isArray(resdata.data.content)) {
          setCourses(resdata.data.content.slice(0, 8));
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-500 mt-2">Popular courses picked for you</p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="hidden sm:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors text-sm"
          >
            View all courses
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No courses available yet. Check back soon!</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => onNavigate('course-detail', { courseId: course.id })}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <button
                onClick={() => onNavigate('courses')}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm inline-flex items-center gap-2"
              >
                View All Courses
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
