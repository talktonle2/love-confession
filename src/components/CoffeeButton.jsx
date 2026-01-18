import { useState } from "react";
import { Coffee } from "lucide-react";
import { useTranslation } from "react-i18next";
import CoffeeModal from "./CoffeeModal.jsx";

export default function CoffeeButton({ creatorId, creatorName, variant = "default" }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  if (variant === "small") {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition text-sm font-medium dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
        >
          <Coffee className="h-4 w-4" />
          {t("buyCoffee")}
        </button>
        <CoffeeModal
          creatorId={creatorId}
          creatorName={creatorName}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition shadow-md"
      >
        <Coffee className="h-5 w-5" />
        {t("buyCoffee")}
      </button>
      <CoffeeModal
        creatorId={creatorId}
        creatorName={creatorName}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
