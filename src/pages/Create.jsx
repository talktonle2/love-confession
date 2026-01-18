import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import Toast from "../components/Toast.jsx";
import QRCode from "../components/QRCode.jsx";
import SocialShare from "../components/SocialShare.jsx";
import { saveConfession } from "../utils/storage.js";
import { templates } from "../utils/templates.js";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Sparkles, X, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSubscription } from "../hooks/useSubscription.js";

const categories = ["Crush", "Secret", "Funny", "Apology", "Anniversary"];

function randomId() {
  return Math.random().toString(36).slice(2, 8);
}

export default function Create() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { canUseTemplates } = useSubscription();
  const [from, setFrom] = useState("Anonymous");
  const [to, setTo] = useState("Crush");
  const [category, setCategory] = useState("Crush");
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [savedCategory, setSavedCategory] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const count = message.length;
  const max = 280;

  const canGen = message.trim().length >= 5 && count <= max;

  const preview = useMemo(
    () => ({
      from: from.trim() || t("from"),
      to: to.trim() || t("to"),
      category,
      message: message.trim() || t("message"),
    }),
    [from, to, category, message, t]
  );

  const generate = () => {
    const id = randomId();
    const confession = {
      id,
      to: to.trim() || "Crush",
      from: from.trim() || "Anonymous",
      category,
      message: message.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      reactions: { heart: 0, wow: 0, laugh: 0, cry: 0, fire: 0 },
    };

    const saved = saveConfession(confession);
    if (saved) {
      setGeneratedId(id);
      setGenerated(`${window.location.origin}/c/${id}`);
      setSavedMessage(message.trim());
      setSavedCategory(category);
      setToastMessage(t("confessionCreated") + " ✅");
      setShowToast(true);
      // Reset form
      setFrom("Anonymous");
      setTo("Crush");
      setCategory("Crush");
      setMessage("");
    } else {
      setToastMessage("Failed to save confession. Please try again.");
      setShowToast(true);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setToastMessage(t("copied") + " ✅");
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setToastMessage("Failed to copy link. Please try again.");
      setShowToast(true);
    }
  };

  const applyTemplate = (template) => {
    setMessage(i18n.language === "km" ? template.km : template.en);
    setCategory(template.category);
    setShowTemplates(false);
  };

  return (
    <>
      <Toast
        message={toastMessage || t("copied") + " ✅"}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Container>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-[2rem] border bg-white shadow-sm p-7 dark:bg-slate-900 dark:border-slate-800">
            <h2 className="text-2xl font-bold dark:text-white">{t("createTitle")}</h2>

            <div className="mt-5 grid gap-3">
              <label className="text-sm font-medium dark:text-slate-300">{t("from")} (Optional)</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="px-4 py-3 rounded-2xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Anonymous"
              />

              <label className="text-sm font-medium mt-2 dark:text-slate-300">{t("to")} (Optional)</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="px-4 py-3 rounded-2xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Crush"
              />

              <label className="text-sm font-medium mt-2 dark:text-slate-300">{t("category")}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex items-center justify-between mt-2">
                <label className="text-sm font-medium dark:text-slate-300">{t("message")}</label>
                <button
                  onClick={() => {
                    if (!canUseTemplates()) {
                      navigate("/subscription");
                    } else {
                      setShowTemplates(!showTemplates);
                    }
                  }}
                  className="text-xs flex items-center gap-1 text-pink-600 font-medium hover:underline dark:text-pink-400"
                >
                  {canUseTemplates() ? <Sparkles className="h-3 w-3" /> : <Lock className="h-3 w-3" />} {t("needInspiration")}
                </button>
              </div>

              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-pink-50 rounded-2xl mb-2 grid gap-2 dark:bg-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("templates")}</span>
                        <button onClick={() => setShowTemplates(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {templates.map((tmpl, idx) => (
                          <button
                            key={idx}
                            onClick={() => applyTemplate(tmpl)}
                            className="text-left p-2 rounded-xl bg-white border text-xs hover:bg-pink-100 transition dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <div className="font-semibold text-pink-600 mb-1 dark:text-pink-400">{tmpl.label}</div>
                            <div className="line-clamp-2 text-slate-600 dark:text-slate-400">{i18n.language === "km" ? tmpl.km : tmpl.en}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= max) {
                    setMessage(e.target.value);
                  }
                }}
                maxLength={max}
                className="px-4 py-3 rounded-2xl border min-h-[160px] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder={t("message") + "..."}
              />
              <div className="text-xs flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t("minChars")}</span>
                <span className={`font-medium ${count > max
                  ? "text-red-600"
                  : count > max * 0.9
                    ? "text-orange-600"
                    : "text-slate-500 dark:text-slate-400"
                  }`}>
                  {count}/{max}
                </span>
              </div>

              <button
                disabled={!canGen}
                onClick={generate}
                className="mt-3 px-5 py-3 rounded-2xl bg-pink-600 text-white font-medium disabled:opacity-50 hover:bg-pink-700 transition"
              >
                {t("generateLink")}
              </button>

              {generated && (
                <div className="mt-3 rounded-2xl border bg-pink-50 p-4 space-y-4 dark:bg-slate-800 dark:border-slate-700">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    ✅ {t("confessionCreated")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2 dark:text-white">{t("shareUrl")}</div>
                    <div className="text-sm text-slate-700 break-all font-mono bg-white p-2 rounded-lg dark:bg-slate-900 dark:text-slate-300">{generated}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copy}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border bg-white hover:bg-pink-100 transition font-medium dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> {t("copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> {t("copyLink")}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => navigate(`/c/${generatedId}`)}
                      className="px-4 py-2 rounded-2xl bg-pink-600 text-white hover:bg-pink-700 transition font-medium"
                    >
                      {t("open")} →
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setGenerated("");
                      setGeneratedId("");
                      setSavedMessage("");
                      setSavedCategory("");
                    }}
                    className="w-full px-4 py-2 rounded-2xl border border-pink-200 bg-white hover:bg-pink-50 transition font-medium text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                  >
                    {t("createYourOwn")}
                  </button>
                  <div className="pt-3 border-t border-pink-200 dark:border-slate-700">
                    <div className="text-xs font-semibold text-slate-700 mb-2 dark:text-slate-300">{t("shareSocial")}</div>
                    <div className="space-y-3">
                      <SocialShare
                        url={generated}
                        title={`${savedCategory} - Love Confession`}
                        message={savedMessage ? (savedMessage.length > 100 ? savedMessage.substring(0, 100) + "..." : savedMessage) : "Check out this love confession!"}
                      />
                      <QRCode url={generated} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border bg-white shadow-sm p-7 dark:bg-slate-900 dark:border-slate-800"
          >
            <h3 className="text-xl font-bold dark:text-white">Preview</h3>

            <div className="mt-5 rounded-3xl border bg-gradient-to-b from-white to-pink-50 p-6 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-slate-800 dark:text-pink-300">
                  {preview.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("livePreview")}</span>
              </div>

              <p className="mt-4 text-lg leading-relaxed dark:text-slate-200">{preview.message}</p>

              <div className="mt-5 text-sm text-slate-700 flex flex-wrap gap-2 dark:text-slate-300">
                <span className="px-3 py-1 rounded-full bg-white border dark:bg-slate-800 dark:border-slate-700">
                  <b>{t("to")}:</b> {preview.to}
                </span>
                <span className="px-3 py-1 rounded-full bg-white border dark:bg-slate-800 dark:border-slate-700">
                  <b>{t("from")}:</b> {preview.from}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              *Version demo: Link generate នៅ local (mock). ពេលភ្ជាប់ Backend ទើប save ជា real id in the future.
            </div>
          </motion.div>
        </div>
      </Container>
    </>
  );
}
