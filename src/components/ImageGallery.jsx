import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Share2 } from 'lucide-react';
import LazyImage from './LazyImage.jsx';

export default function ImageGallery({ 
  images = [], 
  className = "",
  showThumbnails = true,
  showControls = true,
  showFullscreen = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImageChange,
  onFullscreenToggle
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const currentImage = useMemo(() => images[currentIndex] || {}, [images, currentIndex]);
  const hasNext = useMemo(() => currentIndex < images.length - 1, [currentIndex, images.length]);
  const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex, images[newIndex]);
    }
  }, [currentIndex, hasNext, images, onImageChange]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex, images[newIndex]);
    }
  }, [currentIndex, hasPrevious, images, onImageChange]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      onImageChange?.(index, images[index]);
    }
  }, [images, onImageChange]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    onFullscreenToggle?.(!isFullscreen);
  }, [isFullscreen, onFullscreenToggle]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleDownload = useCallback(() => {
    if (currentImage.src) {
      const link = document.createElement('a');
      link.href = currentImage.src;
      link.download = currentImage.alt || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [currentImage]);

  const handleShare = useCallback(async () => {
    if (navigator.share && currentImage.src) {
      try {
        await navigator.share({
          title: currentImage.alt || 'Image',
          url: currentImage.src
        });
      } catch {
        console.log('Share cancelled or failed');
      }
    }
  }, [currentImage]);

  // Auto-play functionality
  useState(() => {
    if (isPlaying && autoPlay) {
      const interval = setInterval(() => {
        if (hasNext) {
          goToNext();
        } else {
          setIsPlaying(false); // Stop at the end
        }
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isPlaying, autoPlay, hasNext, goToNext, autoPlayInterval]);

  if (!images.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative group">
        <LazyImage
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full"
          objectFit="contain"
        />
        
        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={!hasPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              disabled={!hasNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {showFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
              aria-label="Toggle fullscreen"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
            aria-label="Download image"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
            aria-label="Share image"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Play/Pause Button for Auto-play */}
        {autoPlay && (
          <button
            onClick={togglePlay}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-1 h-4 bg-white mr-1"></div>
                <div className="w-1 h-4 bg-white"></div>
              </div>
            ) : (
              <div className="w-0 h-0 border-l-8 border-l-white border-y-4 border-y-transparent"></div>
            )}
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex 
                  ? 'ring-2 ring-pink-500 scale-105' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                className="w-20 h-20"
                objectFit="cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-pink-500/20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-screen-max max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <LazyImage
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-w-full max-h-full"
                objectFit="contain"
              />
              
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
