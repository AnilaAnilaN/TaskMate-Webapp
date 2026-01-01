// components/dashboard/CategoryModal.tsx
// Unified modal for adding and editing categories
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    DEFAULT_CATEGORY_COLOR,
    DEFAULT_CATEGORY_ICON
} from '@/lib/constants/category-constants';

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    isDefault: boolean;
}

interface CategoryModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    category?: Category; // Required when mode='edit'
    onClose: () => void;
    onSuccess: () => void;
}

export default function CategoryModal({
    isOpen,
    mode,
    category,
    onClose,
    onSuccess
}: CategoryModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState(DEFAULT_CATEGORY_COLOR);
    const [icon, setIcon] = useState(DEFAULT_CATEGORY_ICON);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = mode === 'edit';

    // Initialize form values when category changes (edit mode)
    useEffect(() => {
        if (isEditMode && category) {
            setName(category.name);
            setColor(category.color);
            setIcon(category.icon);
        } else {
            // Reset to defaults for add mode
            setName('');
            setColor(DEFAULT_CATEGORY_COLOR);
            setIcon(DEFAULT_CATEGORY_ICON);
        }
    }, [category, isEditMode, isOpen]);

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
            const url = isEditMode
                ? `/api/categories/${category?.id}`
                : '/api/categories';

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), color, icon }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} category`);
            }

            // Reset form state on success (for add mode)
            if (!isEditMode) {
                setName('');
                setColor(DEFAULT_CATEGORY_COLOR);
                setIcon(DEFAULT_CATEGORY_ICON);
            }

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError('');
            if (!isEditMode) {
                setName('');
                setColor(DEFAULT_CATEGORY_COLOR);
                setIcon(DEFAULT_CATEGORY_ICON);
            }
            onClose();
        }
    };

    const title = isEditMode ? 'Edit Category' : 'Add Category';
    const submitText = isEditMode
        ? (loading ? 'Saving...' : 'Save Changes')
        : (loading ? 'Creating...' : 'Create Category');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="btn-ghost"
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
                            className="input-responsive"
                            autoFocus
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {CATEGORY_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-lg transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-yellow-400 scale-110' : ''
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
                            {CATEGORY_ICONS.map(({ key, Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setIcon(key)}
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${icon === key
                                        ? 'bg-yellow-400 scale-110 ring-2 ring-yellow-400 ring-offset-2'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 text-gray-700" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="status-box status-error">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary justify-center"
                        >
                            {submitText}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
