import { useState, useEffect } from "react";

const STORAGE_KEY = "love_confession_user";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from storage on mount
    useEffect(() => {
        const checkUser = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setUser(JSON.parse(stored));
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error("Failed to load user", e);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
        window.addEventListener("storage", checkUser);
        window.addEventListener("authUpdated", checkUser);
        return () => {
            window.removeEventListener("storage", checkUser);
            window.removeEventListener("authUpdated", checkUser);
        };
    }, []);

    const login = (email, password) => {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock validation: any email/pass works for demo
                if (email && password) {
                    // For demo purposes, we'll try to find an existing user in "mock_db" or just create a session
                    // Let's just create a session with the email
                    const mockUser = {
                        id: "user_" + Math.random().toString(36).substr(2, 9),
                        email,
                        name: email.split("@")[0], // Default name from email
                        avatar: null,
                        bio: "I love Love Confession! 💕",
                        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        location: "Phnom Penh, Cambodia",
                        ...user // Keep existing fields if re-logging in (not really possible here but good practice)
                    };

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
                    setUser(mockUser);
                    window.dispatchEvent(new Event("authUpdated"));
                    resolve(mockUser);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 1000);
        });
    };

    const register = (name, email) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: "user_" + Math.random().toString(36).substr(2, 9),
                    email,
                    name,
                    avatar: null,
                    bio: "Just joined the community! ✨",
                    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    location: "Phnom Penh, Cambodia"
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
                setUser(newUser);
                window.dispatchEvent(new Event("authUpdated"));
                resolve(newUser);
            }, 1000);
        });
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        window.dispatchEvent(new Event("authUpdated"));
    };

    const updateProfile = (updates) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("authUpdated"));
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
    };
}
