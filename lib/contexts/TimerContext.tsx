// lib/contexts/TimerContext.tsx
// ==========================================
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TimerState {
  taskId: string | null;
  startTime: number | null;
  elapsedSeconds: number;
}

interface TimerContextType {
  activeTimer: TimerState;
  startTimer: (taskId: string) => void;
  stopTimer: () => { taskId: string; elapsedSeconds: number } | null;
  getElapsedTime: () => number;
  isTimerActive: (taskId: string) => boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const STORAGE_KEY = 'taskmate_active_timer';

export function TimerProvider({ children }: { children: ReactNode }) {
  const [activeTimer, setActiveTimer] = useState<TimerState>({
    taskId: null,
    startTime: null,
    elapsedSeconds: 0,
  });

  // Load timer from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveTimer(parsed);
      } catch (error) {
        console.error('Failed to parse saved timer:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save timer to localStorage whenever it changes
  useEffect(() => {
    if (activeTimer.taskId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTimer));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeTimer]);

  const startTimer = (taskId: string) => {
    setActiveTimer({
      taskId,
      startTime: Date.now(),
      elapsedSeconds: 0,
    });
  };

  const stopTimer = () => {
    if (!activeTimer.taskId || !activeTimer.startTime) {
      return null;
    }

    const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000) + activeTimer.elapsedSeconds;
    const result = {
      taskId: activeTimer.taskId,
      elapsedSeconds: elapsed,
    };

    setActiveTimer({
      taskId: null,
      startTime: null,
      elapsedSeconds: 0,
    });

    return result;
  };

  const getElapsedTime = () => {
    if (!activeTimer.startTime) return activeTimer.elapsedSeconds;
    return Math.floor((Date.now() - activeTimer.startTime) / 1000) + activeTimer.elapsedSeconds;
  };

  const isTimerActive = (taskId: string) => {
    return activeTimer.taskId === taskId;
  };

  return (
    <TimerContext.Provider value={{ activeTimer, startTimer, stopTimer, getElapsedTime, isTimerActive }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
}
