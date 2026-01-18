import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CoffeeButton from "../components/CoffeeButton.jsx";
import LovePairHero from "../components/LovePairHero.jsx";
import LoveStorySection from "../components/LoveStorySection.jsx";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Container>
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border bg-white shadow-sm p-8 dark:bg-slate-900 dark:border-slate-800"
      >
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
          {t("homeTitle")}
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-300">
          {t("homeDesc")}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/create"
            className="px-6 py-3 rounded-2xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t("writeConfession")}
          </Link>
          <Link
            to="/feed"
            className="px-6 py-3 rounded-2xl border font-medium hover:bg-pink-50 transition dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white text-center"
          >
            {t("viewFeed")}
          </Link>
        </div>

        {/* Love Pair Hero Section */}
        <LovePairHero />

        {/* Love Story & Timeline */}
        <LoveStorySection />

        <div className="mt-8 mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg dark:text-white mb-1">Support នារី IT ☕</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Buy a coffee to support development</p>
            </div>
            <CoffeeButton creatorId="creator_1" creatorName="នារី IT" variant="small" />
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: "1) " + t("createTitle"), d: t("writeConfession") + " + " + t("category"), icon: "✍️" },
            { t: "2) Preview", d: "Preview before generating Link", icon: "👀" },
            { t: "3) Share", d: "Copy Link / QR / Share to social", icon: "📤" },
          ].map((x, index) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                scale: 1.02
              }}
              className="rounded-3xl border p-5 bg-gradient-to-b from-white to-pink-50 hover:shadow-lg transition-all duration-300 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 cursor-pointer"
            >
              <div className="text-3xl mb-3">{x.icon}</div>
              <div className="font-semibold dark:text-white text-lg">{x.t}</div>
              <div className="text-sm text-slate-600 mt-2 dark:text-slate-400">{x.d}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </Container>
  );
}
