/**
 * Toast Hook
 * Manages toast notification state
 *
 * @module lib/hooks/useToast
 * @see Code Review: Replace alert() with toast system
 * @see PRD Phase 5: Toast notification system
 */

'use client';

import { useState, useCallback } from 'react';
import type { ToastType } from '@/components/shared/Toast';

interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      message,
      type,
      id: Date.now(),
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
