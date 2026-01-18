import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function Toast({ message, show, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white border-2 border-pink-200 rounded-2xl shadow-lg px-5 py-4 min-w-[280px] dark:bg-slate-900 dark:border-slate-700"
        >
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-800 flex-1 dark:text-white">{message}</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
