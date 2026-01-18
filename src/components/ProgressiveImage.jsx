import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function ProgressiveImage({ 
  src, 
  alt, 
  className = "",
  placeholder = "/api/placeholder/400/300",
  lowQualitySrc,
  onLoad,
  onError,
  width,
  height,
  objectFit = "cover",
  quality = 75,
  priority = false
}) {
  const [imageState, setImageState] = useState({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    currentSrc: lowQualitySrc || placeholder
  });

  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const loadImage = useCallback((imageSrc) => {
    if (!imageSrc) {
      setImageState(prev => ({
        ...prev,
        hasError: true,
        isLoading: false
      }));
      return;
    }

    setImageState(prev => ({
      ...prev,
      isLoading: true,
      isLoaded: false,
      hasError: false
    }));

    const img = new Image();
    
    img.onload = () => {
      setImageState(prev => ({
        ...prev,
        currentSrc: imageSrc,
        isLoaded: true,
        isLoading: false
      }));
      onLoad?.();
    };
    
    img.onerror = () => {
      console.warn('Failed to load image:', imageSrc);
      setImageState(prev => ({
        ...prev,
        hasError: true,
        isLoading: false
      }));
      onError?.();
    };
    
    img.src = imageSrc;
  }, [onLoad, onError]);

  const generateOptimizedSrc = useCallback(() => {
    if (!src) return '';
    
    try {
      const url = new URL(src, window.location.origin);
      const params = new URLSearchParams(url.search);
      
      if (width) params.set('w', width);
      if (height) params.set('h', height);
      params.set('q', quality);
      
      return `${url.pathname}?${params.toString()}`;
    } catch {
      console.warn('Invalid image URL:', src);
      return src;
    }
  }, [src, width, height, quality]);

  useEffect(() => {
    if (!priority && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load low quality first, then high quality
              if (lowQualitySrc && imageState.currentSrc === placeholder) {
                loadImage(lowQualitySrc);
              } else {
                loadImage(generateOptimizedSrc());
              }
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Load immediately if priority or no IntersectionObserver
      if (lowQualitySrc) {
        setTimeout(() => loadImage(lowQualitySrc), 0);
        // Load high quality after low quality loads
        setTimeout(() => loadImage(generateOptimizedSrc()), 100);
      } else {
        setTimeout(() => loadImage(generateOptimizedSrc()), 0);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, lowQualitySrc, placeholder, imageState.currentSrc, loadImage, generateOptimizedSrc]);

  // Progressive loading: load high quality after low quality loads
  useEffect(() => {
    if (imageState.isLoaded && imageState.currentSrc === lowQualitySrc && src) {
      setTimeout(() => loadImage(generateOptimizedSrc()), 200);
    }
  }, [imageState.isLoaded, imageState.currentSrc, lowQualitySrc, src, loadImage, generateOptimizedSrc]);

  const containerStyle = {
    width: width || '100%',
    height: height || 'auto'
  };

  const imageStyle = {
    objectFit,
    filter: imageState.currentSrc === lowQualitySrc ? 'blur(2px)' : 'none',
    transition: 'filter 0.3s ease-out'
  };

  if (imageState.hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={containerStyle}
      >
        <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</span>
        {alt && (
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center px-4">
            {alt}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      ref={imgRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: imageState.isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      <img
        src={imageState.currentSrc}
        alt={alt || ''}
        className={`w-full h-full transition-opacity duration-300 ${
          imageState.isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={imageStyle}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {imageState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <Loader2 className="w-6 h-6 text-pink-500 animate-spin mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {imageState.currentSrc === lowQualitySrc ? 'Loading preview...' : 'Loading...'}
            </span>
          </div>
        </div>
      )}
      
      {/* Accessibility improvements */}
      {alt && (
        <span className="sr-only" role="img" aria-label={alt}>
          {alt}
        </span>
      )}
    </motion.div>
  );
}
