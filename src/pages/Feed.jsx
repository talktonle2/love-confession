import Container from "../components/Container.jsx";
import ConfessionCard from "../components/ConfessionCard.jsx";
import { getConfessions } from "../utils/storage.js";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowUpDown, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Feed() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [confessions, setConfessions] = useState([]);

  const categories = ["All", "Crush", "Secret", "Funny", "Apology", "Anniversary"];

  useEffect(() => {
    const loadConfessions = () => {
      const stored = getConfessions();
      // Sort by date (newest first)
      const sorted = stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setConfessions(sorted);
    };
    loadConfessions();
    // Reload when storage changes (from other tabs/windows)
    window.addEventListener("storage", loadConfessions);
    // Also listen for custom event for same-tab updates
    window.addEventListener("confessionsUpdated", loadConfessions);
    return () => {
      window.removeEventListener("storage", loadConfessions);
      window.removeEventListener("confessionsUpdated", loadConfessions);
    };
  }, []);

  const items = useMemo(() => {
    let filtered = confessions
      .filter((x) => (cat === "All" ? true : x.category === cat))
      .filter((x) => x.message.toLowerCase().includes(q.toLowerCase()));

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "mostLiked":
          return (b.likes || 0) - (a.likes || 0);
        case "mostViews":
          return (b.views || 0) - (a.views || 0);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [q, cat, confessions, sortBy]);

  const exportData = (format) => {
    const data = items.map(item => ({
      id: item.id,
      to: item.to,
      from: item.from,
      category: item.category,
      message: item.message,
      createdAt: item.createdAt,
      likes: item.likes || 0,
      views: item.views || 0,
      reactions: item.reactions || {}
    }));

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `confessions-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    } else if (format === "csv") {
      const headers = ["ID", "To", "From", "Category", "Message", "Created", "Likes", "Views"];
      const rows = data.map(item => [
        item.id,
        item.to,
        item.from,
        item.category,
        `"${item.message.replace(/"/g, '""')}"`,
        item.createdAt,
        item.likes,
        item.views
      ]);
      const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `confessions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-6"
      >
        <h2 className="text-2xl font-bold dark:text-white">{t("feedTitle")}</h2>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="pl-10 pr-4 py-2 rounded-2xl border bg-white w-64 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              aria-label={t("category")}
              className="pl-10 pr-4 py-2 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "All" ? t("allCategories") : c}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label={t("sortBy")}
              className="pl-10 pr-4 py-2 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            >
              <option value="newest">{t("sortNewest")}</option>
              <option value="oldest">{t("sortOldest")}</option>
              <option value="mostLiked">{t("sortMostLiked")}</option>
              <option value="mostViews">{t("sortMostViews")}</option>
            </select>
          </div>
          {items.length > 0 && (
            <div className="relative">
              <button
                onClick={() => exportData("json")}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border bg-white hover:bg-slate-50 transition font-medium dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                title={t("exportJSON")}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t("export")}</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ConfessionCard item={item} />
          </motion.div>
        ))}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border bg-white p-12 text-center dark:bg-slate-900 dark:border-slate-800"
          >
            {confessions.length === 0 ? (
              <>
                <div className="text-4xl mb-4">💗</div>
                <div className="text-lg font-semibold text-slate-700 mb-2 dark:text-slate-200">{t("noConfessions")}</div>
                <div className="text-sm text-slate-500 mb-4 dark:text-slate-400">
                  {t("beFirst")}
                </div>
                <Link
                  to="/create"
                  className="inline-block px-5 py-3 rounded-2xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
                >
                  {t("createYourOwn")}
                </Link>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-lg font-semibold text-slate-700 mb-2 dark:text-slate-200">{t("noConfessions")}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {t("tryAdjusting")}
                </div>
                {(q || cat !== "All") && (
                  <button
                    onClick={() => {
                      setQ("");
                      setCat("All");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl border hover:bg-pink-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                  >
                    {t("clearFilters")}
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </Container>
  );
}
