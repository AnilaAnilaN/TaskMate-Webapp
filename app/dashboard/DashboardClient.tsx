// app/dashboard/DashboardClient.tsx
'use client';

import { ChevronLeft, ChevronRight, Plus, MoreVertical, Clock } from 'lucide-react';
import { useState } from 'react';

export default function DashboardClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const tasks = [
    { id: 1, title: 'Finish presentation report', status: 'Today' },
    { id: 2, title: 'Contract signing', status: 'Today' },
    { id: 3, title: 'Market overview', status: 'Tomorrow' },
  ];

  const categories = [
    { id: 1, name: 'Work', members: 2, color: 'bg-purple-500' },
    { id: 2, name: 'Family', members: 3, color: 'bg-blue-500' },
  ];

  const tracking = [
    { id: 1, name: 'Create wireframe', time: '1h 25m', active: true },
    { id: 2, name: 'Desk legs design', time: '50m', active: false },
  ];

  const comments = [
    { id: 1, type: 'Market research', time: '15 min', description: 'Use added file 2.psd' },
  ];

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

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const days = [];
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
        <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 font-medium">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    // NO SIDEBAR OR TOPBAR HERE - they're in layout.tsx
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
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${cat.color} rounded-lg`}></div>
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
                <div className="flex -space-x-2">
                  {[...Array(cat.members)].map((_, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-4">
              <Plus className="w-4 h-4" /> Add more
            </button>
          </div>
        </div>
      </div>

      {/* Middle Column */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">My tasks ({tasks.length})</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {tasks.map((task) => (
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
            {tracking.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">{item.time}</span>
                  {item.active && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">New comments</h2>
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{comment.type}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{comment.time}</p>
                <p className="text-xs text-gray-600">{comment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}