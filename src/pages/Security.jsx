import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, Key, AlertTriangle, CheckCircle, Smartphone, Database, Server } from "lucide-react";

export default function Security() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All confessions are encrypted using industry-standard AES-256 encryption to ensure complete privacy."
    },
    {
      icon: EyeOff,
      title: "Anonymous by Default",
      description: "Your identity is never revealed unless you explicitly choose to share it."
    },
    {
      icon: Key,
      title: "Secure Authentication",
      description: "Multi-factor authentication and secure password policies protect your account."
    },
    {
      icon: Database,
      title: "Data Protection",
      description: "Your data is stored securely with regular backups and disaster recovery plans."
    }
  ];

  const bestPractices = [
    {
      title: "Use Strong Passwords",
      description: "Create unique passwords with a mix of letters, numbers, and symbols.",
      icon: Key
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to your account with 2FA.",
      icon: Shield
    },
    {
      title: "Be Mindful of Personal Info",
      description: "Avoid sharing personally identifiable information in your confessions.",
      icon: Eye
    },
    {
      title: "Report Suspicious Activity",
      description: "Help keep the community safe by reporting inappropriate content.",
      icon: AlertTriangle
    }
  ];

  const securityMetrics = [
    { label: "Encryption Standard", value: "AES-256" },
    { label: "Data Breaches", value: "0" },
    { label: "Security Audits", value: "Quarterly" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Security & Privacy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your privacy and security are our top priorities. Learn how we protect your data and keep you safe.
        </p>
      </motion.div>

      {/* Security Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      >
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-2xl p-6 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">{metric.value}</div>
            <div className="text-gray-600 dark:text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How We Protect You
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Policy Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 mb-16"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Our Privacy Commitment
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <EyeOff className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Anonymous by Design</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your identity is never revealed unless you choose to share it</p>
          </div>
          <div className="text-center">
            <Database className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Data Minimization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">We only collect what&apos;s necessary to provide our service</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Transparent Control</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">You have full control over your data and can delete it anytime</p>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Security Best Practices
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {bestPractices.map((practice, index) => (
            <motion.div
              key={practice.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <practice.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{practice.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{practice.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Security Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 border border-red-200 dark:border-red-800/30"
      >
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Report Security Issues
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If you discover any security vulnerabilities or have concerns about our security practices, please don&apos;t hesitate to report them to us immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:security@loveconfession.app"
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
            >
              Report Security Issue
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-red-300 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
