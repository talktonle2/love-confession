import { Share2, Facebook, Twitter, MessageCircle, Linkedin, Mail, Link2 } from "lucide-react";

export default function SocialShare({ url, title, message, onShare }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message || "Check out this love confession!");
  const encodedTitle = encodeURIComponent(title || "Love Confession");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`,
    whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedMessage}%20${encodedUrl}`,
  };

  const handleShare = async (platform) => {
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: message,
          url: url,
        });
        if (onShare) onShare();
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else if (shareLinks[platform]) {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
      if (onShare) onShare();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {navigator.share && (
        <button
          onClick={() => handleShare("native")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-pink-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
          title="Share via native sharing"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      )}
      <button
        onClick={() => handleShare("facebook")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-blue-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-blue-900/30"
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        Facebook
      </button>
      <button
        onClick={() => handleShare("twitter")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-sky-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-sky-900/30"
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4 text-sky-500 dark:text-sky-400" />
        Twitter
      </button>
      <button
        onClick={() => handleShare("whatsapp")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-green-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-green-900/30"
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        WhatsApp
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-blue-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-blue-900/30"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        LinkedIn
      </button>
      <button
        onClick={() => handleShare("email")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
        title="Share via email"
      >
        <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        Email
      </button>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            if (onShare) onShare();
          } catch (err) {
            console.error("Failed to copy:", err);
          }
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 transition text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
        title="Copy link to clipboard"
      >
        <Link2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        Copy Link
      </button>
    </div>
  );
}
