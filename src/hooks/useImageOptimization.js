    import { useState, useCallback, useEffect, useRef } from 'react';
import { generateOptimizedSrc, generatePlaceholder, getDominantColor } from '../utils/imageUtils.js';

export default function useImageOptimization(src, options = {}) {
  const {
    width,
    height,
    quality = 75,
    format = 'auto',
    generatePlaceholder: shouldGeneratePlaceholder = false,
    extractDominantColor: shouldExtractColor = false,
    lazy = true,
    threshold = 0.1,
    rootMargin = '50px'
  } = options;

  const [state, setState] = useState({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    optimizedSrc: '',
    placeholderSrc: '',
    dominantColor: '',
    naturalWidth: 0,
    naturalHeight: 0
  });

  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const loadImage = useCallback(async () => {
    if (!src) {
      setState(prev => ({
        ...prev,
        hasError: true,
        isLoading: false
      }));
      return;
    }

    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setState(prev => ({
      ...prev,
      isLoading: true,
      isLoaded: false,
      hasError: false
    }));

    try {
      // Generate optimized source
      const optimized = generateOptimizedSrc(src, { width, height, quality, format });
      
      // Generate placeholder if requested
      let placeholder = '';
      if (shouldGeneratePlaceholder) {
        placeholder = await generatePlaceholder(src, 10, 20, 20);
      }

      // Extract dominant color if requested
      let dominantColor = '';
      if (shouldExtractColor) {
        dominantColor = await getDominantColor(src);
      }

      // Load the optimized image
      const imageInfo = await new Promise((resolve, reject) => {
        const img = new Image();
        
        const cleanup = () => {
          img.onload = null;
          img.onerror = null;
        };

        img.onload = () => {
          cleanup();
          resolve({
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
        };

        img.onerror = () => {
          cleanup();
          reject(new Error('Failed to load optimized image'));
        };

        // Handle abort
        signal.addEventListener('abort', () => {
          cleanup();
          reject(new DOMException('Aborted', 'AbortError'));
        });

        img.src = optimized;
      });

      if (!signal.aborted) {
        setState(prev => ({
          ...prev,
          optimizedSrc: optimized,
          placeholderSrc: placeholder,
          dominantColor,
          naturalWidth: imageInfo.naturalWidth,
          naturalHeight: imageInfo.naturalHeight,
          isLoaded: true,
          isLoading: false
        }));
      }
    } catch (error) {
      if (!signal.aborted) {
        console.warn('Image optimization failed:', error);
        setState(prev => ({
          ...prev,
          hasError: true,
          isLoading: false,
          optimizedSrc: src // Fallback to original
        }));
      }
    }
  }, [src, width, height, quality, format, shouldGeneratePlaceholder, shouldExtractColor]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, loadImage, threshold, rootMargin]);

  // Load immediately if not lazy
  useEffect(() => {
    if (!lazy) {
      setTimeout(() => loadImage(), 0);
    }
  }, [lazy, loadImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      observerRef.current?.disconnect();
    };
  }, []);

  const retry = useCallback(() => {
    loadImage();
  }, [loadImage]);

  const getAspectRatio = useCallback(() => {
    if (state.naturalWidth && state.naturalHeight) {
      return state.naturalWidth / state.naturalHeight;
    }
    return 1;
  }, [state.naturalWidth, state.naturalHeight]);

  const getOptimizedSrc = useCallback((customOptions = {}) => {
    return generateOptimizedSrc(src, { width, height, quality, format, ...customOptions });
  }, [src, width, height, quality, format]);

  return {
    ...state,
    imgRef,
    retry,
    getAspectRatio,
    getOptimizedSrc,
    isOptimized: state.optimizedSrc !== src,
    hasPlaceholder: !!state.placeholderSrc,
    hasDominantColor: !!state.dominantColor
  };
}
