'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  FiPlus, FiEdit2, FiTrash2, FiUsers, FiStar,
  FiBookOpen, FiRefreshCw, FiX, FiUpload, FiAlertCircle, FiEye
} from 'react-icons/fi';

interface InstructorDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function InstructorDashboard({ onNavigate }: InstructorDashboardProps) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<string>('BEGINNER');
  const [price, setPrice] = useState('0');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // Enrollment viewer
  const [viewEnrollments, setViewEnrollments] = useState<number | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getInstructorCourses();
      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data?.content) {
        setCourses(data.content);
      } else {
        setCourses([]);
      }
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLevel('BEGINNER');
    setPrice('0');
    setThumbnail(null);
    setError('');
  };

  const openCreate = () => {
    resetForm();
    setEditingCourse(null);
    setShowCreateModal(true);
  };

  const openEdit = (course: any) => {
    setEditingCourse(course);
    setTitle(course.title || '');
    setDescription(course.description || '');
    setCategory(course.category || '');
    setLevel(course.level || 'BEGINNER');
    setPrice(String(course.price || 0));
    setThumbnail(null);
    setError('');
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const courseData = {
        title,
        description,
        category,
        level,
        price: parseFloat(price) || 0,
      };

      let courseId: number;
      if (editingCourse) {
        const updated = await api.updateCourse(editingCourse.id, courseData);
        courseId = updated?.id || editingCourse.id;
      } else {
        const created = await api.createCourse(courseData);
        courseId = created.id;
      }

      if (thumbnail) {
        try {
          await api.uploadCourseThumbnail(courseId, thumbnail);
        } catch {
          // Continue even if thumbnail upload fails
        }
      }

      setShowCreateModal(false);
      resetForm();
      await fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await api.deleteCourse(courseId);
      await fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
    }
  };

  const handleViewEnrollments = async (courseId: number) => {
    if (viewEnrollments === courseId) {
      setViewEnrollments(null);
      return;
    }
    setViewEnrollments(courseId);
    setEnrollmentsLoading(true);
    try {
      const data = await api.getCourseEnrollments(courseId);
      if (Array.isArray(data)) {
        setEnrolledStudents(data);
      } else if (data?.content) {
        setEnrolledStudents(data.content);
      } else {
        setEnrolledStudents([]);
      }
    } catch {
      setEnrolledStudents([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const levelColor: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-700',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
    ADVANCED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-500 mt-2">
                Welcome, {user?.name}! Manage your {courses.length} course{courses.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCourses}
                className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
                title="Refresh"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={openCreate}
                className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && !showCreateModal && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto"><FiX className="w-4 h-4" /></button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse flex gap-4">
                <div className="w-40 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              <FiBookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Create your first course and start teaching</p>
            <button
              onClick={openCreate}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <FiPlus className="w-4 h-4" />
              Create Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-44 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg overflow-hidden flex-shrink-0">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiBookOpen className="w-8 h-8 text-indigo-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2 mb-1.5">
                          {course.category && (
                            <span className="px-2 py-0.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                              {course.category}
                            </span>
                          )}
                          {course.level && (
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${levelColor[course.level] || ''}`}>
                              {course.level}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                      </div>
                      <span className="text-lg font-bold text-gray-900 flex-shrink-0">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      {course.averageRating != null && course.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span>{Number(course.averageRating).toFixed(1)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-3.5 h-3.5" />
                        <span>{course.totalEnrollments || 0} students</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => onNavigate('course-detail', { courseId: course.id })}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => openEdit(course)}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 flex items-center gap-1.5"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewEnrollments(course.id)}
                        className={`px-3 py-1.5 text-sm font-medium border rounded-lg flex items-center gap-1.5 ${
                          viewEnrollments === course.id
                            ? 'text-indigo-600 border-indigo-300 bg-indigo-50'
                            : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FiUsers className="w-3.5 h-3.5" />
                        Students
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1.5"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enrolled Students Panel */}
                {viewEnrollments === course.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="font-medium text-gray-900 mb-3">Enrolled Students</h4>
                    {enrollmentsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    ) : enrolledStudents.length === 0 ? (
                      <p className="text-sm text-gray-500">No students enrolled yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {enrolledStudents.map((enrollment: any, i: number) => {
                          const student = enrollment.student || enrollment;
                          return (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-indigo-600">
                                  {(student.name || 'S').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{student.name || 'Student'}</p>
                                <p className="text-xs text-gray-400 truncate">{student.email || ''}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="Course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                  placeholder="Describe your course..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    placeholder="e.g. Programming"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                  <FiUpload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {thumbnail ? thumbnail.name : 'Upload an image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
