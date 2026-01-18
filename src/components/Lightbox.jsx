import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import LazyImage from './LazyImage.jsx';

export default function Lightbox({ 
  images = [], 
  isOpen, 
  onClose,
  initialIndex = 0,
  showThumbnails = true,
  showControls = true,
  enableZoom = true,
  enableDownload = true,
  enableShare = true,
  onImageChange
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrevious = currentIndex > 0;

  // Reset index when opening with different initialIndex
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setCurrentIndex(initialIndex);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
      }, 0);
    }
  }, [isOpen, initialIndex]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      onImageChange?.(newIndex, images[newIndex]);
    }
  }, [currentIndex, hasNext, images, onImageChange]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      onImageChange?.(newIndex, images[newIndex]);
    }
  }, [currentIndex, hasPrevious, images, onImageChange]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      onImageChange?.(index, images[index]);
    }
  }, [images, onImageChange]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleZoomIn = useCallback(() => {
    if (enableZoom && zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    }
  }, [enableZoom, zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (enableZoom && zoomLevel > 0.5) {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
  }, [enableZoom, zoomLevel]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          handleClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, goToPrevious, goToNext, handleClose, handleZoomIn, handleZoomOut, resetZoom]);

  const handleDownload = useCallback(() => {
    if (enableDownload && currentImage?.src) {
      const link = document.createElement('a');
      link.href = currentImage.src;
      link.download = currentImage.alt || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [enableDownload, currentImage]);

  const handleShare = useCallback(async () => {
    if (enableShare && navigator.share && currentImage?.src) {
      try {
        await navigator.share({
          title: currentImage.alt || 'Image',
          url: currentImage.src
        });
      } catch {
        console.log('Share cancelled or failed');
      }
    }
  }, [enableShare, currentImage]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (!enableZoom) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, [enableZoom]);

  // Drag to pan
  const handleMouseDown = useCallback((e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [zoomLevel, position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onClick={handleClose}
      >
        {/* Main Content */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="relative max-w-screen-max max-h-screen w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Container */}
          <div 
            className="relative overflow-hidden cursor-move"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }}
          >
            <motion.div
              animate={{ 
                scale: zoomLevel,
                x: position.x,
                y: position.y
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative"
            >
              <LazyImage
                src={currentImage?.src}
                alt={currentImage?.alt}
                className="max-w-full max-h-full"
                objectFit="contain"
              />
            </motion.div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {showControls && images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={goToNext}
                disabled={!hasNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          {enableZoom && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                onClick={resetZoom}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                aria-label="Reset zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            {enableDownload && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                aria-label="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            {enableShare && (
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                aria-label="Share image"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Image Info */}
          {currentImage?.alt && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <div className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm max-w-md">
                {currentImage.alt}
              </div>
            </div>
          )}

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-screen-lg overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 ${
                    index === currentIndex 
                      ? 'ring-2 ring-white scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <LazyImage
                    src={image.src}
                    alt={image.alt}
                    className="w-16 h-16"
                    objectFit="cover"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-white/20 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
