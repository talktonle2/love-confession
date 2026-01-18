import { motion } from "framer-motion";

export default function LoadingSkeleton({ type = "card" }) {
  if (type === "card") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/20 dark:border-slate-700/30 shadow-lg overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                backgroundSize: "200% 100%",
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-24 rounded-xl bg-gradient-to-r from-pink-200 to-pink-100 dark:from-slate-700 dark:to-slate-800"
            />
            <motion.div
              animate={{ 
                width: ["0%", "100%", "0%"],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-16 rounded-xl bg-slate-200 dark:bg-slate-700"
            />
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <motion.div
              animate={{ 
                width: ["0%", "100%", "0%"],
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-4 rounded-xl bg-slate-200 dark:bg-slate-700"
            />
            <motion.div
              animate={{ 
                width: ["0%", "80%", "0%"],
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              className="h-3 rounded-xl bg-slate-200 dark:bg-slate-700"
            />
            <motion.div
              animate={{ 
                width: ["0%", "90%", "0%"],
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              className="h-3 rounded-xl bg-slate-200 dark:bg-slate-700"
            />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between mt-4">
            <motion.div
              animate={{ 
                width: ["0%", "60%", "0%"],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-700"
            />
            <motion.div
              animate={{ 
                width: ["0%", "40%", "0%"],
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-700"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
            className="rounded-2xl border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/20 dark:border-slate-700/30 shadow-lg p-4"
          >
            <div className="flex items-center gap-4">
              {/* Avatar skeleton */}
              <motion.div
                animate={{ 
                  scale: [0.8, 1, 0.8, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"
              />
              
              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <motion.div
                  animate={{ 
                    width: ["0%", "100%", "0%"],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-4 rounded-lg bg-slate-200 dark:bg-slate-700 w-3/4"
                />
                <motion.div
                  animate={{ 
                    width: ["0%", "80%", "0%"],
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="h-3 rounded-lg bg-slate-200 dark:bg-slate-700 w-1/2"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: item * 0.1 }}
            className="h-4 rounded-xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    );
  }

  return null;
}
