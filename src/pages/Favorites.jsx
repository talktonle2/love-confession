import { useState, useEffect } from "react";
import Container from "../components/Container.jsx";
import ConfessionCard from "../components/ConfessionCard.jsx";
import { getConfessions, getFavorites } from "../utils/storage.js";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { t } = useTranslation();
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const favorites = getFavorites();
      const allConfessions = getConfessions();
      const favoriteConfessions = allConfessions.filter(c => favorites.includes(c.id));
      setConfessions(favoriteConfessions);
    };
    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    window.addEventListener("confessionsUpdated", loadFavorites);
    return () => {
      window.removeEventListener("storage", loadFavorites);
      window.removeEventListener("confessionsUpdated", loadFavorites);
    };
  }, []);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20">
            <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400 fill-current" />
          </div>
          <div>
            <h2 className="text-3xl font-bold dark:text-white">{t("favorites")}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t("favoritesDesc")}</p>
          </div>
        </div>

        {confessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border bg-white p-12 text-center dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="text-4xl mb-4">⭐</div>
            <div className="text-lg font-semibold text-slate-700 mb-2 dark:text-slate-200">{t("noFavorites")}</div>
            <div className="text-sm text-slate-500 mb-4 dark:text-slate-400">
              {t("noFavoritesDesc")}
            </div>
            <Link
              to="/feed"
              className="inline-block px-5 py-3 rounded-2xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
            >
              {t("browseFeed")}
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {confessions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ConfessionCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </Container>
  );
}
