import { motion } from 'framer-motion';

export default function SkeletonLoader({ 
  type = "card", 
  className = "", 
  lines = 3,
  width = "100%",
  height = "auto"
}) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded animate-pulse";
  
  if (type === "avatar") {
    return (
      <div className={`${baseClasses} w-10 h-10 ${className}`} />
    );
  }

  if (type === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4`}
            style={{ 
              width: i === lines - 1 ? "70%" : "100%",
              height: height === "auto" ? "1rem" : height
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className={`${baseClasses} ${className}`} style={{ width, height }} />
    );
  }

  if (type === "button") {
    return (
      <div className={`${baseClasses} h-10 w-20 ${className}`} />
    );
  }

  if (type === "card") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 space-y-3 ${className}`}
      >
        <div className={`${baseClasses} h-4 w-3/4`} />
        <div className={`${baseClasses} h-3 w-full`} />
        <div className={`${baseClasses} h-3 w-5/6`} />
        <div className="flex space-x-2 mt-4">
          <div className={`${baseClasses} h-8 w-16`} />
          <div className={`${baseClasses} h-8 w-16`} />
        </div>
      </motion.div>
    );
  }

  if (type === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className={`${baseClasses} w-10 h-10 rounded-full`} />
            <div className="flex-1 space-y-2">
              <div className={`${baseClasses} h-4 w-3/4`} />
              <div className={`${baseClasses} h-3 w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} style={{ width, height }} />;
}
