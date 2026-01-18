import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles, Crown, Gift, Zap } from "lucide-react";
import { useCoins } from "../hooks/useCoins.js";
import { COIN_PACKAGES } from "../utils/coins.js";
import { useSubscription } from "../hooks/useSubscription.js";

export default function Coins() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { coins } = useCoins();
  const { isYearly } = useSubscription();

  const handlePurchase = (packageId) => {
    // Navigate to payment with coin package
    navigate(`/payment/coins/${packageId}`);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold dark:text-white mb-2">{t("buyCoins")}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t("coinsDescription")}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 mb-6 dark:from-pink-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t("yourBalance")}</div>
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                <Sparkles className="h-8 w-8" />
                {coins}
              </div>
            </div>
            {isYearly && (
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("yearlyBonus")}</div>
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <Crown className="h-5 w-5" />
                  <span className="font-bold">+20%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COIN_PACKAGES.map((pkg, index) => {
            const bonusCoins = isYearly ? Math.floor(pkg.coins * 0.2) : 0;
            const totalCoins = pkg.coins + bonusCoins;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePurchase(pkg.id)}
                className={`relative rounded-3xl border-2 p-6 flex flex-col justify-between cursor-pointer transition-all ${pkg.popular
                    ? "bg-slate-900 border-pink-500 shadow-xl shadow-pink-900/20 active:scale-95 border-2 z-10 scale-105"
                    : "bg-slate-900/50 border-slate-700 hover:border-pink-500/50 active:scale-95"
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {t("bestValue")}
                  </div>
                )}

                <div className="text-center mb-6 pt-2">
                  <div className="text-5xl mb-3 drop-shadow-md">💎</div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-3xl font-extrabold text-white">
                      {totalCoins}
                    </span>
                    {bonusCoins > 0 && (
                      <span className="text-sm font-bold text-yellow-500">
                        (+{bonusCoins})
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-slate-400">{pkg.label}</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500 mb-1">
                    ${pkg.price}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    ${(pkg.price / pkg.coins * 100).toFixed(2)} per 100 coins
                  </div>

                  <button
                    className={`w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${pkg.popular
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                        : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                  >
                    {t("buyNow")}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-white rounded-2xl border dark:bg-slate-900 dark:border-slate-800">
            <Gift className="h-8 w-8 text-pink-600 dark:text-pink-400 mb-2" />
            <h3 className="font-bold dark:text-white mb-1">{t("sendGifts")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("sendGiftsDesc")}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border dark:bg-slate-900 dark:border-slate-800">
            <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-2" />
            <h3 className="font-bold dark:text-white mb-1">{t("boostProfile")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("boostProfileDesc")}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border dark:bg-slate-900 dark:border-slate-800">
            <Crown className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-bold dark:text-white mb-1">{t("extraLikes")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("extraLikesDesc")}</p>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
