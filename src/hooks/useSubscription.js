import { useState, useEffect } from "react";

export function useSubscription() {
    const [plan, setPlan] = useState("free"); // "free" | "monthly" | "yearly"
    const [isLoading, setIsLoading] = useState(true);
    const [likesToday, setLikesToday] = useState(0);
    const MAX_LIKES_MONTHLY = 20;

    const checkStatus = () => {
        try {
            const status = localStorage.getItem("sub_status");
            const expires = localStorage.getItem("sub_expires");
            const planType = localStorage.getItem("sub_plan") || "free";

            if (status === "paid" && expires) {
                if (new Date(expires) > new Date()) {
                    setPlan(planType);
                } else {
                    // Expired
                    setPlan("free");
                    localStorage.setItem("sub_status", "expired");
                    localStorage.removeItem("sub_plan");
                }
            } else {
                setPlan("free");
            }

            // Load likes today
            const today = new Date().toDateString();
            const likesData = localStorage.getItem("likes_today");
            if (likesData) {
                const parsed = JSON.parse(likesData);
                if (parsed.date === today) {
                    setLikesToday(parsed.count || 0);
                } else {
                    setLikesToday(0);
                    localStorage.setItem("likes_today", JSON.stringify({ date: today, count: 0 }));
                }
            }
        } catch (e) {
            console.error("Failed to check subscription", e);
            setPlan("free");
        } finally {
            setIsLoading(false);
        }
    };

    const incrementLike = () => {
        if (plan === "monthly") {
            const today = new Date().toDateString();
            const likesData = localStorage.getItem("likes_today");
            let parsed = { date: today, count: 0 };
            if (likesData) {
                parsed = JSON.parse(likesData);
                if (parsed.date !== today) {
                    parsed = { date: today, count: 0 };
                }
            }
            parsed.count = (parsed.count || 0) + 1;
            localStorage.setItem("likes_today", JSON.stringify(parsed));
            setLikesToday(parsed.count);
            return parsed.count <= MAX_LIKES_MONTHLY;
        }
        return true; // Yearly and free (free has other limits)
    };

    const canLike = () => {
        if (plan === "yearly") return true;
        if (plan === "monthly") return likesToday < MAX_LIKES_MONTHLY;
        return false; // Free users can't like in match
    };

    const canChat = () => {
        return plan === "monthly" || plan === "yearly";
    };

    const canMatch = () => {
        return plan === "monthly" || plan === "yearly";
    };

    const canSeeWhoLikedYou = () => {
        return plan === "yearly";
    };

    const hasUnlimitedLikes = () => {
        return plan === "yearly";
    };

    const canUseAdvancedFilters = () => {
        return plan === "yearly";
    };

    const hasVipBadge = () => {
        return plan === "yearly";
    };

    const canUseTemplates = () => {
        return plan === "monthly" || plan === "yearly";
    };

    // Check if dark mode is allowed (Monthly or Yearly)
    const isDarkModeAllowed = () => {
        return plan === "monthly" || plan === "yearly";
    };

    useEffect(() => {
        checkStatus();
        // Listen for storage changes in case payment happens in another tab/window
        window.addEventListener("storage", checkStatus);
        window.addEventListener("subscriptionUpdated", checkStatus);
        return () => {
            window.removeEventListener("storage", checkStatus);
            window.removeEventListener("subscriptionUpdated", checkStatus);
        };
    }, []);

    return {
        plan,
        isPro: plan !== "free",
        isMonthly: plan === "monthly",
        isYearly: plan === "yearly",
        isLoading,
        likesToday,
        maxLikesMonthly: MAX_LIKES_MONTHLY,
        canLike,
        canChat,
        canMatch,
        canSeeWhoLikedYou,
        hasUnlimitedLikes,
        canUseAdvancedFilters,
        hasVipBadge,
        canUseTemplates,
        isDarkModeAllowed,
        incrementLike,
        recheck: checkStatus,
    };
}
