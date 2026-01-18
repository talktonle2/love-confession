import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Heart, Home, UserPlus, MessageCircle, PenLine, Rss, Star, BarChart3, Eye, Search, Bell, User, Settings, Sun, Moon, LogOut, Menu, X, Sparkles, Crown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import { useSubscription } from "../hooks/useSubscription.js";
import { useCoins } from "../hooks/useCoins.js";
import { motion, AnimatePresence } from "framer-motion";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 flex flex-col items-center justify-center gap-1 min-w-[60px] backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/30 shadow-lg ${isActive
    ? "bg-gradient-to-r from-pink-100/80 to-pink-200/80 text-pink-700 dark:from-slate-800/80 dark:to-slate-700/80 dark:text-pink-200 shadow-xl border-pink-400/30 dark:border-pink-600/30"
    : "hover:bg-white/70 dark:hover:bg-slate-800/70 hover:shadow-xl hover:border-pink-200/50 dark:hover:border-pink-700/50"
  }`;

const mobileNavClass = ({ isActive }) =>
  `w-full px-4 py-3 text-left rounded-xl font-medium transition-all duration-300 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/30 shadow-lg ${isActive
    ? "bg-gradient-to-r from-pink-100/80 to-pink-200/80 text-pink-700 dark:from-slate-800/80 dark:to-slate-700/80 dark:text-pink-200 shadow-xl border-pink-400/30 dark:border-pink-600/30"
    : "hover:bg-white/70 dark:hover:bg-slate-800/70 hover:shadow-xl hover:border-pink-200/50 dark:hover:border-pink-700/50"
  }`;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { isPro, canSeeWhoLikedYou, isDarkModeAllowed } = useSubscription();
  const { coins } = useCoins();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  const toggleTheme = () => {
    if (!isDarkModeAllowed()) {
      navigate("/subscription");
      return;
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const clearNotifications = () => {
    setNotifications(0);
  };

  // Handle escape key to close mobile menu
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [isMobileMenuOpen]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, handleKeyDown]);

  // Add swipe gesture support for mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    };

    const handleSwipeGesture = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      // Swipe right to open menu (from left edge)
      if (diff < -swipeThreshold && touchStartX < 50) {
        setIsMobileMenuOpen(true);
      }
      // Swipe left to close menu
      else if (diff > swipeThreshold && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 dark:bg-slate-950/30 border border-white/20 dark:border-slate-800/20 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2 font-semibold dark:text-white">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 dark:from-slate-800 dark:to-slate-700 shadow-lg backdrop-blur-sm border border-pink-200/50 dark:border-pink-800/50">
                <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </span>
              <span className="text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t("appName")}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
              <NavLink to="/" className={navClass} title="Home">
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Home</span>
              </NavLink>
              <NavLink to="/match" className={navClass} title="Match">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Match</span>
              </NavLink>
              <NavLink to="/chat" className={navClass} title="Chat">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Chat</span>
              </NavLink>
              <NavLink to="/create" className={navClass} title="Create">
                <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Create</span>
              </NavLink>
              <NavLink to="/feed" className={navClass} title="Feed">
                <Rss className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Feed</span>
              </NavLink>
              <NavLink to="/favorites" className={navClass} title="Favorites">
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Favorites</span>
              </NavLink>
              <NavLink to="/statistics" className={navClass} title="Statistics">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs">Stats</span>
              </NavLink>
              {canSeeWhoLikedYou() && (
                <NavLink to="/who-liked-you" className={navClass} title="Who Liked You">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline text-xs">Likes</span>
                </NavLink>
              )}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                title="Search"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Notifications */}
              <button
                onClick={clearNotifications}
                className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                title={`Notifications${notifications > 0 ? ` (${notifications})` : ''}`}
                aria-label={`Notifications${notifications > 0 ? ` (${notifications})` : ''}`}
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    aria-label={`${notifications} unread notifications`}
                  >
                    {notifications}
                  </motion.span>
                )}
              </button>

              {/* Profile Dropdown or Login Button */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 flex items-center gap-2"
                    title="Profile"
                    aria-label="Profile menu"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 shadow-lg z-50"
                      >
                        <div className="p-2">
                          <div className="px-3 py-2 border-b dark:border-slate-800 mb-2">
                            <p className="font-bold text-sm truncate dark:text-white">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span className="text-sm">Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">Settings</span>
                          </Link>
                          <button
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left"
                            onClick={() => {
                              // Cycle through themes
                              const themes = ['light', 'dark', 'auto'];
                              const currentIndex = themes.indexOf(theme);
                              const nextIndex = (currentIndex + 1) % themes.length;
                              setTheme(themes[nextIndex]);
                              setIsProfileOpen(false);
                            }}
                          >
                            {theme === 'light' && <Sun className="h-4 w-4" />}
                            {theme === 'dark' && <Moon className="h-4 w-4" />}
                            {theme === 'auto' && <Settings className="h-4 w-4" />}
                            <span className="text-sm">Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                          </button>
                          <hr className="my-2 dark:border-slate-700" />
                          <button
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left text-red-600 dark:text-red-400"
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Login
                </Link>
              )}

              <Link
                to="/coins"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                title={t("yourCoins")}
              >
                <Sparkles className="h-3 w-3" />
                <span>{coins}</span>
              </Link>

              <select
                defaultValue={localStorage.getItem("lang") || "km"}
                onChange={(e) => setLang(e.target.value)}
                className="px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 text-sm hover:border-pink-300 transition-colors"
                title={t("language")}
                aria-label={t("language")}
              >
                <option value="km">KM</option>
                <option value="en">EN</option>
              </select>

              {isPro ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold shadow-sm">
                  <Crown className="h-3 w-3 fill-white" /> PRO
                </div>
              ) : (
                <Link
                  to="/subscription"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-semibold dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 hover:shadow-sm"
                >
                  <Crown className="h-3 w-3 text-yellow-500" /> {t("upgradeToPro")}
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 dark:text-white dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-sm"
                title={t("darkMode")}
                aria-label={t("darkMode")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/20 dark:border-slate-800/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="max-w-5xl mx-auto px-4 py-4 space-y-2">
                <NavLink to="/" className={mobileNavClass} onClick={closeMobileMenu}>
                  <Home className="h-5 w-5" /> Home
                </NavLink>
                <NavLink to="/match" className={mobileNavClass} onClick={closeMobileMenu}>
                  <UserPlus className="h-5 w-5" /> Match
                </NavLink>
                <NavLink to="/chat" className={mobileNavClass} onClick={closeMobileMenu}>
                  <MessageCircle className="h-5 w-5" /> Chat
                </NavLink>
                <NavLink to="/create" className={mobileNavClass} onClick={closeMobileMenu}>
                  <PenLine className="h-5 w-5" /> Create
                </NavLink>
                <NavLink to="/feed" className={mobileNavClass} onClick={closeMobileMenu}>
                  <Rss className="h-5 w-5" /> Feed
                </NavLink>
                <NavLink to="/favorites" className={mobileNavClass} onClick={closeMobileMenu}>
                  <Star className="h-5 w-5" /> Favorites
                </NavLink>
                <NavLink to="/statistics" className={mobileNavClass} onClick={closeMobileMenu}>
                  <BarChart3 className="h-5 w-5" /> Statistics
                </NavLink>
                {canSeeWhoLikedYou() && (
                  <NavLink to="/who-liked-you" className={mobileNavClass} onClick={closeMobileMenu}>
                    <Eye className="h-5 w-5" /> Who Liked You
                  </NavLink>
                )}

                {/* Mobile Controls */}
                <div className="pt-4 border-t dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/coins"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold shadow-sm"
                      onClick={closeMobileMenu}
                    >
                      <Sparkles className="h-4 w-4" />
                      {coins} Coins
                    </Link>

                    <select
                      defaultValue={localStorage.getItem("lang") || "km"}
                      onChange={(e) => setLang(e.target.value)}
                      className="px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                    >
                      <option value="km">KM</option>
                      <option value="en">EN</option>
                    </select>
                  </div>

                  {isPro ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold">
                      <Crown className="h-4 w-4 fill-white" /> PRO Member
                    </div>
                  ) : (
                    <Link
                      to="/subscription"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-sm font-semibold dark:bg-slate-800 dark:text-slate-200"
                      onClick={closeMobileMenu}
                    >
                      <Crown className="h-4 w-4 text-yellow-500" /> {t("upgradeToPro")}
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      toggleTheme();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-xl border bg-white dark:bg-slate-900 dark:text-white dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {t("darkMode")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-white/20 dark:border-slate-800/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-3xl mx-auto p-6">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search confessions, users, or tags..."
                    className="w-full px-14 py-4 rounded-2xl border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 text-lg shadow-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
