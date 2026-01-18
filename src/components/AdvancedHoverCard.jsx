import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Eye, Share2, MessageCircle } from "lucide-react";

export default function AdvancedHoverCard({ 
  children, 
  className = "", 
  effect = "lift", 
  intensity = "medium" 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getEffectClasses = () => {
    const baseClasses = "relative transition-all duration-500 transform-gpu";
    
    switch (effect) {
      case "lift":
        return `${baseClasses} ${isHovered ? "scale-105 -translate-y-2" : ""}`;
      case "tilt":
        return `${baseClasses} ${isHovered ? "rotate-3 scale-105" : ""}`;
      case "flip":
        return `${baseClasses} ${isHovered ? "rotateY-180" : ""}`;
      case "glow":
        return `${baseClasses} ${isHovered ? "shadow-2xl shadow-pink-500/50" : ""}`;
      case "slide":
        return `${baseClasses} ${isHovered ? "translate-x-2" : ""}`;
      default:
        return baseClasses;
    }
  };

  const getIntensityClasses = () => {
    switch (intensity) {
      case "subtle":
        return "hover:shadow-md";
      case "medium":
        return "hover:shadow-lg";
      case "strong":
        return "hover:shadow-2xl";
      default:
        return "hover:shadow-lg";
    }
  };

  return (
    <motion.div
      className={`${className} ${getEffectClasses()} ${getIntensityClasses()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: effect === "lift" ? 1.05 : effect === "tilt" ? 1.02 : 1.01,
        rotate: effect === "tilt" ? 3 : 0,
        y: effect === "lift" ? -8 : 0,
        x: effect === "slide" ? 8 : 0,
        transition: { duration: 0.2 }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Background gradient that appears on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating action buttons */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 flex gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-pink-500 text-white shadow-lg"
              title="Like"
            >
              <Heart className="h-4 w-4 fill-current" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-purple-500 text-white shadow-lg"
              title="Save"
            >
              <Star className="h-4 w-4 fill-current" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-blue-500 text-white shadow-lg"
              title="Share"
            >
              <Share2 className="h-4 w-4 fill-current" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-green-500 text-white shadow-lg"
              title="Comment"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        animate={{ 
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      />
      
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
