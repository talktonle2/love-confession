import { motion } from "framer-motion";
import { useMemo } from "react";
import { Shield, Eye, EyeOff, Database, User, Lock, CheckCircle, Calendar, Download, Trash2, FileText } from "lucide-react";

export default function Privacy() {
  const privacyRights = useMemo(() => [
    {
      icon: Eye,
      title: "Right to Know",
      description: "You have the right to know what personal data we collect and how we use it."
    },
    {
      icon: EyeOff,
      title: "Right to Anonymity",
      description: "You can use our platform completely anonymously without revealing your identity."
    },
    {
      icon: Download,
      title: "Right to Data Portability",
      description: "You can request a copy of all your personal data in a machine-readable format."
    },
    {
      icon: Trash2,
      title: "Right to Deletion",
      description: "You can request that we delete all your personal data from our systems."
    }
  ], []);

  const dataCategories = useMemo(() => [
    {
      title: "Information You Provide",
      items: [
        "Email address (for account creation)",
        "Profile information (optional)",
        "Confession content",
        "Messages and comments"
      ],
      required: true
    },
    {
      title: "Automatically Collected Information",
      items: [
        "IP address (anonymized)",
        "Device information",
        "Usage patterns",
        "Cookies and similar technologies"
      ],
      required: false
    },
    {
      title: "Information We Don't Collect",
      items: [
        "Real identity information",
        "Social security numbers",
        "Financial information",
        "Biometric data"
      ],
      required: false
    }
  ], []);

  const retentionPeriods = useMemo(() => [
    { type: "Active Confessions", period: "Until deleted by user" },
    { type: "Deleted Confessions", period: "30 days" },
    { type: "Account Data", period: "Until account deletion" },
    { type: "System Logs", period: "90 days" }
  ], []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your privacy is fundamental to our mission. Learn how we protect your data and respect your privacy.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Last updated: January 2024
        </p>
      </motion.div>

      {/* Privacy Rights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Privacy Rights</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyRights.map((right, index) => (
            <motion.div
              key={right.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                <right.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{right.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{right.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Data Collection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Data We Collect</h2>
        <div className="space-y-6">
          {dataCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.required 
                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" 
                    : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                }`}>
                  {category.required ? "Required" : "Optional"}
                </span>
              </div>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Data Retention */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Data Retention</h2>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Data Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Retention Period</th>
                </tr>
              </thead>
              <tbody>
                {retentionPeriods.map((period) => (
                  <tr key={period.type} className="border-b border-gray-100 dark:border-slate-800">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{period.type}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{period.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> We automatically delete data that is no longer necessary to provide our services.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Data Protection Measures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">How We Protect Your Data</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Lock,
              title: "Encryption",
              description: "All data is encrypted using industry-standard protocols"
            },
            {
              icon: Database,
              title: "Secure Storage",
              description: "Your data is stored in secure, access-controlled data centers"
            },
            {
              icon: User,
              title: "Access Control",
              description: "Only authorized personnel can access your personal data"
            }
          ].map((measure, index) => (
            <motion.div
              key={measure.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white mb-4">
                <measure.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{measure.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{measure.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact for Privacy Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Questions or Concerns?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If you have questions about our privacy practices or need to exercise your privacy rights, 
            please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@loveconfession.app"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Email Privacy Team
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
