import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";
import { useCoins } from "../hooks/useCoins.js";
import Toast from "./Toast.jsx";

const GIFTS = [
  { id: "rose", emoji: "🌹", name: "Rose", price: 10, message: "A beautiful rose for you" },
  { id: "ring", emoji: "💍", name: "Ring", price: 50, message: "Will you be mine?" },
  { id: "loveLetter", emoji: "💌", name: "Love Letter", price: 30, message: "A letter from my heart" },
  { id: "chocolate", emoji: "🍫", name: "Chocolate", price: 20, message: "Sweet like you" },
  { id: "heart", emoji: "💖", name: "Heart", price: 15, message: "My heart belongs to you" },
  { id: "star", emoji: "⭐", name: "Star", price: 25, message: "You're my shining star" },
];

export default function LoveGifts({ onGiftSent, show, onClose }) {
  const { t } = useTranslation();
  const { coins, useCoins: spendCoins, canAfford } = useCoins();
  const [selectedGift, setSelectedGift] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSendGift = (gift) => {
    if (!canAfford(gift.price)) {
      setToastMessage(t("insufficientCoins"));
      setShowToast(true);
      return;
    }

    const success = spendCoins(gift.price, `gift_${gift.id}`);
    if (success) {
      setToastMessage(`${t("giftSent")} ${gift.emoji} ${gift.name}!`);
      setShowToast(true);
      if (onGiftSent) {
        onGiftSent({
          giftId: gift.id,
          giftName: gift.name,
          giftEmoji: gift.emoji,
          message: gift.message,
          timestamp: new Date().toISOString(),
        });
      }
      setSelectedGift(null);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setToastMessage(t("failedToSendGift"));
      setShowToast(true);
    }
  };

  if (!show) return null;

  return (
    <>
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                <h3 className="text-xl font-bold dark:text-white">{t("sendGift")}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-pink-50 rounded-xl dark:bg-pink-900/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("yourCoins")}</span>
                <span className="text-lg font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  {coins}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {GIFTS.map((gift) => {
                const affordable = canAfford(gift.price);
                return (
                  <motion.button
                    key={gift.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGift(gift)}
                    disabled={!affordable}
                    className={`p-4 rounded-2xl border-2 transition ${
                      affordable
                        ? "border-pink-200 hover:border-pink-400 bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:border-pink-500"
                        : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700"
                    }`}
                  >
                    <div className="text-4xl mb-2">{gift.emoji}</div>
                    <div className="text-xs font-semibold dark:text-white">{gift.name}</div>
                    <div className={`text-xs mt-1 ${affordable ? "text-pink-600 dark:text-pink-400" : "text-slate-400"}`}>
                      {gift.price} 💎
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {selectedGift && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-pink-50 rounded-xl dark:bg-pink-900/20"
              >
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">{selectedGift.emoji}</div>
                  <div className="font-bold text-lg dark:text-white">{selectedGift.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedGift.message}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendGift(selectedGift)}
                    className="flex-1 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition"
                  >
                    {t("sendGift")} ({selectedGift.price} 💎)
                  </button>
                  <button
                    onClick={() => setSelectedGift(null)}
                    className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 transition dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </motion.div>
            )}

            {coins < 10 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-xl dark:bg-yellow-900/20 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">{t("lowCoins")}</p>
                <a
                  href="/coins"
                  className="text-sm font-semibold text-yellow-700 underline dark:text-yellow-400"
                >
                  {t("buyCoins")}
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
