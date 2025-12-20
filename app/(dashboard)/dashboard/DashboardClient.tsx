// app/(dashboard)/dashboard/DashboardClient.tsx
// ==========================================
'use client';

import { ChevronLeft, ChevronRight, Plus, MoreVertical, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
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
  status: string;
  dueDate?: string;
  categoryId?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

export default function DashboardClient() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [calendarTasks, setCalendarTasks] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCalendarTasks();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      const [categoriesRes, tasksRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/tasks?status=todo', { cache: 'no-store' }),
      ]);

      const categoriesData = await categoriesRes.json();
      const tasksData = await tasksRes.json();

      if (categoriesData.success) {
        setCategories(categoriesData.categories);
      }

      if (tasksData.success) {
        setTasks(tasksData.tasks);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayFiltered = tasksData.tasks.filter((task: Task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < tomorrow;
        });
        setTodayTasks(todayFiltered);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarTasks = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const response = await fetch(
        `/api/tasks/calendar?year=${year}&month=${month}`,
        { cache: 'no-store' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        const tasksByDate: Record<number, number> = {};
        data.tasks.forEach((task: Task) => {
          if (task.dueDate) {
            const date = new Date(task.dueDate);
            const day = date.getDate();
            tasksByDate[day] = (tasksByDate[day] || 0) + 1;
          }
        });
        setCalendarTasks(tasksByDate);
      }
    } catch (error) {
      console.error('Failed to fetch calendar tasks:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const changeMonth = (dir: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < (firstDay || 7) - 1; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const taskCount = calendarTasks[day] || 0;
      const hasTask = taskCount > 0;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`relative text-center py-2 cursor-pointer rounded-lg text-sm ${
            isSelected 
              ? 'bg-yellow-400 font-semibold text-gray-900' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
          {hasTask && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 font-medium">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const getTaskStatus = (task: Task) => {
    if (!task.dueDate) return 'No due date';
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate < today) return 'Overdue';
    if (dueDate >= today && dueDate < tomorrow) return 'Today';
    if (dueDate >= tomorrow && dueDate < new Date(tomorrow.getTime() + 86400000)) return 'Tomorrow';
    return dueDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-1">
                <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            {renderCalendar()}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">My categories</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {categories.slice(0, 4).map((cat) => {
                const IconComponent = getCategoryIcon(cat.icon);
                return (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{cat.name}</span>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={() => setShowAddCategory(true)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-4 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add category
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Today's tasks ({todayTasks.length})</h2>
            <button 
              onClick={() => router.push('/tasks')}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No tasks for today</p>
                <button
                  onClick={() => router.push('/tasks/new')}
                  className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl text-sm font-medium transition-colors"
                >
                  Create a task
                </button>
              </div>
            ) : (
              todayTasks.map((task) => {
                const IconComponent = task.categoryId ? getCategoryIcon(task.categoryId.icon) : null;
                return (
                  <div 
                    key={task.id} 
                    onClick={() => router.push(`/tasks/${task.id}`)}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="mt-0.5">
                      <div className="w-5 h-5 border-2 border-yellow-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1 truncate">{task.title}</p>
                      {task.categoryId && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                            style={{ backgroundColor: `${task.categoryId.color}20` }}
                          >
                            {IconComponent && <IconComponent className="w-3 h-3" style={{ color: task.categoryId.color }} />}
                            <span>{task.categoryId.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent tasks</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{task.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {getTaskStatus(task)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Quick stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total tasks</span>
                <span className="text-lg font-bold text-gray-900">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="text-lg font-bold text-gray-900">{categories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Due today</span>
                <span className="text-lg font-bold text-yellow-500">{todayTasks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSuccess={() => {
          setShowAddCategory(false);
          fetchData();
        }}
      />
    </>
  );
}