// components/dashboard/EditCategoryModal.tsx
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { X, Briefcase, Home, Users, Heart, BookOpen, DollarSign,
  Gamepad2, Palette, Car, Plane, Coffee, Music, Smartphone, 
  Laptop, Wrench, ShoppingBag, Film, Dumbbell } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}

const COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const ICON_OPTIONS = [
  { key: 'briefcase', Icon: Briefcase },
  { key: 'home', Icon: Home },
  { key: 'users', Icon: Users },
  { key: 'heart', Icon: Heart },
  { key: 'book', Icon: BookOpen },
  { key: 'dollar', Icon: DollarSign },
  { key: 'gamepad', Icon: Gamepad2 },
  { key: 'palette', Icon: Palette },
  { key: 'car', Icon: Car },
  { key: 'plane', Icon: Plane },
  { key: 'coffee', Icon: Coffee },
  { key: 'music', Icon: Music },
  { key: 'smartphone', Icon: Smartphone },
  { key: 'laptop', Icon: Laptop },
  { key: 'wrench', Icon: Wrench },
  { key: 'shopping', Icon: ShoppingBag },
  { key: 'film', Icon: Film },
  { key: 'dumbbell', Icon: Dumbbell },
];

export default function EditCategoryModal({ isOpen, category, onClose, onSuccess }: EditCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setIcon(category.icon);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color, icon }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category');
      }

      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Shopping, Hobbies"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              autoFocus
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-yellow-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                    icon === key 
                      ? 'bg-yellow-400 scale-110 ring-2 ring-yellow-400 ring-offset-2' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 rounded-xl font-semibold transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}