import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';

export default function LazyImage({ 
  src, 
  alt, 
  className = "", 
  placeholder = "/api/placeholder/400/300",
  onLoad,
  onError,
  loading = "lazy",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectFit = "cover",
  width,
  height,
  fadeInDuration = 300,
  showLoadingText = true
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const containerStyle = useMemo(() => ({
    width: width || '100%',
    height: height || 'auto'
  }), [width, height]);

  const imageStyle = useMemo(() => ({
    objectFit,
    transitionDuration: `${fadeInDuration}ms`
  }), [objectFit, fadeInDuration]);

  const loadImage = useCallback(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsLoaded(false);
    setHasError(false);
    
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      console.warn('Failed to load image:', src);
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };
    
    img.src = src;
  }, [src, onLoad, onError]);

  useEffect(() => {
    if (loading === "lazy" && "IntersectionObserver" in window) {
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
        { threshold: 0.1 }
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
  }, [loadImage, loading]);

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
      transition={{ duration: fadeInDuration / 1000 }}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      <img
        src={imageSrc}
        alt={alt || ''}
        className={`w-full h-full transition-opacity ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={imageStyle}
        loading={loading}
        sizes={sizes}
        decoding="async"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <Loader2 className="w-6 h-6 text-pink-500 animate-spin mb-2" />
            {showLoadingText && (
              <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
            )}
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
