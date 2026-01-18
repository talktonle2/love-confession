import { useState } from "react";
import { motion } from "framer-motion";
import { User, Heart, MessageCircle, Settings, Camera, Edit2, Star, Calendar, MapPin, Link as LinkIcon, Shield, Crown, Sparkles } from "lucide-react";
import { useSubscription } from "../hooks/useSubscription.js";
import { useCoins } from "../hooks/useCoins.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const { isPro } = useSubscription();
  const { coins } = useCoins();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats] = useState({
    confessions: 42,
    likes: 128,
    views: 1567,
    shares: 89
  });

  const [profileData, setProfileData] = useState({
    name: "Love User",
    bio: "Sharing love and confessions anonymously 💕",
    location: "Phnom Penh, Cambodia",
    website: "loveconfession.app",
    joinDate: "January 2024",
    avatar: null
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSaveProfile = () => {
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-2xl p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-pink-500" />
                )}
              </div>
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="px-3 py-1 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  profileData.name
                )}
              </h1>
              {isPro && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full">
                  <Crown className="w-3 h-3 fill-current" />
                  PRO
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="px-2 py-1 rounded border bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  profileData.location
                )}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {profileData.joinDate}
              </div>
            </div>

            <div className="mb-4">
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{profileData.bio}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <Link
                    to="/settings"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full font-bold shadow-lg">
              <Sparkles className="w-4 h-4" />
              {coins} Coins
            </div>
            {!isPro && (
              <Link
                to="/subscription"
                className="px-4 py-2 border border-yellow-400 text-yellow-600 dark:text-yellow-400 font-medium rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to PRO
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { icon: Heart, label: "Likes", value: userStats.likes, color: "from-pink-500 to-pink-600" },
          { icon: MessageCircle, label: "Confessions", value: userStats.confessions, color: "from-purple-500 to-purple-600" },
          { icon: Star, label: "Shares", value: userStats.shares, color: "from-blue-500 to-blue-600" },
          { icon: User, label: "Views", value: userStats.views, color: "from-green-500 to-green-600" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-2xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + item * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white">
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">New confession received</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
              </div>
              <div className="text-pink-500 font-bold">+12 likes</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
