import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage.jsx';

export default function ImageMasonry({ 
  images = [], 
  className = "",
  columns = 3,
  gap = 16,
  showLoadMore = true,
  imagesPerLoad = 12,
  onLoadMore,
  objectFit = "cover",
  borderRadius = "0.5rem",
  enableLightbox = false,
  onImageClick
}) {
  const [visibleImages, setVisibleImages] = useState(imagesPerLoad);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const containerRef = useRef(null);

  const columnWidth = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;

  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextIndex = Math.min(visibleImages + imagesPerLoad, images.length);
    setVisibleImages(nextIndex);
    onLoadMore?.(nextIndex);
  }, [visibleImages, imagesPerLoad, images.length, onLoadMore]);

  const handleImageClick = useCallback((image, index) => {
    if (enableLightbox && onImageClick) {
      onImageClick(image, index);
    }
  }, [enableLightbox, onImageClick]);

  // Distribute images across columns
  const columnsData = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    const sortedImages = images
      .slice(0, visibleImages)
      .map((image, index) => ({ ...image, originalIndex: index }))
      .sort((a, b) => (b.height || 400) - (a.height || 400)); // Sort by height for better masonry

    sortedImages.forEach((image, index) => {
      cols[index % columns].push(image);
    });

    return cols;
  }, [images, visibleImages, columns]);

  const hasMoreImages = visibleImages < images.length;

  // Intersection Observer for infinite loading
  useEffect(() => {
    if (!showLoadMore || !hasMoreImages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => observer.disconnect();
  }, [showLoadMore, hasMoreImages, handleLoadMore]);

  if (!images.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        ref={containerRef}
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${columnWidth})`,
          gap: `${gap}px`
        }}
      >
        {columnsData.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((image) => (
              <motion.div
                key={image.originalIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: loadedImages.has(image.originalIndex) ? 1 : 0,
                  y: loadedImages.has(image.originalIndex) ? 0 : 20
                }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  y: { duration: 0.3, delay: image.originalIndex * 0.05 }
                }}
                className={`relative overflow-hidden cursor-pointer group`}
                style={{ borderRadius }}
                onClick={() => handleImageClick(image, image.originalIndex)}
              >
                <LazyImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full"
                  objectFit={objectFit}
                  onLoad={() => handleImageLoad(image.originalIndex)}
                  style={{
                    height: image.height || 'auto',
                    minHeight: '100px'
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {image.title && (
                    <div className="text-white text-center p-4">
                      <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-xs opacity-90">{image.description}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Loading Skeleton */}
                {!loadedImages.has(image.originalIndex) && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Load More Trigger */}
      {showLoadMore && hasMoreImages && (
        <div id="load-more-trigger" className="flex justify-center py-8">
          <motion.button
            onClick={handleLoadMore}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
          >
            Load More Images ({images.length - visibleImages} remaining)
          </motion.button>
        </div>
      )}

      {/* End Message */}
      {!hasMoreImages && images.length > 0 && (
        <div className="text-center py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 dark:text-gray-400"
          >
            <p className="mb-2">🎉 All images loaded</p>
            <p className="text-sm">Showing {images.length} images</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
