import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MapPin, Sparkles, RefreshCcw, AlertCircle, Zap, TrendingUp, Filter, Check } from "lucide-react";
import Container from "../components/Container.jsx";
import { datingProfiles } from "../utils/mockData.js";
import { useSubscription } from "../hooks/useSubscription.js";
import { Link, useNavigate } from "react-router-dom";
import FeatureLock from "../components/FeatureLock.jsx";
import Toast from "../components/Toast.jsx";
import { calculateCompatibility, createUserProfile } from "../utils/smartMatch.js";

export default function Match() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { canMatch, canLike, incrementLike, likesToday, maxLikesMonthly, plan, isYearly, canUseAdvancedFilters } = useSubscription();
    const [profiles, setProfiles] = useState(datingProfiles);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [ageRange, setAgeRange] = useState([18, 30]);
    const [maxDistance, setMaxDistance] = useState(50);
    const [gender, setGender] = useState("All");

    // Mock current user profile
    const currentUserProfile = useMemo(() => createUserProfile({
        id: "current_user",
        name: "You",
        age: 24,
        bio: "Love coffee and traveling",
        interests: ["travel", "music", "coffee", "technology"],
        activityLevel: 4,
    }), []);

    // Calculate compatibility for current profile
    const currentProfile = profiles[profiles.length - 1];

    if (!canMatch()) {
        return (
            <Container>
                <FeatureLock feature={t("matchDating")} />
            </Container>
        );
    }

    const openFilters = () => {
        if (!canUseAdvancedFilters()) {
            navigate("/subscription");
            return;
        }
        setShowFilters(true);
    };

    const applyFilters = () => {
        // Mock filtering logic - effectively just closes modal since data is mock
        setShowFilters(false);
        setToastMessage(t("filtersApplied"));
        setShowToast(true);
        // Reset profiles to simulate refresh with new filters
        setProfiles(datingProfiles);
    };

    const swipe = (direction) => {
        if (direction === "right") {
            // Check like limit for monthly users
            if (!canLike()) {
                setToastMessage(t("likeLimitReached") + ` (${likesToday}/${maxLikesMonthly})`);
                setShowToast(true);
                return;
            }

            // Increment like count
            const canContinue = incrementLike();
            if (!canContinue) {
                setToastMessage(t("likeLimitReached"));
                setShowToast(true);
                return;
            }

            // Mock Match Logic (50% chance)
            if (Math.random() > 0.5) {
                setMatchedProfile(currentProfile);
                setShowMatch(true);
            }
        }

        // Remove card after delay
        setTimeout(() => {
            setProfiles((prev) => prev.slice(0, -1));
        }, 200);
    };

    const reset = () => {
        setProfiles(datingProfiles);
    };

    return (
        <Container>
            <Toast
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
            />

            {/* Advanced Filters Modal */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-md p-6 dark:bg-slate-900 dark:border dark:border-slate-800"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-yellow-500" />
                                    {t("advancedFilters")}
                                </h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800">
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        {t("ageRange")}: {ageRange[0]} - {ageRange[1]}
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="range"
                                            min="18" max="50"
                                            value={ageRange[0]}
                                            onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                                            className="w-full accent-pink-600"
                                        />
                                        <input
                                            type="range"
                                            min="18" max="50"
                                            value={ageRange[1]}
                                            onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                                            className="w-full accent-pink-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        {t("maxDistance")}: {maxDistance} km
                                    </label>
                                    <input
                                        type="range"
                                        min="1" max="100"
                                        value={maxDistance}
                                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                                        className="w-full accent-pink-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        {t("gender")}
                                    </label>
                                    <div className="flex gap-2">
                                        {["All", "Male", "Female", "Non-binary"].map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setGender(g)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${gender === g
                                                        ? "bg-pink-600 text-white"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={applyFilters}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:shadow-lg transition"
                                >
                                    {t("applyFilters")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {plan === "monthly" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center gap-2 text-sm dark:bg-yellow-900/20 dark:border-yellow-800">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-300">
                        {t("likesRemaining")}: {Math.max(0, maxLikesMonthly - likesToday)}/{maxLikesMonthly}
                    </span>
                    {likesToday >= maxLikesMonthly * 0.8 && (
                        <button
                            onClick={() => navigate("/subscription")}
                            className="ml-auto text-xs text-yellow-700 underline dark:text-yellow-400"
                        >
                            {t("upgradeForUnlimited")}
                        </button>
                    )}
                </div>
            )}

            {/* Header Controls */}
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-2xl font-bold dark:text-white tracking-tight">Discover</h2>
                <button
                    onClick={openFilters}
                    className={`p-2.5 rounded-full border transition relative ${canUseAdvancedFilters()
                            ? "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                            : "bg-slate-100 text-slate-400 border-transparent dark:bg-slate-900"
                        }`}
                >
                    <Filter className="h-5 w-5" />
                    {!canUseAdvancedFilters() && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-white dark:border-slate-900">
                            <Sparkles className="h-3 w-3 text-white" />
                        </div>
                    )}
                </button>
            </div>

            <div className="relative w-full max-w-sm mx-auto h-[600px] flex flex-col items-center justify-center">

                {/* Match Modal */}
                <AnimatePresence>
                    {showMatch && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-3xl"
                        >
                            <div className="text-center text-white p-6">
                                <h2 className="text-4xl font-extrabold text-pink-500 mb-2 italic">It&apos;s a Match!</h2>
                                <p className="mb-6 text-lg">You and {matchedProfile?.name} liked each other.</p>
                                <div className="flex gap-4 justify-center">
                                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" className="w-20 h-20 rounded-full border-4 border-white object-cover" />
                                    <img src={matchedProfile?.image} className="w-20 h-20 rounded-full border-4 border-pink-500 object-cover" />
                                </div>
                                <div className="mt-8 flex flex-col gap-3">
                                    <Link to="/chat" className="bg-pink-600 text-white py-3 px-8 rounded-full font-bold">Send a Message</Link>
                                    <button onClick={() => setShowMatch(false)} className="text-slate-300">Keep Swiping</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {profiles.length > 0 ? (
                        profiles.map((profile, index) => {
                            const isActive = index === profiles.length - 1;
                            const profileCompatibility = isActive && isYearly
                                ? calculateCompatibility(currentUserProfile, createUserProfile(profile))
                                : null;
                            return (
                                <Card
                                    key={profile.id}
                                    profile={profile}
                                    active={isActive}
                                    onSwipe={swipe}
                                    compatibility={profileCompatibility}
                                    isYearly={isYearly}
                                />
                            );
                        })
                    ) : (
                        <div className="text-center p-8">
                            <div className="bg-pink-100 dark:bg-slate-800 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-10 w-10 text-pink-500" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">No more profiles!</h3>
                            <p className="text-slate-500 mt-2 mb-6 dark:text-slate-400">Come back later or reset to see them again.</p>
                            <button onClick={reset} className="flex items-center gap-2 mx-auto bg-white border px-6 py-3 rounded-full hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                                <RefreshCcw className="h-4 w-4" /> Start Over
                            </button>
                        </div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                {profiles.length > 0 && !showMatch && (
                    <div className="absolute bottom-4 flex items-center gap-6 z-40">
                        <button
                            onClick={() => swipe("left")}
                            className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 border hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition active:scale-95 dark:bg-slate-800 dark:border-slate-700"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <button
                            onClick={() => swipe("right")}
                            className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 shadow-xl shadow-pink-200 flex items-center justify-center text-white hover:scale-110 transition active:scale-95 dark:shadow-none"
                        >
                            <Heart className="h-8 w-8 fill-white" />
                        </button>
                    </div>
                )}

            </div>
            {plan === "monthly" && profiles.length > 0 && (
                <div className="text-center mt-4 text-xs text-slate-400">
                    {likesToday}/{maxLikesMonthly} {t("likesToday")} ({t("monthlyPlan")})
                </div>
            )}
        </Container>
    );
}

function Card({ profile, active, onSwipe, compatibility, isYearly }) {
    if (!active) return null; // Simple stack for now, can be improved

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
                const swipeConfidenceThreshold = 100;
                if (offset.x > swipeConfidenceThreshold) {
                    onSwipe("right");
                } else if (offset.x < -swipeConfidenceThreshold) {
                    onSwipe("left");
                }
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: 0, opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="absolute top-0 w-full h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border dark:bg-slate-900 dark:border-slate-800"
        >
            <div className="relative h-3/4">
                <img src={profile.image} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-3xl font-bold flex items-center gap-2">
                            {profile.name}, {profile.age}
                            {active && <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-black" title="Online"></span>}
                        </h3>
                        {isYearly && compatibility && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                                <TrendingUp className="h-4 w-4" />
                                <span className="font-bold text-sm">{compatibility.score}%</span>
                                <span>{compatibility.emoji}</span>
                            </div>
                        )}
                    </div>
                    {isYearly && compatibility && (
                        <div className="text-xs text-white/90 mb-1">
                            {compatibility.level.charAt(0).toUpperCase() + compatibility.level.slice(1)} Match
                        </div>
                    )}
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 dark:text-slate-400">
                    <MapPin className="h-4 w-4" /> {profile.distance}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-3">
                    {profile.bio}
                </p>
                {isYearly && compatibility && compatibility.factors.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Why you match:
                        </div>
                        <div className="space-y-1">
                            {compatibility.factors.slice(0, 2).map((factor, idx) => (
                                <div key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                                    • {factor.name}: {factor.details}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
