import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Moon, Sun, Globe, Smartphone, HelpCircle, LogOut, ChevronRight, Volume2, Vibrate } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import { Link } from "react-router-dom";

export default function Settings() {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
  };

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Edit Profile", href: "/profile", description: "Update your profile information" },
        { label: "Privacy Settings", href: "/privacy", description: "Manage your privacy preferences" },
        { label: "Security", href: "/security", description: "Password and security settings" }
      ]
    },
    {
      title: "Preferences",
      icon: SettingsIcon,
      items: [
        { 
          label: "Theme", 
          action: "theme",
          description: "Choose your preferred theme",
          value: theme === "dark" ? "Dark" : "Light"
        },
        { 
          label: "Language", 
          action: "language",
          description: "Select your preferred language",
          value: i18n.language === "km" ? "ខ្មែរ" : "English"
        },
        { 
          label: "Notifications", 
          action: "notifications",
          description: "Manage notification preferences",
          value: notifications ? "On" : "Off"
        }
      ]
    },
    {
      title: "Accessibility",
      icon: Smartphone,
      items: [
        { 
          label: "Sound Effects", 
          action: "sound",
          description: "Enable/disable sound effects",
          value: soundEnabled ? "On" : "Off"
        },
        { 
          label: "Haptic Feedback", 
          action: "haptic",
          description: "Vibration feedback on mobile",
          value: hapticEnabled ? "On" : "Off"
        }
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      items: [
        { label: "Help Center", href: "/help", description: "Get help and support" },
        { label: "Contact Us", href: "/contact", description: "Get in touch with our team" },
        { label: "About", href: "/about", description: "Learn more about Love Confession" }
      ]
    }
  ];

  const handleAction = (action) => {
    switch (action) {
      case "theme":
        setTheme(theme === "dark" ? "light" : "dark");
        break;
      case "notifications":
        setNotifications(!notifications);
        break;
      case "sound":
        setSoundEnabled(!soundEnabled);
        break;
      case "haptic":
        setHapticEnabled(!hapticEnabled);
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </motion.div>

      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              </div>

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                  >
                    {item.href ? (
                      <Link
                        to={item.href}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-pink-100 dark:group-hover:bg-pink-900/20 transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-pink-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAction(item.action)}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                            {item.action === "theme" && (
                              theme === "dark" ? <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                            {item.action === "notifications" && (
                              <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                            {item.action === "sound" && (
                              <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                            {item.action === "haptic" && (
                              <Vibrate className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.value}</span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
