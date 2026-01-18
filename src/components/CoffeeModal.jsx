import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Heart, Sparkles, Eye, EyeOff } from "lucide-react";
import { COFFEE_PRESETS, createCoffeeOrder } from "../utils/coffee.js";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast.jsx";

export default function CoffeeModal({ creatorId, creatorName, show, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(5); // Quick amount buttons
  const quickAmounts = [3, 5, 10, 15, 25];

  const handleSelectPreset = (preset) => {
    setSelectedAmount(preset);
    setCustomAmount("");
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleQuickAmount = (amount) => {
    setSelectedQuickAmount(amount);
    setCustomAmount(amount.toString());
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (selectedAmount) return selectedAmount.amount;
    if (customAmount) {
      const amount = parseFloat(customAmount);
      return isNaN(amount) || amount < 1 ? null : amount;
    }
    return selectedQuickAmount || null;
  };

  const handleProceed = async () => {
    const amount = getFinalAmount();
    if (!amount || amount < 1) {
      setToastMessage(t("pleaseSelectAmount"));
      setShowToast(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create coffee order
      const order = createCoffeeOrder({
        creator_user_id: creatorId,
        amount,
        message: message.trim(),
        is_anonymous: isAnonymous,
      });

      if (order) {
        // Navigate to payment
        navigate(`/payment/coffee/${order.id}`);
        onClose();
      } else {
        setToastMessage(t("failedToCreateOrder"));
        setShowToast(true);
      }
    } catch (error) {
      console.error("Coffee order error:", error);
      setToastMessage(t("somethingWentWrong"));
      setShowToast(true);
    } finally {
      setIsProcessing(false);
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
        {show && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-white/20 dark:border-slate-800/20 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Coffee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xl font-bold dark:text-white">{t("buyCoffeeFor")} {creatorName}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                {t("selectAmount")}
              </label>
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mb-4">
                {quickAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAmount(amount)}
                    className={`flex-1 py-2 rounded-xl border-2 transition-all duration-300 ${
                      selectedQuickAmount === amount && !selectedAmount
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500"
                        : "border-slate-200 hover:border-amber-200 dark:border-slate-700 dark:hover:border-amber-700"
                    }`}
                  >
                    <span className={`font-bold ${
                      selectedQuickAmount === amount && !selectedAmount
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}>
                      ${amount}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {COFFEE_PRESETS.map((preset) => (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectPreset(preset)}
                    onMouseEnter={() => setIsHovered(preset.id)}
                    onMouseLeave={() => setIsHovered(null)}
                    disabled={isProcessing}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      selectedAmount?.id === preset.id
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500 shadow-lg"
                        : "border-slate-200 hover:border-amber-200 dark:border-slate-700 dark:hover:border-amber-700 hover:shadow-md"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {/* Hover effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered === preset.id ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="text-3xl mb-2"
                        animate={{ rotate: isHovered === preset.id ? [0, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {preset.emoji}
                      </motion.div>
                      <div className="font-bold text-lg dark:text-white">${preset.amount}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{preset.label}</div>
                      {preset.popular && (
                        <motion.div 
                          className="mt-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {t("popular")}
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  {t("orCustomAmount")}
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  placeholder="Enter amount ($)"
                  className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                {t("messageOptional")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("writeMessagePlaceholder")}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border min-h-[100px] bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                {message.length}/200
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition w-full ${
                  isAnonymous
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {isAnonymous ? (
                  <EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
                <span className={`text-sm font-medium ${isAnonymous ? "text-amber-700 dark:text-amber-300" : "text-slate-600 dark:text-slate-400"}`}>
                  {isAnonymous ? t("anonymousMode") : t("sendAnonymously")}
                </span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border bg-white hover:bg-slate-50 transition font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleProceed}
                disabled={!getFinalAmount() || isProcessing}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-600"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isProcessing ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Processing..." : `${t("proceedToPayment")} $${getFinalAmount()?.toFixed(2) || "0.00"}`}
                </motion.span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <Heart className="h-4 w-4 inline mr-1" />
              {t("coffeeDisclaimer")}
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
