import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  width,
  height,
  quality = 75,
  format = 'auto',
  onLoad,
  onError,
  priority = false,
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectFit = "cover"
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const generateOptimizedSrc = useCallback(() => {
    if (!src) return '';
    
    try {
      // Basic optimization - in production you'd use a CDN like Cloudinary, Vercel, etc.
      const url = new URL(src, window.location.origin);
      const params = new URLSearchParams(url.search);
      
      if (width) params.set('w', width);
      if (height) params.set('h', height);
      params.set('q', quality);
      params.set('f', format);
      
      return `${url.pathname}?${params.toString()}`;
    } catch {
      console.warn('Invalid image URL:', src);
      return src;
    }
  }, [src, width, height, quality, format]);

  const containerStyle = useMemo(() => ({
    width: width || '100%',
    height: height || 'auto'
  }), [width, height]);

  const loadImage = useCallback(() => {
    if (!src) return;
    
    setIsLoading(true);
    setIsLoaded(false);
    setHasError(false);
    
    const optimizedSrc = generateOptimizedSrc();
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };
    
    img.src = optimizedSrc;
  }, [src, generateOptimizedSrc, onLoad, onError]);

  useEffect(() => {
    if (!priority && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Use setTimeout to avoid synchronous setState
              setTimeout(() => loadImage(), 0);
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
      // Use setTimeout to avoid synchronous setState
      setTimeout(() => loadImage(), 0);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadImage, priority]);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} style={containerStyle}>
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
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      <img
        src={imageSrc}
        alt={alt || ''}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectFit }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <Loader2 className="w-6 h-6 text-pink-500 animate-spin mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Accessibility and SEO improvements */}
      {alt && (
        <span className="sr-only" role="img" aria-label={alt}>
          {alt}
        </span>
      )}
    </motion.div>
  );
}
