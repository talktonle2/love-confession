import { motion } from "framer-motion";
import { Heart, Sparkles, GraduationCap, Gem, Calendar, ArrowRight } from "lucide-react";

export default function LoveStorySection() {
    const timeline = [
        { year: "2021", title: "Meet at E School", desc: "Started our journey as strangers, became friends.", icon: "🎓" },
        { year: "2022", title: "Become Close", desc: "Shared dreams, laughter, and support.", icon: "✨" },
        { year: "2023", title: "Support Each Other", desc: "Growing together through challenges.", icon: "🤝" },
        { year: "2024", title: "Build Dreams", desc: "Planning a future full of possibilities.", icon: "🚀" },
        { year: "2026 (June)", title: "Engagement 💍", desc: "A new chapter begins: Engagement.", icon: "💎", highlight: true },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-[2rem] border bg-white/80 dark:bg-slate-950/60 dark:border-slate-800 shadow-sm overflow-hidden"
        >
            <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-slate-800 dark:text-pink-200 text-xs font-medium">
                            <Heart className="h-4 w-4" />
                            Love Story • Since 2021
                        </div>

                        <h2 className="mt-3 text-2xl md:text-3xl font-bold dark:text-white leading-relaxed">
                            ស្គាល់គ្នាតាំងពី ឆ្នាំ 2021 — សារភាពស្នេហ៍របស់ពួកយើង 💗
                        </h2>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <GraduationCap className="h-4 w-4" />
                            <span>
                                តាមរយៈការរៀននៅក្នុង <b>E School Cambodia</b>
                            </span>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Sparkles className="h-4 w-4" />
                        <span>Story Highlight</span>
                    </div>
                </div>

                {/* Story */}
                <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-200 leading-relaxed text-base md:text-lg">
                    <p>
                        ពួកយើងបានស្គាល់គ្នាតាំងពីឆ្នាំ <b>2021</b> តាមរយៈការរៀន និងការចូលរួមសកម្មភាពនៅក្នុង{" "}
                        <b>E School Cambodia</b>។ នៅទីនោះ ពួកយើងបានជួបគ្នាជាលើកដំបូង ពីមនុស្សមិនស្គាល់គ្នា ទៅជាមិត្តដែលចេះជួយគ្នា
                        ចេះលើកទឹកចិត្តគ្នា និងចេះចែករំលែកគ្នា។
                    </p>

                    <p>
                        ពេលវេលាឆ្លងកាត់… ពួកយើងបានរៀនអំពី <b>ការយល់ចិត្ត ការគាំទ្រ និងការចូលចិត្តគ្នាដោយស្មោះត្រង់</b>។ ពីការជួយគ្នាក្នុងការសិក្សា
                        ការចែករំលែកគំនិត និងការជំរុញគ្នាឲ្យកាន់តែប្រសើរ—អារម្មណ៍ល្អៗទាំងនោះ បានបន្តធ្វើឲ្យស្នេហ៍របស់ពួកយើងកាន់តែរឹងមាំ។
                    </p>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-100 dark:border-pink-900/50">
                        <p className="font-medium text-slate-800 dark:text-white mb-2">
                            ហើយថ្ងៃនេះ… ទំព័រ “<b>សារភាពស្នេហ៍</b>” នេះ ត្រូវបានបង្កើតឡើង ដើម្បីរក្សាទុករឿងរ៉ាវតូចៗ និងអារម្មណ៍ស្រស់ស្អាតរបស់ពួកយើង—ជាពិសេសសម្រាប់ជំហានថ្មីមួយដែលមានន័យខ្លាំង៖
                        </p>
                        <div className="flex items-center gap-3 mt-4 text-pink-700 dark:text-pink-300 font-bold text-lg">
                            <span className="text-2xl">💍</span>
                            <span>នៅខែ 6 ឆ្នាំ 2026 ពួកយើងនឹងមានការភ្ជាប់ពាក្យ</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            — ជាសញ្ញាថា ពួកយើងត្រៀមចាប់ដៃគ្នា ដើរទៅមុខជាមួយគ្នា ដោយស្នេហ៍ និងការទុកចិត្ត 💗
                        </p>
                    </div>

                    <p className="font-medium italic text-slate-500 dark:text-slate-400">
                        អរគុណ <b>E School Cambodia</b> ដែលបានធ្វើឲ្យការជួបគ្នានេះកើតឡើង… ហើយអរគុណ “អ្នក” ដែលបាននៅជាមួយ “ខ្ញុំ”
                        តាំងពីឆ្នាំ 2021 រហូតមកដល់ថ្ងៃនេះ 💗
                    </p>
                </div>

                {/* Timeline */}
                <div className="mt-12 pt-8 border-t dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                        <Calendar className="h-5 w-5 text-pink-500" /> Love Timeline
                    </h3>

                    <div className="relative">
                        {/* Connecting Line (Mobile: hidden, Desktop: visible) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${item.highlight
                                            ? "bg-gradient-to-b from-pink-50 to-white border-pink-200 dark:from-pink-900/20 dark:to-slate-900 dark:border-pink-800"
                                            : "bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800"
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <div className={`font-bold text-lg mb-1 ${item.highlight ? "text-pink-600 dark:text-pink-400" : "dark:text-white"}`}>
                                        {item.year}
                                    </div>
                                    <div className="font-semibold text-sm mb-1 dark:text-slate-200">{item.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </div>

                                    {/* Connectors for mobile */}
                                    {index < timeline.length - 1 && (
                                        <div className="md:hidden flex justify-center mt-4 mb-2">
                                            <ArrowRight className="h-4 w-4 text-slate-300 rotate-90" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                        📍 E School Cambodia
                    </span>
                    <span className="px-3 py-1 rounded-full border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                        🗓️ Since 2021
                    </span>
                    <span className="px-3 py-1 rounded-full border border-pink-200 bg-pink-50 dark:bg-slate-900 dark:border-pink-900 text-xs text-pink-700 dark:text-pink-300 inline-flex items-center gap-1 font-medium">
                        <Gem className="h-3.5 w-3.5" /> Engagement • June 2026
                    </span>
                </div>
            </div>
        </motion.section>
    );
}
