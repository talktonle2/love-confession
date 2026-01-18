import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, MessageCircle, Heart, Star, Search, Filter, TrendingUp, Award, Calendar, Clock, ChevronRight, HelpCircle, ThumbsUp, MessageSquare, Loader2 } from "lucide-react";
import useDebounce from "../hooks/useDebounce.js";

export default function Community() {
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount] = useState(10000);

  const POSTS_PER_PAGE = 20;

  const generateMockPosts = useCallback((startPage, count) => {
    const mockPosts = [];
    const categories = ["general", "help", "feedback", "announcements"];
    const authors = ["LoveHelper", "PrivacyExpert", "Admin", "HappyUser", "TechNewbie", "NightOwl", "CuriousUser", "CommunityStar"];
    const titles = [
      "How to write your first confession?",
      "Best practices for staying anonymous",
      "New feature suggestions - What would you like to see?",
      "Success stories: How Love Confession changed my life",
      "Having trouble with notifications",
      "Love the new dark mode!",
      "Question about PRO features",
      "Tips for better engagement",
      "Community guidelines update",
      "New moderation policies",
      "How to report inappropriate content",
      "Privacy concerns addressed",
      "Mobile app improvements",
      "User experience feedback",
      "Feature request: Custom themes",
      "Success story: Found my soulmate",
      "Anonymous posting tips",
      "Community milestone reached",
      "Help with account recovery"
    ];

    for (let i = 0; i < count; i++) {
      const postId = (startPage - 1) * POSTS_PER_PAGE + i + 1;
      mockPosts.push({
        id: postId,
        title: titles[Math.floor(Math.random() * titles.length)],
        author: authors[Math.floor(Math.random() * authors.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        replies: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 3000),
        timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`,
        pinned: postId <= 3,
        content: `This is a sample post content for post #${postId}. The community has been very active and engaging with this topic...`
      });
    }
    return mockPosts;
  }, []);

  const loadPosts = useCallback((pageNum = 1, append = false) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPosts = generateMockPosts(pageNum, POSTS_PER_PAGE);
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      const totalLoaded = pageNum * POSTS_PER_PAGE;
      setHasMore(totalLoaded < totalCount);
      setLoading(false);
    }, 1000);
  }, [generateMockPosts, totalCount]);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => loadPosts(1), 0);
    return () => clearTimeout(timer);
  }, [loadPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, true);
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadPosts(1, false);
  };

  const forumCategories = [
    { id: "general", name: "General Discussion", icon: MessageCircle, color: "from-blue-500 to-blue-600", count: 1234 },
    { id: "help", name: "Help & Support", icon: HelpCircle, color: "from-green-500 to-green-600", count: 856 },
    { id: "feedback", name: "Feedback & Suggestions", icon: ThumbsUp, color: "from-purple-500 to-purple-600", count: 642 },
    { id: "announcements", name: "Announcements", icon: Award, color: "from-yellow-500 to-yellow-600", count: 128 }
  ];

  const topContributors = [
    { name: "LoveHelper", posts: 156, likes: 1234, badge: "Expert" },
    { name: "PrivacyExpert", posts: 89, likes: 856, badge: "Helper" },
    { name: "Admin", posts: 45, likes: 2341, badge: "Official" },
    { name: "HappyUser", posts: 67, likes: 445, badge: "Community Star" }
  ];

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchQuery) return posts;
    
    const query = debouncedSearchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  }, [posts, debouncedSearchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl">
            <Users className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Community Forum</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Connect with other users, share experiences, and get help from our amazing community.
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          { label: "Total Members", value: "10.5K+", icon: Users },
          { label: "Active Discussions", value: "2,847", icon: MessageCircle },
          { label: "Helpful Answers", value: "8,234", icon: ThumbsUp },
          { label: "Daily Active", value: "342", icon: TrendingUp }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <stat.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {[
                { id: "popular", label: "Popular", icon: Star },
                { id: "recent", label: "Recent", icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ x: 5 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {post.pinned && (
                        <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
                          PINNED
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{post.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" />
                  <span className="text-gray-600 dark:text-gray-400">Loading more posts...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Load More Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {posts.length} of {totalCount.toLocaleString()} posts
              </div>
              
              <div className="flex gap-4">
                {hasMore && !loading && (
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    Load More Posts ({Math.min(POSTS_PER_PAGE, totalCount - posts.length)} remaining)
                  </button>
                )}
                
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              
              {!hasMore && posts.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    🎉 You&apos;ve reached the end! All {totalCount.toLocaleString()} posts loaded.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 mb-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
            <div className="space-y-3">
              {forumCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                      <category.icon className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Contributors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {topContributors.map((contributor) => (
                <div key={contributor.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {contributor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{contributor.name}</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full">
                        {contributor.badge}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {contributor.posts} posts • {contributor.likes} likes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Community Guidelines */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-purple-200 dark:border-purple-800/30 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Community Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <span>Be respectful and supportive</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <span>Keep discussions relevant and helpful</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <span>Protect your privacy and others&apos; privacy</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <span>Report inappropriate content</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
