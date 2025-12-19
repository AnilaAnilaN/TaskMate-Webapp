// app/dashboard/page.tsx - Add logout functionality
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Plus, Settings, LogOut, Search, Bell, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date(2022, 2, 1));
  const [selectedDate, setSelectedDate] = useState(3);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  // ... (rest of your dashboard code - tasks, categories, tracking, comments)

  const tasks = [
    { id: 1, title: 'Finish presentation report and...', status: 'Today', completed: false },
    { id: 2, title: 'Contract signing', status: 'Today', completed: false },
    { id: 3, title: 'Market overview brayin...', status: 'Tomorrow', completed: false },
    { id: 4, title: 'Project research', status: 'Tomorrow', completed: false },
    { id: 5, title: 'Prepare mockup', status: 'This week', completed: false }
  ];

  const categories = [
    { id: 1, name: 'Work', members: 2, color: 'bg-purple-500' },
    { id: 2, name: 'Family', members: 3, color: 'bg-blue-500' },
    { id: 3, name: 'Freelance work 👨', members: 3, color: 'bg-green-500' },
    { id: 4, name: 'Conference planning', members: 2, color: 'bg-orange-500' }
  ];

  const tracking = [
    { id: 1, name: 'Create wireframe', time: '1h 25m 30s', active: true },
    { id: 2, name: 'Desk legs design', time: '50m 15s', active: false },
    { id: 3, name: 'Dashboard design', time: '1h 08m 23s', active: false },
    { id: 4, name: 'Create wireframe', time: '37m 1s', active: false },
    { id: 5, name: 'Need tracker', time: '05m 50s', active: false }
  ];

  const comments = [
    { id: 1, type: 'Market research', time: '15 minutes', description: 'Use added file 2.psd...' },
    { id: 2, type: 'Market research', time: '15 minutes', description: 'Use added file 2.psd...' }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    for (let i = 0; i < (firstDay || 7) - 1; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`text-center py-2 cursor-pointer rounded-lg text-sm ${
            isSelected ? 'bg-yellow-400 font-semibold text-gray-900' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">😊</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">Organizo</span>
          </div>

          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-100 rounded-xl cursor-pointer">
              <Calendar className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-900 text-sm">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer">
              <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
              <span className="text-gray-600 text-sm">My tasks</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm">Notifications</span>
            </div>
          </nav>
        </div>

        <div className="flex-1"></div>

        <div className="p-6 border-t border-gray-200 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 text-sm">Settings</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 text-sm">
              {loggingOut ? 'Logging out...' : 'Log out'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content - Rest of the dashboard code stays the same */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-yellow-400 text-gray-900 rounded-xl font-medium hover:bg-yellow-500 flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                New task
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
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
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 ${category.color} rounded-lg`}></div>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <div className="flex -space-x-2">
                        {[...Array(category.members)].map((_, idx) => (
                          <div key={idx} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-4">
                    <Plus className="w-4 h-4" />
                    Add more
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">My tasks (05)</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 border-2 border-yellow-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1 truncate">{task.title}</p>
                      <span className="text-xs text-gray-500">{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Tracking */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">My tracking</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {tracking.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500">{item.time}</span>
                        {item.active && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">New comments</h2>
                  <button className="text-yellow-500 hover:text-yellow-600 text-sm font-medium">See all</button>
                </div>
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{comment.type}</span>
                        <button className="text-yellow-500 hover:text-yellow-600">→</button>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{comment.time}</p>
                      <p className="text-xs text-gray-600">{comment.description}</p>
                    </div>
                  ))}
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 w-full justify-center py-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Add Widget */}
              <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-500">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Add widget</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}