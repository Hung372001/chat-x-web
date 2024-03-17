import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export function useDragging() {
  const dragLeaveTimer = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isShowDragArea, setIsShowDragArea] = useState(false);
  const [isShowDragAreaDebounced] = useDebounce(isShowDragArea, 100);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();

    setIsDragging(true);
    setIsShowDragArea(true);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();

    setIsDragging(true);
    setIsShowDragArea(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();

    setIsDragging(false);
    if (dragLeaveTimer.current) {
      clearTimeout(dragLeaveTimer.current);
    }

    dragLeaveTimer.current = window.setTimeout(() => {
      if (!isDragging) {
        setIsShowDragArea(false);
      }
    }, 500);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    setIsDragging(false);
    setIsShowDragArea(false);

    if (dragLeaveTimer.current) {
      clearTimeout(dragLeaveTimer.current);
    }
  };

  useEffect(() => {
    document.documentElement.addEventListener('dragenter', handleDragEnter);
    document.documentElement.addEventListener('dragover', handleDragOver);
    document.documentElement.addEventListener('dragleave', handleDragLeave);
    document.documentElement.addEventListener('drop', handleDrop);

    return () => {
      document.documentElement.removeEventListener('dragenter', handleDragEnter);
      document.documentElement.removeEventListener('dragover', handleDragOver);
      document.documentElement.removeEventListener('dragleave', handleDragLeave);
      document.documentElement.removeEventListener('drop', handleDrop);
    };
  }, []);

  return { isDragging: isShowDragAreaDebounced };
}
