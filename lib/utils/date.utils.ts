// lib/utils/date.utils.ts
// ==========================================
// Shared date utility functions to eliminate code duplication

/**
 * Get the start and end of today (midnight to midnight)
 */
export function getTodayRange(): { start: Date; end: Date } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
}

/**
 * Get the start and end of a specific day
 */
export function getDayRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

/**
 * Get the start and end of a specific month
 */
export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return { start, end };
}

/**
 * Check if a date is before today (overdue)
 */
export function isOverdue(dueDate: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    return due < today;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkDate = new Date(date);
    return checkDate >= today && checkDate < tomorrow;
}

/**
 * Get the start of today (midnight)
 */
export function getStartOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Format a date for display (can be extended for localization)
 */
export function formatDateShort(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
