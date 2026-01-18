import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Calendar, DollarSign, FileText } from "lucide-react";
import { MIN_PROJECT_DEPOSIT, createProjectRequest, createCoffeeOrder } from "../utils/coffee.js";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast.jsx";

export default function ProjectRequestForm({ creatorId, show, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    includeDeposit: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setToastMessage(t("pleaseFillRequiredFields"));
      setShowToast(true);
      return;
    }

    let depositOrderId = null;
    
    // Create deposit order if needed
    if (formData.includeDeposit) {
      const depositOrder = createCoffeeOrder({
        creator_user_id: creatorId,
        amount: MIN_PROJECT_DEPOSIT,
        message: `Project deposit: ${formData.title}`,
        is_anonymous: false,
      });
      
      if (depositOrder) {
        depositOrderId = depositOrder.id;
        // Navigate to payment first
        navigate(`/payment/coffee/${depositOrder.id}?return=project`);
        onClose();
        return;
      }
    }

    // Create project request
    const request = createProjectRequest({
      creator_user_id: creatorId,
      title: formData.title,
      description: formData.description,
      budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
      budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
      deadline_at: formData.deadline || null,
      deposit_coffee_order_id: depositOrderId,
    });

    if (request) {
      setToastMessage(t("projectRequestCreated"));
      setShowToast(true);
      setTimeout(() => {
        onClose();
        setFormData({
          title: "",
          description: "",
          budget_min: "",
          budget_max: "",
          deadline: "",
          includeDeposit: false,
        });
      }, 1500);
    } else {
      setToastMessage(t("failedToCreateRequest"));
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
            className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold dark:text-white">{t("requestProject")}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  {t("projectTitle")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t("projectTitlePlaceholder")}
                  required
                  className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  {t("projectDescription")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("projectDescriptionPlaceholder")}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {t("budgetMin")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                    placeholder="$0"
                    className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {t("budgetMax")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                    placeholder="$0"
                    className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t("deadline")} ({t("optional")})
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeDeposit}
                    onChange={(e) => setFormData({ ...formData, includeDeposit: e.target.checked })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-1">
                      <Coffee className="h-4 w-4" />
                      {t("includeDeposit")} (${MIN_PROJECT_DEPOSIT})
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-400">
                      {t("depositDescription")}
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border bg-white hover:bg-slate-50 transition font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                >
                  {t("submitRequest")}
                </button>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {t("projectRequestDisclaimer")}
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
