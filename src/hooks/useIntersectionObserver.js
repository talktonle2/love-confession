import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export default function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  const defaultOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '0px',
    ...options
  }), [options]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const observe = useCallback(() => {
    if (!targetRef.current) return;

    disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      defaultOptions
    );

    observerRef.current.observe(targetRef.current);
  }, [disconnect, defaultOptions, hasIntersected]);

  useEffect(() => {
    observe();
    return disconnect;
  }, [observe, disconnect]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
    disconnect,
    observe
  };
}
