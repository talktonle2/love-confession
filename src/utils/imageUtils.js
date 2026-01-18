// Image utility functions for optimization and processing

/**
 * Generate optimized image URL with quality and size parameters
 * @param {string} src - Original image source
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export function generateOptimizedImageSrc(src, options = {}) {
  const {
    width,
    height,
    quality = 75,
    format = 'auto',
    crop = 'limit',
    gravity = 'center'
  } = options;

  if (!src) return '';

  try {
    const url = new URL(src, window.location.origin);
    const params = new URLSearchParams(url.search);
    
    if (width) params.set('w', width);
    if (height) params.set('h', height);
    params.set('q', quality);
    params.set('f', format);
    params.set('c', crop);
    params.set('g', gravity);
    
    return `${url.pathname}?${params.toString()}`;
  } catch {
    console.warn('Invalid image URL:', src);
    return src;
  }
}

/**
 * Generate low-quality placeholder (LQIP) data URL
 * @param {string} src - Image source
 * @param {number} quality - Placeholder quality (1-20)
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @returns {Promise<string>} Base64 data URL
 */
export async function generatePlaceholder(src, quality = 10, width = 20, height = 20) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and blur the image
      ctx.filter = `blur(2px)`;
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      resolve(dataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image for placeholder generation'));
    img.src = src;
  });
}

/**
 * Calculate aspect ratio from image dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Aspect ratio (width/height)
 */
export function calculateAspectRatio(width, height) {
  if (!width || !height) return 1;
  return width / height;
}

/**
 * Calculate responsive image sizes attribute
 * @param {Object} breakpoints - Breakpoint configuration
 * @returns {string} Sizes attribute value
 */
export function generateSizes(breakpoints = {}) {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    large = '25vw'
  } = breakpoints;

  return `(max-width: 768px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1440px) ${desktop}, ${large}`;
}

/**
 * Generate srcset for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {Array} widths - Array of widths to generate
 * @returns {string} Srcset attribute value
 */
export function generateSrcset(baseUrl, widths = [320, 640, 768, 1024, 1280, 1536]) {
  return widths
    .map(width => `${generateOptimizedImageSrc(baseUrl, { width })} ${width}w`)
    .join(', ');
}

/**
 * Get dominant color from an image
 * @param {string} src - Image source
 * @returns {Promise<string>} Dominant color hex code
 */
export async function getDominantColor(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 50;
      canvas.height = 50;
      
      ctx.drawImage(img, 0, 0, 50, 50);
      const imageData = ctx.getImageData(0, 0, 50, 50);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      resolve(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
    };
    
    img.onerror = () => reject(new Error('Failed to analyze image'));
    img.src = src;
  });
}

/**
 * Validate image URL
 * @param {string} url - Image URL to validate
 * @returns {boolean} Whether URL is valid
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url, window.location.origin);
    return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(urlObj.pathname);
  } catch {
    return false;
  }
}

/**
 * Get image file extension from URL
 * @param {string} url - Image URL
 * @returns {string} File extension
 */
export function getImageExtension(url) {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url, window.location.origin);
    const match = urlObj.pathname.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  } catch {
    return '';
  }
}

/**
 * Check if image format supports transparency
 * @param {string} format - Image format
 * @returns {boolean} Whether format supports transparency
 */
export function supportsTransparency(format) {
  const transparentFormats = ['png', 'webp', 'svg', 'avif'];
  return transparentFormats.includes(format.toLowerCase());
}

/**
 * Calculate optimal image dimensions for container
 * @param {number} containerWidth - Container width
 * @param {number} containerHeight - Container height
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @param {string} objectFit - CSS object-fit behavior
 * @returns {Object} Optimized dimensions
 */
export function calculateOptimalDimensions(containerWidth, containerHeight, imageWidth, imageHeight, objectFit = 'cover') {
  if (!containerWidth || !containerHeight || !imageWidth || !imageHeight) {
    return { width: containerWidth, height: containerHeight };
  }

  const containerRatio = containerWidth / containerHeight;
  const imageRatio = imageWidth / imageHeight;

  switch (objectFit) {
    case 'cover':
      if (imageRatio > containerRatio) {
        return { width: containerWidth, height: containerWidth / imageRatio };
      } else {
        return { width: containerHeight * imageRatio, height: containerHeight };
      }
    
    case 'contain':
      if (imageRatio > containerRatio) {
        return { width: containerHeight * imageRatio, height: containerHeight };
      } else {
        return { width: containerWidth, height: containerWidth / imageRatio };
      }
    
    case 'fill':
      return { width: containerWidth, height: containerHeight };
    
    case 'none':
    case 'scale-down': {
      const scale = Math.min(
        containerWidth / imageWidth,
        containerHeight / imageHeight,
        1
      );
      return {
        width: imageWidth * scale,
        height: imageHeight * scale
      };
    }
    
    default:
      return { width: containerWidth, height: containerHeight };
  }
}

/**
 * Create image blob from canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} format - Image format
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<Blob>} Image blob
 */
export function canvasToBlob(canvas, format = 'image/jpeg', quality = 0.8) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, format, quality);
  });
}

/**
 * Compress image file
 * @param {File} file - Image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed file
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions
      let { width, height } = calculateOptimalDimensions(
        maxWidth,
        maxHeight,
        img.width,
        img.height,
        'inside'
      );

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: format,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, format, quality);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
