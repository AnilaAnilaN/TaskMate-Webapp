'use client';

import { Search, Plus, Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Search */}
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

      {/* Actions */}
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
  );
}
