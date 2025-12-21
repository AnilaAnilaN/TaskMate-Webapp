// ==========================================
// DashboardClient.tsx - UPDATED
// ==========================================
'use client';

import { ChevronLeft, ChevronRight, Plus, MoreVertical, Clock, CheckCircle, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
import { getCategoryIcon } from '@/lib/config/categoryIcons';
import { useTimer } from '@/lib/contexts/TimerContext';

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
  const { isTimerActive, stopTimer, startTimer } = useTimer();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [calendarTasks, setCalendarTasks] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, tasksRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/tasks?status=todo', { cache: 'no-store' }),
      ]);

      const categoriesData = await categoriesRes.json();
      const tasksData = await tasksRes.json();

      if (categoriesData.success) setCategories(categoriesData.categories);
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
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCalendarTasks = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const response = await fetch(`/api/tasks/calendar?year=${year}&month=${month}`, { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        const tasksByDate: Record<number, number> = {};
        data.tasks.forEach((task: Task) => {
          if (task.dueDate) {
            const date = new Date(task.dueDate);
            tasksByDate[date.getDate()] = (tasksByDate[date.getDate()] || 0) + 1;
          }
        });
        setCalendarTasks(tasksByDate);
      }
    };
    fetchCalendarTasks();
  }, [currentDate]);

  const handleTimerToggle = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (isTimerActive(taskId)) {
      const result = stopTimer();
      if (result) {
        const minutesTracked = Math.floor(result.elapsedSeconds / 60);
        if (minutesTracked > 0) {
          await fetch(`/api/tasks/${taskId}/time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutesToAdd: minutesTracked }),
          });
        }
      }
    } else {
      startTimer(taskId);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      firstDay: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate()
    };
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < (firstDay || 7) - 1; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const hasTask = (calendarTasks[day] || 0) > 0;
      days.push(
        <div key={day} onClick={() => setSelectedDate(day)} className={`relative text-center py-2 cursor-pointer rounded-lg text-sm ${isSelected ? 'bg-yellow-400 font-semibold text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}>
          {day}
          {hasTask && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2"><div className="w-1 h-1 bg-yellow-500 rounded-full"></div></div>}
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 font-medium">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <div key={d} className="text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
              <div className="flex gap-1">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            {renderCalendar()}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">My categories</h2>
              <button onClick={() => router.push('dashboard/categories')} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">Manage</button>
            </div>
            <div className="space-y-3">
              {categories.slice(0, 4).map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <div key={cat.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{cat.name}</span>
                  </div>
                );
              })}
              <button onClick={() => setShowAddCategory(true)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-4">
                <Plus className="w-4 h-4" /> Add category
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column - Today's Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Today's tasks ({todayTasks.length})</h2>
            <button onClick={() => router.push('/tasks')} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">View all</button>
          </div>
          <div className="space-y-4">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No tasks for today</p>
                <button onClick={() => router.push('/tasks/new')} className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl text-sm font-medium">Create a task</button>
              </div>
            ) : (
              todayTasks.map((task) => {
                const Icon = task.categoryId ? getCategoryIcon(task.categoryId.icon) : null;
                const isTracking = isTimerActive(task.id);
                return (
                  <div key={task.id} onClick={() => router.push(`/tasks/${task.id}`)} className="flex items-start gap-3 pb-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <div className="w-5 h-5 border-2 border-yellow-400 rounded-full mt-0.5"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-gray-900 truncate">{task.title}</p>
                        {isTracking && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-red-700">Live</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.categoryId && (
                          <div className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1" style={{ backgroundColor: `${task.categoryId.color}20` }}>
                            {Icon && <Icon className="w-3 h-3" style={{ color: task.categoryId.color }} />}
                            <span>{task.categoryId.name}</span>
                          </div>
                        )}
                        <button onClick={(e) => handleTimerToggle(e, task.id)} className={`p-1 rounded transition-colors ${isTracking ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                          {isTracking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent tasks</h2>
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => {
                const isTracking = isTimerActive(task.id);
                return (
                  <div key={task.id} onClick={() => router.push(`/tasks/${task.id}`)} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{task.title}</span>
                      {isTracking && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded">
                          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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

      <AddCategoryModal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} onSuccess={() => { setShowAddCategory(false); router.refresh(); }} />
    </>
  );
}