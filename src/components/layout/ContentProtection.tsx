'use client';

import { useEffect } from 'react';

/**
 * Client-side content protection layer.
 * Blocks casual theft attempts: right-click save, drag-and-drop,
 * keyboard shortcuts (Ctrl+S, PrintScreen, DevTools), and
 * touch-based long-press save on mobile.
 *
 * NOTE: This deters casual users. Determined attackers with OS-level tools
 * cannot be stopped by any web application — the watermark + low-res preview
 * strategy is the real protection.
 */
export function ContentProtection() {
  useEffect(() => {
    // --- Block right-click context menu on images and canvases ---
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'CANVAS' ||
        target.closest('[data-protected]')
      ) {
        e.preventDefault();
      }
    }

    // --- Block drag-and-drop on images ---
    function handleDragStart(e: DragEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('[data-protected]')) {
        e.preventDefault();
      }
    }

    // --- Block keyboard shortcuts ---
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+S / Cmd+S — save page
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      // Ctrl+Shift+I / Cmd+Option+I — DevTools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
      // Ctrl+Shift+C — DevTools element inspector
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
      }
      // Ctrl+U / Cmd+U — view source
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
      }
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
    }

    // --- Block touch long-press save on mobile ---
    function handleTouchStart(e: TouchEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('[data-protected]')) {
        (target.style as any).webkitTouchCallout = 'none';
      }
    }

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Render nothing — this component only attaches event listeners
  return null;
}
