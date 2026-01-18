import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/Container.jsx";
import { mockConversations, mockMessages } from "../utils/mockData.js";
import { Send, Image, Smile, Phone, Video, Search, ArrowLeft, MoreVertical, Gift, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useSubscription } from "../hooks/useSubscription.js";
import FeatureLock from "../components/FeatureLock.jsx";
import LoveGifts from "../components/LoveGifts.jsx";

export default function Chat() {
    const { t } = useTranslation();
    const { canChat, isYearly } = useSubscription();
    const [selectedConv, setSelectedConv] = useState(null);
    const [mobileView, setMobileView] = useState("list"); // list | chat
    const [anonymousMode, setAnonymousMode] = useState(false);

    if (!canChat()) {
        return (
            <Container>
                <FeatureLock feature={t("chatMessenger")} />
            </Container>
        );
    }

    return (
        <Container className="h-[calc(100vh-100px)] pt-4 pb-4">
            <div className="h-full bg-white rounded-[2rem] shadow-xl border overflow-hidden flex dark:bg-slate-900 dark:border-slate-800">

                {/* Sidebar */}
                <div className={`${mobileView === "chat" ? "hidden" : "flex"} w-full md:w-80 flex-col border-r dark:border-slate-800`}>
                    <div className="p-4 border-b dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold dark:text-white">Messages</h2>
                            {isYearly && (
                                <button
                                    onClick={() => setAnonymousMode(!anonymousMode)}
                                    className={`p-2 rounded-xl transition ${
                                        anonymousMode
                                            ? "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                    }`}
                                    title={anonymousMode ? t("disableAnonymous") : t("enableAnonymous")}
                                >
                                    {anonymousMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-pink-200 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        {anonymousMode && (
                            <div className="mt-2 p-2 bg-pink-50 rounded-lg text-xs text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                                🔒 {t("anonymousModeActive")}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {mockConversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => {
                                    setSelectedConv(conv);
                                    setMobileView("chat");
                                }}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition dark:hover:bg-slate-800 ${selectedConv?.id === conv.id ? "bg-pink-50 dark:bg-slate-800" : ""}`}
                            >
                                <div className="relative">
                                    <img src={conv.user.avatar} className="w-12 h-12 rounded-full object-cover" />
                                    {conv.user.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-slate-900"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold truncate dark:text-white">{conv.user.name}</h3>
                                        <span className="text-xs text-slate-400">{conv.timestamp}</span>
                                    </div>
                                    <p className={`text-sm truncate ${conv.unread > 0 ? "font-bold text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unread > 0 && (
                                    <span className="w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`${mobileView === "list" ? "hidden md:flex" : "flex"} flex-1 flex-col bg-slate-50 dark:bg-slate-950`}>
                    {selectedConv ? (
                        <ChatWindow
                            conversation={selectedConv}
                            anonymousMode={anonymousMode}
                            onBack={() => {
                                setMobileView("list");
                                setSelectedConv(null);
                            }}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800">
                                <Send className="h-8 w-8 text-slate-300" />
                            </div>
                            <p>Select a match to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}

function ChatWindow({ conversation, anonymousMode, onBack }) {
    const { t } = useTranslation();
    const { isYearly } = useSubscription();
    const [messages, setMessages] = useState(mockMessages[conversation.id] || []);
    const [input, setInput] = useState("");
    const [showGifts, setShowGifts] = useState(false);
    const scrollRef = useRef();

    // Scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: "me",
            text: input,
            time: "Now"
        };

        setMessages([...messages, newMsg]);
        setInput("");

        // Mock reply
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                sender: "them",
                text: "That's interesting! Tell me more. 😊",
                time: "Now"
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <>
            {/* Header */}
            <div className="p-4 bg-white border-b flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-2 -ml-2 text-slate-500">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="relative">
                        <img src={conversation.user.avatar} className="w-10 h-10 rounded-full object-cover" />
                        {conversation.user.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
                    </div>
                    <div>
                        <h3 className="font-bold dark:text-white">
                            {anonymousMode ? "Anonymous" : conversation.user.name}
                        </h3>
                        <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-pink-600">
                    <button><Phone className="h-5 w-5" /></button>
                    <button><Video className="h-5 w-5" /></button>
                    <button className="text-slate-400"><MoreVertical className="h-5 w-5" /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[70%] rounded-2xl p-3 ${msg.sender === "me"
                            ? "bg-pink-600 text-white rounded-tr-none"
                            : "bg-white text-slate-800 rounded-tl-none border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            }`}>
                            {msg.type === "image" ? (
                                <div className="mb-1">
                                    <img src={msg.image} className="rounded-lg max-w-full" />
                                </div>
                            ) : null}
                            {msg.type === "gift" ? (
                                <div className="mb-2 p-3 bg-pink-50 rounded-xl dark:bg-pink-900/20">
                                    <div className="text-4xl mb-1">{msg.gift.giftEmoji}</div>
                                    <div className="font-semibold text-sm dark:text-white">{msg.gift.giftName}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{msg.gift.message}</div>
                                </div>
                            ) : null}
                            {msg.text && <p>{msg.text}</p>}
                            <div className={`text-[10px] mt-1 text-right ${msg.sender === "me" ? "text-pink-200" : "text-slate-400"}`}>
                                {msg.time}
                            </div>
                        </div>
                    </motion.div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Composer */}
            <div className="p-4 bg-white border-t dark:bg-slate-900 dark:border-slate-800">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition dark:hover:bg-slate-800">
                        <Image className="h-5 w-5" />
                    </button>
                    <button type="button" className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition dark:hover:bg-slate-800">
                        <Smile className="h-5 w-5" />
                    </button>
                    {isYearly && (
                        <button
                            type="button"
                            onClick={() => setShowGifts(true)}
                            className="p-2 text-pink-600 hover:bg-pink-50 rounded-full transition dark:hover:bg-pink-900/20"
                            title={t("sendGift")}
                        >
                            <Gift className="h-5 w-5" />
                        </button>
                    )}
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={anonymousMode ? t("typeMessageAnonymous") : t("typeMessage")}
                        className="flex-1 py-2 px-4 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-pink-200 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>

            <LoveGifts
                show={showGifts}
                onClose={() => setShowGifts(false)}
                onGiftSent={(gift) => {
                    const giftMsg = {
                        id: Date.now(),
                        sender: "me",
                        type: "gift",
                        gift: gift,
                        time: "Now"
                    };
                    setMessages(prev => [...prev, giftMsg]);
                }}
            />
        </>
    );
}
