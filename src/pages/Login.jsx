import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, ArrowRight, Github, Facebook } from "lucide-react";
import Container from "../components/Container";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login("test@example.com", "password"); // In a real form, gather these from state/refs. 
            // Wait, the form inputs are uncontrolled or not bound to state in the original file? 
            // Let's check line 44/59. They are uncontrolled. We need to get values.
            // Let's refactor to get values from form.
            const formData = new FormData(e.target);
            const email = formData.get("email");
            const password = formData.get("password");

            await login(email, password);
            navigate("/"); // Redirect to home or dashboard
        } catch (error) {
            console.error("Login failed:", error);
            // Optionally set error state here
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="flex items-center justify-center min-h-[80vh]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative"
            >
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-purple-900/50 mb-4 shadow-lg">
                            <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400 fill-pink-600 dark:fill-pink-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-600 dark:text-slate-400">Sign in to continue your confession journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none dark:text-white"
                                    placeholder="name@example.com"
                                />
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none dark:text-white"
                                    placeholder="••••••••"
                                />
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500 border-slate-300" />
                                <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                            </label>
                            <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors dark:text-white">
                                <Github className="w-5 h-5" />
                                <span className="font-medium">Github</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-blue-600 bg-blue-50/50 dark:bg-transparent dark:text-blue-400">
                                <Facebook className="w-5 h-5" />
                                <span className="font-medium">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-pink-600 hover:text-pink-700 font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </Container>
    );
}
