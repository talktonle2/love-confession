import { useState, useEffect, useMemo } from "react";
import Container from "../components/Container.jsx";
import { getConfessions } from "../utils/storage.js";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Heart, MessageCircle, Share2, Eye, Calendar, BarChart3, Award, Sparkles } from "lucide-react";

export default function Statistics() {
  const { t } = useTranslation();
  const [confessions, setConfessions] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const loadConfessions = () => {
      const stored = getConfessions();
      setConfessions(stored);
    };
    loadConfessions();
    window.addEventListener("confessionsUpdated", loadConfessions);
    return () => window.removeEventListener("confessionsUpdated", loadConfessions);
  }, []);

  const stats = useMemo(() => {
    const total = confessions.length;
    const totalLikes = confessions.reduce((sum, c) => sum + (c.likes || 0), 0);
    const totalReactions = confessions.reduce((sum, c) => {
      const reactions = c.reactions || {};
      return sum + Object.values(reactions).reduce((s, v) => s + v, 0);
    }, 0);
    const totalViews = confessions.reduce((sum, c) => sum + (c.views || 0), 0);
    const totalShares = confessions.reduce((sum, c) => sum + (c.shares || 0), 0);

    const categoryCounts = confessions.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {});

    const mostLiked = confessions.length > 0
      ? confessions.reduce((max, c) => (c.likes || 0) > (max.likes || 0) ? c : max, confessions[0])
      : null;

    const recentCount = confessions.filter(c => {
      const date = new Date(c.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    return {
      total,
      totalLikes,
      totalReactions,
      totalViews,
      totalShares,
      categoryCounts,
      mostLiked,
      recentCount,
    };
  }, [confessions]);

  const statCards = [
    { icon: MessageCircle, label: t("totalConfessions"), value: stats.total, bgColor: "bg-pink-100 dark:bg-pink-900/20", iconColor: "text-pink-600 dark:text-pink-400" },
    { icon: Heart, label: t("totalLikes"), value: stats.totalLikes, bgColor: "bg-red-100 dark:bg-red-900/20", iconColor: "text-red-600 dark:text-red-400" },
    { icon: TrendingUp, label: t("totalReactions"), value: stats.totalReactions, bgColor: "bg-blue-100 dark:bg-blue-900/20", iconColor: "text-blue-600 dark:text-blue-400" },
    { icon: Eye, label: t("totalViews"), value: stats.totalViews, bgColor: "bg-purple-100 dark:bg-purple-900/20", iconColor: "text-purple-600 dark:text-purple-400" },
    { icon: Share2, label: t("totalShares"), value: stats.totalShares, bgColor: "bg-green-100 dark:bg-green-900/20", iconColor: "text-green-600 dark:text-green-400" },
    { icon: Calendar, label: t("recentConfessions"), value: stats.recentCount, bgColor: "bg-orange-100 dark:bg-orange-900/20", iconColor: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold dark:text-white mb-2">{t("statistics")}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t("statisticsDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                scale: 1.02
              }}
              onHoverStart={() => setHoveredCard(stat.label)}
              onHoverEnd={() => setHoveredCard(null)}
              className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 cursor-pointer transition-all duration-300 relative overflow-hidden group"
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === stat.label ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Sparkle effect on hover */}
              <AnimatePresence>
                {hoveredCard === stat.label && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="h-4 w-4 text-pink-500" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`p-3 rounded-xl ${stat.bgColor}`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="text-xs text-slate-500 dark:text-slate-400"
                  >
                    {hoveredCard === stat.label ? "View Details" : ""}
                  </motion.div>
                </div>
                <motion.div 
                  className="text-3xl font-bold dark:text-white mb-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> {t("categoryBreakdown")}
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.categoryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count], index) => {
                  const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                  return (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium dark:text-white">{category}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {stats.mostLiked && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
            >
              <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5" /> {t("mostLikedConfession")}
              </h3>
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-4 bg-gradient-to-br from-pink-50 to-amber-50 rounded-xl dark:from-slate-800 dark:to-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-200 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                      {stats.mostLiked.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {stats.mostLiked.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 mb-2">
                    {stats.mostLiked.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <span><b>{t("to")}:</b> {stats.mostLiked.to}</span>
                    <span><b>{t("from")}:</b> {stats.mostLiked.from}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <motion.span 
                      className="flex items-center gap-1 text-pink-600 dark:text-pink-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      {stats.mostLiked.likes || 0}
                    </motion.span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      {t("totalReactions")}: {Object.values(stats.mostLiked.reactions || {}).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Container>
  );
}
