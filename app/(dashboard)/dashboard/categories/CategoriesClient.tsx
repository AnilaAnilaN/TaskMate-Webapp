// app/(dashboard)/categories/CategoriesClient.tsx
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { getCategoryIcon } from '@/lib/config/categoryIcons';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
import EditCategoryModal from '@/components/dashboard/EditCategoryModal';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isUncategorized?: boolean;
}

export default function CategoriesClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (category: Category) => {
    if (category.isDefault) {
      alert('Cannot delete default categories');
      return;
    }

    const message = category.isUncategorized 
      ? 'Cannot delete the Uncategorized category. It is used for tasks without a category.'
      : 'Are you sure you want to delete this category? All tasks in this category will be moved to "Uncategorized".';

    if (category.isUncategorized) {
      alert(message);
      return;
    }

    if (!confirm(message)) {
      return;
    }

    setDeletingId(category.id);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message with reassignment info
        if (data.tasksReassigned > 0) {
          alert(`Category deleted successfully. ${data.tasksReassigned} task(s) moved to "Uncategorized".`);
        }
        await fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
              <p className="text-sm text-gray-500 mt-1">Organize your tasks with categories</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">Default categories cannot be deleted</p>
            <p className="text-sm text-blue-700 mt-1">
              When you delete a custom category, all its tasks are automatically moved to "Uncategorized". 
              You can edit category names, colors, and icons at any time.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.icon);
            const isDeleting = deletingId === category.id;
            const cannotDelete = category.isDefault || category.isUncategorized;

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  
                  {category.isDefault && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                      Default
                    </span>
                  )}
                  {category.isUncategorized && !category.isDefault && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                      System
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {category.isUncategorized 
                    ? 'Fallback for orphaned tasks' 
                    : category.isDefault 
                      ? 'Built-in category' 
                      : 'Custom category'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(category)}
                    disabled={cannotDelete || isDeleting}
                    title={cannotDelete ? 'Cannot delete this category' : 'Delete category'}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      cannotDelete
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 mb-4">No categories yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create your first category
            </button>
          </div>
        )}
      </div>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchCategories();
        }}
      />

      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
            fetchCategories();
          }}
        />
      )}
    </>
  );
}