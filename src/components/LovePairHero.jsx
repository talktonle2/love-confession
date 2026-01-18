import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

// Images - Add your photos to src/assets/ folder
// 
// STEP 1: Add your image files to src/assets/:
//   - kosal.jpg (or .png, .webp) - Photo of Kosal Sensok
//   - mengly.jpg (or .png, .webp) - Photo of Khun Mengly
//
// STEP 2: Uncomment the import statements below and comment out the placeholder URLs
//
import kosalImg from "../assets/kosal.png";
import menglyImg from "../assets/mengly.png";

// Placeholder images - Replace with your actual photos
// For Kosal Sensok - professional placeholder
// const kosalImg = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=90";
// For Khun Mengly - professional placeholder (man with glasses, white shirt)
// const menglyImg = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&q=90";

export default function LovePairHero() {

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 rounded-[2rem] border bg-gradient-to-br from-white via-pink-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800 shadow-lg overflow-hidden relative"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex-1">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 dark:from-pink-900/30 dark:to-purple-900/30 dark:text-pink-300 text-xs font-semibold mb-3"
            >
              <Heart className="h-4 w-4 fill-pink-600 text-pink-600 dark:fill-pink-400 dark:text-pink-400" />
              <span>Love Story</span>
              <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-4xl font-bold dark:text-white mb-2"
            >
              Kosal Sensok{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block text-pink-600 dark:text-pink-400 mx-2"
              >
                ♥
              </motion.span>{" "}
              Khun Mengly
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-300 text-sm md:text-base"
            >
              ស្គាល់គ្នាតាំងពី <b className="text-pink-600 dark:text-pink-400">ឆ្នាំ 2021</b> — សារភាពស្នេហ៍របស់ពួកយើង តាមរយះការរៀននៅក្នុង <b className="text-purple-600 dark:text-purple-400">E school Cambodia</b> 💗
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border dark:border-slate-700"
          >
            ✨ Since 2021
          </motion.div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Kosal Sensok */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-[1.75rem] border-2 border-pink-200 dark:border-pink-900/50 bg-gradient-to-br from-white via-pink-50/50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-pink-400/20 via-transparent to-transparent" />

            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative p-5 md:p-6 flex items-center gap-4 md:gap-5">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"
                />
                <img
                  src={kosalImg}
                  alt="Kosal Sensok"
                  className="relative h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-lg"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to avatar if image not found
                    e.target.src = `https://ui-avatars.com/api/?name=Kosal+Sensok&background=f472b6&color=fff&size=200&bold=true`;
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <Heart className="h-3 w-3 text-white fill-white" />
                </motion.div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg md:text-xl dark:text-white mb-1">
                  Kosal Sensok
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Founder • Builder • Dreamer
                </div>
                <div className="flex items-center gap-2 text-xs text-pink-600 dark:text-pink-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Creating magic since 2021</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Khun Mengly */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-[1.75rem] border-2 border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-white via-purple-50/50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-400/20 via-transparent to-transparent" />

            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-5 md:p-6 flex items-center gap-4 md:gap-5">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"
                />
                <img
                  src={menglyImg}
                  alt="Khun Mengly"
                  className="relative h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-lg"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to avatar if image not found
                    e.target.src = `https://ui-avatars.com/api/?name=Khun+Mengly&background=a855f7&color=fff&size=200&bold=true`;
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Heart className="h-3 w-3 text-white fill-white" />
                </motion.div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg md:text-xl dark:text-white mb-1">
                  Khun Mengly
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Creative • Support • Heart
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Spreading love since 2021</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="text-sm md:text-base text-slate-700 dark:text-slate-300 italic">
            &quot;Love starts with a confession.&quot;
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              💗
            </motion.span>
            <span className="inline-flex items-center rounded-full border border-pink-200 dark:border-pink-900/50 bg-pink-50 dark:bg-pink-900/20 px-4 py-1.5 text-xs font-medium text-pink-700 dark:text-pink-300">
              Together Since 2021
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
