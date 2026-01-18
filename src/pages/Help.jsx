import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, MessageCircle, Shield, Heart, Users, Settings, ChevronRight, ChevronDown, ExternalLink, Video, FileText, HelpCircle } from "lucide-react";
import useDebounce from "../hooks/useDebounce.js";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const helpCategories = useMemo(() => [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      articles: [
        {
          title: "Creating Your First Confession",
          content: "Learn how to write and share your first anonymous confession.",
          link: "/help/first-confession"
        },
        {
          title: "Understanding Privacy",
          content: "How we protect your identity and keep your confessions anonymous.",
          link: "/help/privacy"
        },
        {
          title: "Navigating the App",
          content: "Complete guide to using all features of Love Confession.",
          link: "/help/navigation"
        }
      ]
    },
    {
      id: "account",
      title: "Account Management",
      icon: Users,
      color: "from-green-500 to-green-600",
      articles: [
        {
          title: "Profile Settings",
          content: "Customize your profile and manage your personal information.",
          link: "/help/profile"
        },
        {
          title: "Deleting Your Account",
          content: "How to permanently delete your account and data.",
          link: "/help/delete-account"
        },
        {
          title: "Changing Username",
          content: "Update your username and display name.",
          link: "/help/username"
        }
      ]
    },
    {
      id: "safety",
      title: "Safety & Security",
      icon: Shield,
      color: "from-red-500 to-red-600",
      articles: [
        {
          title: "Reporting Inappropriate Content",
          content: "How to report confessions that violate our community guidelines.",
          link: "/help/report"
        },
        {
          title: "Blocking Users",
          content: "Prevent specific users from interacting with you.",
          link: "/help/blocking"
        },
        {
          title: "Community Guidelines",
          content: "Rules and guidelines for maintaining a safe community.",
          link: "/help/guidelines"
        }
      ]
    },
    {
      id: "features",
      title: "Features Guide",
      icon: Settings,
      color: "from-purple-500 to-purple-600",
      articles: [
        {
          title: "Matching System",
          content: "How the matching algorithm works and how to find connections.",
          link: "/help/matching"
        },
        {
          title: "Chat Features",
          content: "Using the chat system to communicate with other users.",
          link: "/help/chat"
        },
        {
          title: "Premium Features",
          content: "Overview of PRO features and how to upgrade.",
          link: "/help/premium"
        }
      ]
    }
  ], []);

  const quickLinks = [
    { title: "Video Tutorials", icon: Video, description: "Watch step-by-step guides" },
    { title: "User Manual", icon: FileText, description: "Complete documentation" },
    { title: "Community Forum", icon: MessageCircle, description: "Get help from other users" }
  ];

  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery) return helpCategories;
    
    const query = debouncedSearchQuery.toLowerCase();
    return helpCategories.map(category => ({
      ...category,
      articles: category.articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      )
    })).filter(category => category.articles.length > 0);
  }, [helpCategories, debouncedSearchQuery]);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-2xl">
            <HelpCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to common questions and learn how to make the most of Love Confession.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-lg"
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
                <link.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{link.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Help Categories */}
      <div className="space-y-6">
        {filteredCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + categoryIndex * 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.articles.length} articles
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  expandedCategory === category.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategory === category.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-slate-700"
              >
                <div className="p-6 space-y-4">
                  {category.articles.map((article, articleIndex) => (
                    <motion.div
                      key={article.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: articleIndex * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-pink-100 dark:group-hover:bg-pink-900/20 transition-colors flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{article.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </a>
            <a
              href="/help/community"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Community Forum
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
