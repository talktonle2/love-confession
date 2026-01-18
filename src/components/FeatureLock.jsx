import { useNavigate } from "react-router-dom";
import { Lock, Crown, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function FeatureLock({ feature, plan = "monthly" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-pink-50 to-white rounded-3xl border-2 border-dashed border-pink-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700"
    >
      <div className="mb-6 p-4 bg-pink-100 rounded-full dark:bg-pink-900/20">
        <Lock className="h-12 w-12 text-pink-600 dark:text-pink-400" />
      </div>
      <h3 className="text-2xl font-bold mb-2 dark:text-white">{t("featureLocked")}</h3>
      <p className="text-slate-600 text-center mb-6 max-w-md dark:text-slate-400">
        {t("upgradeToUnlock")} {feature}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/subscription")}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:shadow-lg transition shadow-md"
        >
          <Crown className="h-5 w-5" />
          {t("upgradeToPro")}
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-2xl border bg-white hover:bg-slate-50 transition font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        >
          {t("backToHome")}
        </button>
      </div>
      {plan === "yearly" && (
        <div className="mt-6 flex items-center gap-2 text-xs text-pink-600 dark:text-pink-400">
          <Sparkles className="h-4 w-4" />
          <span>{t("bestValueTip")}</span>
        </div>
      )}
    </motion.div>
  );
}
