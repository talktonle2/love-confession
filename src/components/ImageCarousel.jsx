import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle, Play, Pause } from 'lucide-react';
import LazyImage from './LazyImage.jsx';

export default function ImageCarousel({ 
  images = [], 
  className = "",
  showIndicators = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = true,
  height = "400px",
  objectFit = "cover",
  transitionDuration = 500,
  showProgress = false,
  pauseOnHover = true
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrevious = currentIndex > 0;

  const goToNext = useCallback(() => {
    if (hasNext) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setProgress(((newIndex + 1) / images.length) * 100);
    } else if (loop) {
      setCurrentIndex(0);
      setProgress((1 / images.length) * 100);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  }, [currentIndex, hasNext, loop, isPlaying, images.length]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setProgress(((newIndex + 1) / images.length) * 100);
    } else if (loop) {
      setCurrentIndex(images.length - 1);
      setProgress(100);
    }
  }, [currentIndex, hasPrevious, loop, images.length]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      setProgress(((index + 1) / images.length) * 100);
    }
  }, [images.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPlaying(false);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && autoPlay) {
      setIsPlaying(true);
    }
  }, [pauseOnHover, autoPlay]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && images.length > 1) {
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
  }, [isPlaying, goToNext, autoPlayInterval, images.length]);

  // Initialize progress
  useEffect(() => {
    setTimeout(() => setProgress(((currentIndex + 1) / images.length) * 100), 0);
  }, [currentIndex, images.length]);

  const handleIndicatorClick = useCallback((index) => {
    goToImage(index);
  }, [goToImage]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };


  if (!images.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} style={{ height }}>
        <p className="text-gray-500 dark:text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ height }}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Image Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={hasNext ? 1 : -1}>
          <motion.div
            key={currentIndex}
            custom={hasNext ? 1 : -1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: transitionDuration / 1000 }
            }}
            className="absolute inset-0"
          >
            <LazyImage
              src={currentImage?.src}
              alt={currentImage?.alt}
              className="w-full h-full"
              objectFit={objectFit}
              fadeInDuration={transitionDuration}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!hasPrevious && !loop}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToNext}
            disabled={!hasNext && !loop}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Progress Bar */}
      {showProgress && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
          />
        </div>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`transition-all duration-200 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            >
              {index === currentIndex && (
                <motion.div
                  className="w-full h-full bg-white rounded-full"
                  layoutId="activeIndicator"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Auto-play Controls */}
      {autoPlay && (
        <button
          onClick={togglePlay}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black-70 transition-all duration-200 backdrop-blur-sm"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Image Alt Text Overlay */}
      {currentImage?.alt && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
            {currentImage.alt}
          </div>
        </div>
      )}
    </div>
  );
}
