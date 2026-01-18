import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { Check, Star, X, Lock, Crown, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSubscription } from "../hooks/useSubscription.js";

export default function Subscription() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { plan } = useSubscription();

    const plans = [
        {
            id: "free",
            price: "0$",
            label: t("freePlan"),
            period: "Forever",
            popular: false,
            features: {
                confessions: true,
                shareLink: true,
                viewFeed: true,
                chat: false,
                match: false,
                darkMode: false,
                templates: false,
                unlimitedLikes: false,
                seeWhoLiked: false,
                advancedFilters: false,
                profileHighlight: false,
            },
            limits: {
                likesPerDay: 0,
                chatMessages: 0,
            }
        },
        {
            id: "monthly",
            price: "1$",
            label: t("monthlyPlan"),
            period: "Month",
            popular: false,
            features: {
                confessions: true,
                shareLink: true,
                viewFeed: true,
                chat: true,
                match: true,
                darkMode: true,
                templates: true,
                unlimitedLikes: false,
                seeWhoLiked: false,
                advancedFilters: false,
                profileHighlight: false,
            },
            limits: {
                likesPerDay: 20,
                chatMessages: -1, // unlimited
            }
        },
        {
            id: "yearly",
            price: "5$",
            label: t("yearlyPlan"),
            period: "Year",
            popular: true,
            savePercent: 60,
            features: {
                confessions: true,
                shareLink: true,
                viewFeed: true,
                chat: true,
                match: true,
                darkMode: true,
                templates: true,
                unlimitedLikes: true,
                seeWhoLiked: true,
                advancedFilters: true,
                profileHighlight: true,
            },
            limits: {
                likesPerDay: -1, // unlimited
                chatMessages: -1, // unlimited
            }
        },
    ];

    const handleSelect = (planId) => {
        if (planId === plan) return; // Already on this plan
        if (planId === "free") {
            // Can't really downgrade automatically in this demo without more logic, 
            // but let's just redirect home if they select free while being free.
            navigate("/");
            return;
        }
        navigate(`/payment/${planId}`);
    };

    return (
        <Container>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3 dark:text-white">{t("choosePlan")}</h2>
                <p className="text-slate-600 dark:text-slate-400">{t("unlockFeatures")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((p) => {
                    const isCurrent = plan === p.id;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: plans.indexOf(p) * 0.1 }}
                            className={`relative rounded-3xl border-2 p-8 flex flex-col h-full bg-white dark:bg-slate-900 ${isCurrent
                                    ? "border-green-500 shadow-2xl shadow-green-100 dark:shadow-none dark:border-green-500 ring-2 ring-green-500 ring-offset-2 dark:ring-offset-slate-900"
                                    : p.popular
                                        ? "border-pink-500 shadow-2xl shadow-pink-100 dark:shadow-none dark:border-pink-500 scale-105"
                                        : "border-slate-200 hover:border-pink-200 shadow-sm dark:border-slate-800 dark:hover:border-slate-700"
                                }`}
                        >
                            {p.popular && !isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg z-10">
                                    <Sparkles className="h-3 w-3 fill-white" /> {t("bestValue")}
                                </div>
                            )}

                            {isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg z-10">
                                    <Check className="h-3 w-3" /> {t("currentPlan")}
                                </div>
                            )}

                            {p.savePercent && !isCurrent && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {t("savePercent")} {p.savePercent}%
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{p.label}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{p.price}</span>
                                    <span className="text-slate-500 text-sm">/{p.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.confessions ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.confessions ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"}>
                                        {t("writeConfessions")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.shareLink ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.shareLink ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"}>
                                        {t("shareLinkQR")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.viewFeed ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.viewFeed ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"}>
                                        {t("viewPublicFeed")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.chat ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.chat ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>
                                        {t("chatMessenger")} {p.features.chat ? "" : `(${t("locked")})`}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.match ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.match ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>
                                        {t("matchDating")} {p.features.match ? "" : `(${t("locked")})`}
                                    </span>
                                </li>
                                {p.features.match && (
                                    <li className="flex items-start gap-3 text-sm pl-8">
                                        {p.limits.likesPerDay === -1 ? (
                                            <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <span className="text-xs text-slate-500">•</span>
                                        )}
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {p.limits.likesPerDay === -1
                                                ? t("unlimitedLikes")
                                                : `${p.limits.likesPerDay} ${t("likesPerDay")}`}
                                        </span>
                                    </li>
                                )}
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.darkMode ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.darkMode ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>
                                        {t("darkMode")} {p.features.darkMode ? "" : `(${t("locked")})`}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    {p.features.templates ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={p.features.templates ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>
                                        {t("templates")} {p.features.templates ? "" : `(${t("locked")})`}
                                    </span>
                                </li>
                                {p.features.seeWhoLiked && (
                                    <li className="flex items-start gap-3 text-sm">
                                        <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                                            {t("seeWhoLikedYou")} ⭐
                                        </span>
                                    </li>
                                )}
                                {p.features.advancedFilters && (
                                    <li className="flex items-start gap-3 text-sm">
                                        <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                                            {t("advancedFilters")} ⭐
                                        </span>
                                    </li>
                                )}
                                {p.features.profileHighlight && (
                                    <li className="flex items-start gap-3 text-sm">
                                        <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                                            {t("profileHighlight")} 👑
                                        </span>
                                    </li>
                                )}
                            </ul>

                            <button
                                onClick={() => handleSelect(p.id)}
                                disabled={isCurrent}
                                className={`w-full py-3.5 rounded-2xl font-bold text-center transition ${isCurrent
                                        ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/20 dark:text-green-400"
                                        : p.popular
                                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg shadow-md"
                                            : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                                    }`}
                            >
                                {isCurrent ? t("currentPlan") : t("upgradeToPro")}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </Container>
    );
}
