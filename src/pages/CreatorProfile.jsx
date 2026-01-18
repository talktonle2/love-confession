import { useState, useEffect } from "react";
import Container from "../components/Container.jsx";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Coffee, Heart, Users, TrendingUp, Sparkles, FileText } from "lucide-react";
import { getCreatorCoffeeStats } from "../utils/coffee.js";
import CoffeeButton from "../components/CoffeeButton.jsx";
import ProjectRequestForm from "../components/ProjectRequestForm.jsx";
import { useParams } from "react-router-dom";

export default function CreatorProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const creatorId = id || "creator_1"; // Default creator ID
  const creatorName = "នារី IT"; // Creator name
  const [stats, setStats] = useState({ totalAmount: 0, totalCount: 0, latestSupporters: [] });
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    const loadStats = () => {
      const coffeeStats = getCreatorCoffeeStats(creatorId);
      setStats(coffeeStats);
    };
    loadStats();
    window.addEventListener("coffeeOrdersUpdated", loadStats);
    return () => window.removeEventListener("coffeeOrdersUpdated", loadStats);
  }, [creatorId]);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4">
            <Coffee className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold dark:text-white mb-2 flex items-center justify-center gap-2">
            {creatorName}
            {/* Mocking VIP Badge for this creator */}
            <img src="/vip-badge.png" alt="VIP" className="h-8 w-auto" title="VIP Creator" />
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{t("creatorBio")}</p>
          <div className="mt-4 flex gap-3 justify-center flex-wrap">
            <CoffeeButton creatorId={creatorId} creatorName={creatorName} />
            <button
              onClick={() => setShowProjectForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-md"
            >
              <FileText className="h-5 w-5" />
              {t("requestProject")}
            </button>
          </div>
        </div>

        <ProjectRequestForm
          creatorId={creatorId}
          creatorName={creatorName}
          show={showProjectForm}
          onClose={() => setShowProjectForm(false)}
        />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/20">
                <Coffee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-bold dark:text-white mb-1">${stats.totalAmount.toFixed(2)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{t("totalCoffeeReceived")}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/20">
                <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <div className="text-3xl font-bold dark:text-white mb-1">{stats.totalCount}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{t("totalSupporters")}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold dark:text-white mb-1">
              {stats.totalCount > 0 ? (stats.totalAmount / stats.totalCount).toFixed(2) : "0.00"}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{t("averagePerCoffee")}</div>
          </motion.div>
        </div>

        {/* Latest Supporters */}
        {stats.latestSupporters.length > 0 && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("latestSupporters")}
            </h3>
            <div className="space-y-3">
              {stats.latestSupporters.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      {order.is_anonymous ? "?" : order.buyer_user_id?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div className="font-semibold dark:text-white">
                        {order.is_anonymous ? t("anonymousSupporter") : `${t("supporter")} ${order.buyer_user_id || ""}`}
                      </div>
                      {order.message && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                          &quot;{order.message}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-600 dark:text-amber-400">${order.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(order.paid_at).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.totalCount === 0 && (
          <div className="rounded-3xl border bg-white p-12 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-6xl mb-4">☕</div>
            <div className="text-lg font-semibold text-slate-700 mb-2 dark:text-slate-200">{t("noCoffeeYet")}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {t("beFirstToSupport")}
            </div>
            <CoffeeButton creatorId={creatorId} creatorName={creatorName} />
          </div>
        )}
      </motion.div>
    </Container>
  );
}
