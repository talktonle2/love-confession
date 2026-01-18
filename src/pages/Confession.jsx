import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Container from "../components/Container.jsx";
import Toast from "../components/Toast.jsx";
import QRCode from "../components/QRCode.jsx";
import SocialShare from "../components/SocialShare.jsx";
import { getConfessionById, deleteConfession, updateConfession, toggleFavorite, isFavorite, incrementShares, incrementViews } from "../utils/storage.js";
import { Heart, Copy, Check, Trash2, Flame, Smile, Droplet, Laugh, Download, Image as ImageIcon, Star, Edit, Printer, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toPng } from 'html-to-image';

export default function Confession() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [userReactions, setUserReactions] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    const confession = getConfessionById(id);
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setItem(confession);
      // Increment view count
      if (confession) {
        incrementViews(id);
        // Update item with latest views
        const updated = getConfessionById(id);
        if (updated) {
          setItem(updated);
        }
      }
      // Check if user has already reacted (stored in sessionStorage)
      const reactionKey = `reaction_${id}`;
      const stored = sessionStorage.getItem(reactionKey);
      if (stored) {
        const reactions = JSON.parse(stored);
        setUserReactions(new Set(reactions));
        setHasLiked(reactions.includes("like"));
      }
      // Check favorite status
      setIsFavorited(isFavorite(id));
    }, 0);
    return () => clearTimeout(timer);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this confession?")) {
      const deleted = deleteConfession(id);
      if (deleted) {
        setToastMessage(t("confessionDeleted") + " ✅");
        setShowToast(true);
        setTimeout(() => {
          navigate("/feed");
        }, 1500);
      } else {
        setToastMessage("Failed to delete confession.");
        setShowToast(true);
      }
    }
  };

  const handleDownloadImage = async () => {
    if (cardRef.current === null) {
      return;
    }

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `confession-${id}.png`;
      link.href = dataUrl;
      link.click();
      setToastMessage(t("downloading") + " ✅");
      setShowToast(true);
    } catch (err) {
      console.error("Failed to download image", err);
      setToastMessage("Failed to generate image.");
      setShowToast(true);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!item) {
    return (
      <Container>
        <div className="rounded-3xl border bg-white p-6 dark:bg-slate-900 dark:border-slate-800">
          <div className="font-semibold dark:text-white">{t("confessionNotFound")}</div>
          <Link to="/feed" className="text-pink-700 hover:underline dark:text-pink-400">{t("backToFeed")}</Link>
        </div>
      </Container>
    );
  }

  const shareLink = `${window.location.origin}/c/${item.id}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
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

  const handleLike = () => {
    if (!item) return;
    if (hasLiked) {
      setToastMessage(t("alreadyLiked") + " ❤️");
      setShowToast(true);
      return;
    }
    const newLikes = (item.likes || 0) + 1;
    const updated = updateConfession(id, { likes: newLikes });
    if (updated) {
      setItem({ ...item, likes: newLikes });
      setHasLiked(true);
      const reactionKey = `reaction_${id}`;
      const reactions = [...userReactions, "like"];
      setUserReactions(new Set(reactions));
      sessionStorage.setItem(reactionKey, JSON.stringify(reactions));
      setToastMessage(t("liked") + " ❤️");
      setShowToast(true);
    }
  };

  const handleReaction = (reactionType) => {
    if (!item) return;
    if (userReactions.has(reactionType)) {
      setToastMessage(t("alreadyReacted") + " 😊");
      setShowToast(true);
      return;
    }
    const currentReactions = item.reactions || { heart: 0, wow: 0, laugh: 0, cry: 0, fire: 0 };
    const newReactions = {
      ...currentReactions,
      [reactionType]: (currentReactions[reactionType] || 0) + 1,
    };
    const updated = updateConfession(id, { reactions: newReactions });
    if (updated) {
      setItem({ ...item, reactions: newReactions });
      const newUserReactions = new Set([...userReactions, reactionType]);
      setUserReactions(newUserReactions);
      const reactionKey = `reaction_${id}`;
      sessionStorage.setItem(reactionKey, JSON.stringify([...newUserReactions]));
      setToastMessage(t("reactionAdded") + " 😊");
      setShowToast(true);
    }
  };

  const reactionIcons = [
    { key: "heart", Icon: Heart, color: "text-red-500", label: "Heart" },
    { key: "wow", Icon: Smile, color: "text-yellow-500", label: "Wow" },
    { key: "laugh", Icon: Laugh, color: "text-blue-500", label: "Laugh" },
    { key: "cry", Icon: Droplet, color: "text-cyan-500", label: "Cry" },
    { key: "fire", Icon: Flame, color: "text-orange-500", label: "Fire" },
  ];

  return (
    <>
      <Toast
        message={toastMessage || t("copied") + " ✅"}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Container>
        <div ref={cardRef} className="rounded-[2rem] border bg-white shadow-sm p-7 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">📅 {item.createdAt}</div>
              <h2 className="text-2xl font-bold mt-1 dark:text-white">{item.category}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition font-medium text-xs dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                disabled={isDownloading}
              >
                {isDownloading ? <span className="animate-spin">⌛</span> : <ImageIcon className="h-4 w-4" />}
                {t("downloadImage")}
              </button>
            </div>
          </div>

          <p className="mt-5 text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            {item.message}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-slate-700 dark:text-slate-300">
            <span className="px-3 py-1 rounded-full bg-pink-50 border dark:bg-slate-800 dark:border-slate-700">
              <b>{t("to")}:</b> {item.to}
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border dark:bg-slate-800 dark:border-slate-700">
              <b>{t("from")}:</b> {item.from}
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border inline-flex items-center gap-2 dark:bg-slate-800 dark:border-slate-700">
              <Heart className="h-4 w-4" /> {t("likes")}: {item.likes || 0}
            </span>
            {item.views > 0 && (
              <span className="px-3 py-1 rounded-full bg-pink-50 border inline-flex items-center gap-2 dark:bg-slate-800 dark:border-slate-700">
                <Eye className="h-4 w-4" /> {t("views")}: {item.views || 0}
              </span>
            )}
          </div>

          {/* Hidden element for consistent image capture background if needed, but here we capture the main card */}
        </div>

        {/* Actions outside the capture area */}
        <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={copy}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border bg-white hover:bg-pink-50 transition font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
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
              onClick={() => {
                const added = toggleFavorite(id);
                setIsFavorited(added);
                setToastMessage(added ? t("addedToFavorites") + " ⭐" : t("removedFromFavorites"));
                setShowToast(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition font-medium ${
                isFavorited
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
              }`}
            >
              <Star className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} /> {t("favorite")}
            </button>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  setEditMessage(item.message);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border bg-white hover:bg-blue-50 transition font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
            >
              <Edit className="h-4 w-4" /> {t("edit")}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border bg-white hover:bg-purple-50 transition font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" /> {t("print")}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-red-200 bg-white text-red-600 hover:bg-red-50 transition font-medium dark:bg-slate-900 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" /> {t("delete")}
            </button>
          </div>
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="mt-4 rounded-2xl border bg-blue-50 p-4 dark:bg-blue-900/20 dark:border-blue-800">
            <textarea
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border min-h-[120px] dark:bg-slate-800 dark:border-slate-700 dark:text-white mb-3"
              placeholder={t("message")}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const updated = updateConfession(id, { message: editMessage });
                  if (updated) {
                    setItem({ ...item, message: editMessage });
                    setIsEditing(false);
                    setToastMessage(t("confessionUpdated") + " ✅");
                    setShowToast(true);
                  }
                }}
                className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
              >
                {t("save")}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditMessage("");
                }}
                className="px-4 py-2 rounded-2xl border bg-white hover:bg-slate-50 transition font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-5 bg-gradient-to-br from-pink-50 to-white rounded-2xl border dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 dark:text-slate-300">{t("showSupport")}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-medium ${hasLiked
                ? "bg-pink-100 text-pink-700 border-pink-300 cursor-not-allowed dark:bg-slate-700 dark:text-pink-300 dark:border-slate-600"
                : "bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 dark:bg-slate-800 dark:text-pink-400 dark:border-slate-600 dark:hover:bg-slate-700"
                }`}
            >
              <Heart className={`h-5 w-5 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
              {t("likes")} ({item.likes || 0})
            </motion.button>
            {reactionIcons.map(({ key, Icon, color, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReaction(key)}
                disabled={userReactions.has(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-medium ${userReactions.has(key)
                  ? "bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400"
                  : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  } ${color}`}
                title={label}
              >
                <Icon className="h-5 w-5" />
                {item.reactions?.[key] || 0}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 dark:text-white">{t("shareSocial")}</h3>
                      <SocialShare
                        url={shareLink}
                        title={`${item.category} - Love Confession`}
                        message={item.message.substring(0, 100) + "..."}
                        onShare={() => {
                          incrementShares(id);
                          const updated = getConfessionById(id);
                          if (updated) setItem(updated);
                        }}
                      />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 dark:text-white">{t("qrCode")}</h3>
            <QRCode url={shareLink} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl dark:bg-slate-800">
          <div className="text-xs font-medium text-slate-600 mb-2 dark:text-slate-400">{t("shareUrl")}:</div>
          <div className="text-sm text-slate-700 break-all font-mono dark:text-slate-300">{shareLink}</div>
        </div>

      </Container>
    </>
  );
}
