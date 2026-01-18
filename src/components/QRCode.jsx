import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Download } from "lucide-react";

export default function QRCode({ url, size = 200, className = "", children }) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    // Generate QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    const timer = setTimeout(() => {
      setQrDataUrl(qrUrl);
    }, 0);
    return () => clearTimeout(timer);
  }, [url, size]);

  const handleAction = async () => {
    if (!qrDataUrl) return;

    try {
      // Fetch the image to create a blob for sharing
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], "aba-khqr.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "ABA KHQR Payment",
          text: "Scan to pay with ABA Mobile",
        });
      } else {
        // Fallback to download
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = "aba-khqr.png";
        link.click();
      }
    } catch (error) {
      console.error("Error sharing/downloading:", error);
      // Fallback if fetch fails (CORS might block it on some APIs, though qrserver is usually open)
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = "aba-khqr.png";
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <div className="relative">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="rounded-lg mix-blend-multiply dark:mix-blend-screen dark:invert"
            style={{ width: size, height: size }}
          />
        ) : (
          <div
            className="bg-slate-100 rounded-lg flex items-center justify-center animate-pulse"
            style={{ width: size, height: size }}
          >
            <QrCode className="h-10 w-10 text-slate-300" />
          </div>
        )}
        {/* Overlay children (e.g. Logos) */}
        {children && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {children}
          </div>
        )}
      </div>

      <button
        onClick={handleAction}
        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-lg hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
        disabled={!qrDataUrl}
      >
        <Download className="h-4 w-4" />
        {/* Check if share text is better but consistent Download QR is fine */}
        Download QR
      </button>
    </motion.div>
  );
}
