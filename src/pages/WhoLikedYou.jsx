import { useState, useEffect } from "react";
import Container from "../components/Container.jsx";
import { useTranslation } from "react-i18next";
import { useSubscription } from "../hooks/useSubscription.js";
import { motion } from "framer-motion";
import { Heart, Crown, Eye, Lock } from "lucide-react";
import FeatureLock from "../components/FeatureLock.jsx";
import { Link } from "react-router-dom";

export default function WhoLikedYou() {
  const { t } = useTranslation();
  const { canSeeWhoLikedYou } = useSubscription();
  const [likers, setLikers] = useState([]);

  useEffect(() => {
    // Mock data - in real app, fetch from backend
    if (canSeeWhoLikedYou()) {
      const timer = setTimeout(() => {
        setLikers([
          { id: "1", name: "Sophea", age: 23, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80", likedAt: "2 hours ago" },
          { id: "2", name: "Dara", age: 25, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80", likedAt: "5 hours ago" },
          { id: "3", name: "Kanika", age: 21, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80", likedAt: "1 day ago" },
        ]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [canSeeWhoLikedYou]);

  if (!canSeeWhoLikedYou()) {
    return (
      <Container>
        <FeatureLock feature={t("seeWhoLikedYou")} plan="yearly" />
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-100 dark:bg-pink-900/20">
            <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400 fill-current" />
          </div>
          <div>
            <h2 className="text-3xl font-bold dark:text-white flex items-center gap-2">
              {t("seeWhoLikedYou")}
              <Crown className="h-6 w-6 text-yellow-500" />
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{t("whoLikedYouDesc")}</p>
          </div>
        </div>

        {likers.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-4xl mb-4">💔</div>
            <div className="text-lg font-semibold text-slate-700 mb-2 dark:text-slate-200">{t("noLikesYet")}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {t("noLikesYetDesc")}
            </div>
            <Link
              to="/match"
              className="inline-block mt-4 px-5 py-3 rounded-2xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
            >
              {t("startMatching")}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {likers.map((liker, index) => (
              <motion.div
                key={liker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={liker.image}
                    alt={liker.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-200 dark:border-pink-800"
                  />
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{liker.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{liker.age} {t("yearsOld")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <Heart className="h-4 w-4 text-pink-500 fill-current" />
                  {liker.likedAt}
                </div>
                <Link
                  to="/chat"
                  className="block w-full text-center px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition font-medium"
                >
                  {t("sendMessage")}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </Container>
  );
}
