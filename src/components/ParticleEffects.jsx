import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Star } from "lucide-react";

export default function ParticleEffects({ trigger, type = "confetti" }) {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // Generate random values using useMemo to avoid impure function calls during render
  const generateRandomValues = useMemo(() => {
    const colors = ['#FF69B4', '#FFB6C1', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
    
    return {
      colors,
      random: () => Math.random(),
      now: () => Date.now(),
    };
  }, []);

  useEffect(() => {
    if (trigger && type === "confetti") {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: generateRandomValues.now() + i,
        x: generateRandomValues.random() * 100,
        y: generateRandomValues.random() * 100,
        color: generateRandomValues.colors[Math.floor(generateRandomValues.random() * generateRandomValues.colors.length)],
        size: generateRandomValues.random() * 6 + 4,
        rotation: generateRandomValues.random() * 360,
        velocityX: (generateRandomValues.random() - 0.5) * 4,
        velocityY: generateRandomValues.random() * -2 - 1,
      }));
      
      // Use setTimeout to avoid synchronous setState
      setTimeout(() => setParticles(newParticles), 0);
      
      // Clean up particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, type, generateRandomValues]);

  useEffect(() => {
    if (trigger && type === "hearts") {
      const newHearts = Array.from({ length: 8 }, (_, i) => ({
        id: generateRandomValues.now() + i,
        x: generateRandomValues.random() * 80 + 10,
        y: generateRandomValues.random() * 80 + 10,
        size: generateRandomValues.random() * 20 + 15,
        rotation: generateRandomValues.random() * 30 - 15,
        velocityX: (generateRandomValues.random() - 0.5) * 2,
        velocityY: generateRandomValues.random() * -2 - 3,
      }));
      
      setTimeout(() => setParticles(newHearts), 0);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, type, generateRandomValues]);

  useEffect(() => {
    if (trigger && type === "sparkles") {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: generateRandomValues.now() + i,
        x: generateRandomValues.random() * 100,
        y: generateRandomValues.random() * 100,
        size: generateRandomValues.random() * 15 + 10,
        rotation: generateRandomValues.random() * 360,
        velocityX: (generateRandomValues.random() - 0.5) * 1,
        velocityY: generateRandomValues.random() * -1 - 0.5,
      }));
      
      setTimeout(() => setParticles(newSparkles), 0);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, type, generateRandomValues]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: particle.rotation + "deg"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: particle.rotation + 360 + "deg",
              x: particle.x + "%",
              y: particle.y + "%"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              rotate: particle.rotation + 720 + "deg"
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          >
            {type === "confetti" && (
              <div
                className="rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 10px ${particle.color}40`,
                }}
              />
            )}
            
            {type === "hearts" && (
              <Heart
                className="text-pink-500"
                style={{
                  fontSize: `${particle.size}px`,
                  filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))',
                }}
              />
            )}
            
            {type === "sparkles" && (
              <Sparkles
                className="text-yellow-400"
                style={{
                  fontSize: `${particle.size}px`,
                  filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.4))',
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
