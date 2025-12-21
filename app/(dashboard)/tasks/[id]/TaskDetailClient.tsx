// ==========================================
// app/(dashboard)/tasks/[id]/TaskDetailClient.tsx
// COMPLETE FIXED VERSION WITH TIME TRACKING
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Edit2, Trash2, Clock, Calendar, Flag, 
  Play, Pause, Save, X, CheckCircle, Circle 
} from 'lucide-react';
import { getCategoryIcon } from '@/lib/config/categoryIcons';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  estimatedTime?: number;
  actualTime: number;
  categoryId: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetailClient() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<Task['status']>('todo');
  const [editPriority, setEditPriority] = useState<Task['priority']>('medium');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editEstimatedTime, setEditEstimatedTime] = useState('');

  // Timer state
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTask();
    fetchCategories();
  }, [taskId]);

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditStatus(task.status);
      setEditPriority(task.priority);
      setEditCategoryId(task.categoryId.id);
      setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setEditEstimatedTime(task.estimatedTime?.toString() || '');
    }
  }, [task]);

  // Timer effect
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { cache: 'no-store' });
      const data = await response.json();
      
      if (response.ok) {
        setTask(data.task);
      } else {
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    try {
      const updateData = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        status: editStatus,
        priority: editPriority,
        categoryId: editCategoryId,
        ...(editDueDate && { dueDate: new Date(editDueDate) }),
        ...(editEstimatedTime && { estimatedTime: parseInt(editEstimatedTime) }),
      };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchTask();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchTask();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const startTimer = () => {
    setIsTracking(true);
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = async () => {
    console.log('⏸️ Stopping timer...');
    console.log('Current time (seconds):', currentTime);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTracking(false);

    if (currentTime > 0 && task) {
      const minutesTracked = Math.floor(currentTime / 60);
      console.log('Minutes to add:', minutesTracked);
      console.log('Current task actualTime:', task.actualTime);
      
      if (minutesTracked > 0) {
        try {
          console.log('Sending request to save time...');
          const response = await fetch(`/api/tasks/${taskId}/time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutesToAdd: minutesTracked }),
          });

          const data = await response.json();
          console.log('Response:', data);

          if (response.ok) {
            console.log('✅ Time saved successfully');
            console.log('New actualTime:', data.task?.actualTime);
            await fetchTask();
          } else {
            console.error('❌ Failed to save time:', data.error);
            alert('Failed to save time: ' + data.error);
          }
        } catch (error) {
          console.error('❌ Error saving time:', error);
          alert('Failed to save tracked time. Please try again.');
        }
      } else {
        console.log('⚠️ Less than 1 minute tracked, not saving');
      }
    } else {
      console.log('⚠️ No time to save');
    }
    
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'in-progress') return <Clock className="w-5 h-5 text-yellow-500" />;
    if (status === 'cancelled') return <X className="w-5 h-5 text-red-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  const IconComponent = getCategoryIcon(task.categoryId.icon);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as Task['status'])}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => {
                      const CatIcon = getCategoryIcon(cat.icon);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setEditCategoryId(cat.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            editCategoryId === cat.id
                              ? 'border-yellow-400 bg-yellow-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center"
                            style={{ backgroundColor: `${cat.color}20` }}
                          >
                            <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                          </div>
                          <div className="text-xs font-medium text-gray-900 truncate">{cat.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Est. Time (min)</label>
                    <input
                      type="number"
                      value={editEstimatedTime}
                      onChange={(e) => setEditEstimatedTime(e.target.value)}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                    {task.description && (
                      <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: `${task.categoryId.color}20` }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: task.categoryId.color }} />
                    <span className="font-medium text-gray-700">{task.categoryId.name}</span>
                  </div>

                  <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-4 h-4 inline mr-1" />
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleStatusChange(task.status === 'completed' ? 'todo' : 'completed')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Time Tracking Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
            
            <div className="space-y-4">
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="text-4xl font-mono font-bold text-gray-900 mb-4">
                  {formatTime(currentTime)}
                </div>
                <button
                  onClick={isTracking ? stopTimer : startTimer}
                  className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors ${
                    isTracking
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Stop Timer
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Timer
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 mb-1">Estimated</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {task.estimatedTime ? formatMinutes(task.estimatedTime) : '—'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600 mb-1">Actual Time</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatMinutes(task.actualTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{task.status.replace('-', ' ')}</p>
              </div>

              {task.dueDate && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Due Date</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Calendar className="w-4 h-4" />
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(task.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              {['todo', 'in-progress', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as Task['status'])}
                  disabled={task.status === status}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    task.status === status
                      ? 'bg-yellow-50 text-yellow-700 cursor-not-allowed'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Change to {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}