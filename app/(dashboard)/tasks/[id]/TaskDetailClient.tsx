// app/tasks/new/NewTaskClient.tsx - UPDATED with Voice Recorder
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { getCategoryIcon } from '@/lib/config/categoryIcons';
import RichTextEditor from '@/components/editor/RichTextEditor';
import VoiceRecorder from '@/components/tasks/VoiceRecorder';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export default function NewTaskClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // HTML content
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      const data = await response.json();
      
      if (response.ok && data.categories.length > 0) {
        setCategories(data.categories);
        setCategoryId(data.categories[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setMessage('Failed to load categories');
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    // Append transcribed text to description
    // If description is empty, just set it
    // If description has content, add a line break and append
    if (!description || description === '<p></p>') {
      setDescription(`<p>${transcribedText}</p>`);
    } else {
      // Remove closing </p> tag, add text, re-add closing tag
      const withoutClosing = description.replace(/<\/p>$/, '');
      setDescription(`${withoutClosing} ${transcribedText}</p>`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setMessage('Please enter a task title');
      return;
    }

    if (!categoryId) {
      setMessage('Please select a category');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const taskData = {
        title: title.trim(),
        description: description,
        categoryId,
        priority,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(estimatedTime && { estimatedTime: parseInt(estimatedTime) }),
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      router.push('/tasks');
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCategories) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h2>
          <p className="text-gray-500 mb-6">You need to create a category before adding tasks</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            required
            maxLength={200}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <span className="text-xs text-gray-500">
              Type or use voice recording
            </span>
          </div>
          
          {/* Voice Recorder Component */}
          <div className="mb-3">
            <VoiceRecorder 
              onTranscriptionComplete={handleVoiceTranscription}
            />
          </div>

          {/* Rich Text Editor */}
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Add task description with rich formatting..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.icon);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    categoryId === category.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">{category.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="grid grid-cols-4 gap-3">
            {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  priority === p
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="60"
              min="0"
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm font-medium text-red-800">{message}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 rounded-xl font-semibold transition-colors"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}