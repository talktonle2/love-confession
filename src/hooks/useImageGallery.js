import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

export default function useImageGallery(images = [], options = {}) {
  const {
    initialIndex = 0,
    autoPlay = false,
    autoPlayInterval = 3000,
    loop = false,
    keyboardNavigation = true,
    swipeNavigation = true,
    pauseOnHover = false,
    resetOnImageChange = false
  } = options;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const swipeStateRef = useRef({ touchStartX: 0, touchStartY: 0, isSwiping: false });

  const currentImage = useMemo(() => images[currentIndex] || null, [images, currentIndex]);
  const hasNext = useMemo(() => currentIndex < images.length - 1, [currentIndex, images.length]);
  const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex]);
  const progress = useMemo(() => images.length > 0 ? ((currentIndex + 1) / images.length) * 100 : 0, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    } else if (loop) {
      setCurrentIndex(0);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  }, [hasNext, loop, isPlaying]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentIndex(prev => prev - 1);
    } else if (loop) {
      setCurrentIndex(images.length - 1);
    }
  }, [hasPrevious, loop, images.length]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < images.length && index !== currentIndex) {
      setCurrentIndex(index);
      if (resetOnImageChange) {
        setIsPlaying(false);
      }
    }
  }, [images.length, currentIndex, resetOnImageChange]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const startAutoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(initialIndex);
    setIsPlaying(autoPlay);
  }, [initialIndex, autoPlay]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(false);
    }
  }, [pauseOnHover]);

  // Auto-play functionality
  useEffect(() => {
    const shouldPlay = isPlaying && images.length > 1 && (!pauseOnHover || !isHovering);
    
    if (shouldPlay) {
      intervalRef.current = setInterval(goToNext, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, goToNext, autoPlayInterval, images.length, pauseOnHover, isHovering]);

  // Keyboard navigation
  useEffect(() => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          stopAutoPlay();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardNavigation, goToPrevious, goToNext, togglePlay, stopAutoPlay]);

  // Swipe navigation with improved gesture detection
  useEffect(() => {
    if (!swipeNavigation || !containerRef.current) return;

    const handleTouchStart = (e) => {
      const touch = e.changedTouches[0];
      swipeStateRef.current = {
        touchStartX: touch.screenX,
        touchStartY: touch.screenY,
        isSwiping: false
      };
    };

    const handleTouchMove = (e) => {
      if (!swipeStateRef.current.isSwiping) {
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.screenX - swipeStateRef.current.touchStartX);
        const deltaY = Math.abs(touch.screenY - swipeStateRef.current.touchStartY);
        
        // Only consider it a swipe if horizontal movement is greater than vertical
        if (deltaX > deltaY && deltaX > 10) {
          swipeStateRef.current.isSwiping = true;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!swipeStateRef.current.isSwiping) return;
      
      const touch = e.changedTouches[0];
      const touchEndX = touch.screenX;
      const touchStartX = swipeStateRef.current.touchStartX;
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          goToNext(); // Swipe left
        } else {
          goToPrevious(); // Swipe right
        }
      }
      
      swipeStateRef.current.isSwiping = false;
    };

    const container = containerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [swipeNavigation, goToNext, goToPrevious]);

  return {
    currentIndex,
    currentImage,
    hasNext,
    hasPrevious,
    isPlaying,
    isHovering,
    progress,
    containerRef,
    goToNext,
    goToPrevious,
    goToImage,
    togglePlay,
    stopAutoPlay,
    startAutoPlay,
    reset,
    handleMouseEnter,
    handleMouseLeave,
    imagesCount: images.length
  };
}
