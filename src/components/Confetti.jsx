import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function Confetti({ show, onComplete }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const confettiPieces = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const seed = i * 0.1; // Use index as seed for consistency
      return {
        id: i,
        x: (seed * 37) % 100, // Pseudo-random using seed
        delay: (seed * 0.3) % 0.5,
        duration: 1 + (seed * 0.2) % 1,
        color: ["#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#10b981"][i % 5],
      };
    });
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}%`,
            y: -10,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}
