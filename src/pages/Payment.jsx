
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Container from "../components/Container.jsx";
import { Check, RefreshCw, Coffee } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { COIN_PACKAGES } from "../utils/coins.js";
import { useCoins } from "../hooks/useCoins.js";
import { getCoffeeOrders, markCoffeeOrderPaid } from "../utils/coffee.js";
import Confetti from "../components/Confetti.jsx";
import QRCode from "../components/QRCode.jsx";

export default function Payment() {
    const { planId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { purchaseCoins } = useCoins();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [qr, setQr] = useState("");

    const isCoinPurchase = planId?.startsWith("coins");
    const isCoffeePurchase = planId?.startsWith("coffee");
    const coinPackageId = isCoinPurchase ? planId.split("/")[2] : null;
    const coffeeOrderId = isCoffeePurchase ? planId.split("/")[2] : null;
    const [coinPackage, setCoinPackage] = useState(null);
    const [coffeeOrder, setCoffeeOrder] = useState(null);

    const invoiceId = useMemo(() => `INV-${Date.now()}`, []);

    // Mock KHQR String (In real app, fetch from Backend)
    // This is a dummy KHQR for display purposes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mockKHQR = useMemo(() => `00020101021229370016000201010211520460115802KH5913LOVE_CONFESSION6004PHNOM_PENH62270114${invoiceId}63041234`, [invoiceId]);

    useEffect(() => {
        // Load package/order data
        if (isCoinPurchase && coinPackageId) {
            const pkg = COIN_PACKAGES.find(p => p.id === coinPackageId);
            if (!pkg) {
                navigate("/coins");
                return;
            }
            setCoinPackage(pkg);
        } else if (isCoffeePurchase && coffeeOrderId) {
            const order = getCoffeeOrders().find(o => o.id === coffeeOrderId);
            if (!order) {
                navigate("/");
                return;
            }
            setCoffeeOrder(order);
        } else if (!isCoinPurchase && !isCoffeePurchase && planId !== "monthly" && planId !== "yearly") {
            navigate("/subscription");
            return;
        }

        // Simulate API call to generate QR
        setTimeout(() => {
            setQr(mockKHQR);
            setLoading(false);
        }, 1000);
    }, [planId, isCoinPurchase, isCoffeePurchase, coinPackageId, coffeeOrderId, navigate, mockKHQR]);

    const handlePaymentSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            if (isCoinPurchase && coinPackage) {
                // Purchase coins
                const bonusCoins = 0; // Could add bonus for yearly subscribers
                purchaseCoins(coinPackage.coins + bonusCoins);
                setSuccess(true);
                setLoading(false);
            } else if (isCoffeePurchase && coffeeOrder) {
                // Mark coffee order as paid
                markCoffeeOrderPaid(coffeeOrder.id, `ref_${Date.now()}`);
                setSuccess(true);
                setLoading(false);
                setShowConfetti(true);
            } else {
                // Persist Subscription
                const expires = new Date();
                if (planId === "monthly") {
                    expires.setMonth(expires.getMonth() + 1);
                } else {
                    expires.setFullYear(expires.getFullYear() + 1);
                }

                localStorage.setItem("sub_status", "paid");
                localStorage.setItem("sub_expires", expires.toISOString());
                localStorage.setItem("sub_plan", planId); // Save plan type

                // Force storage event for hook update
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new Event("subscriptionUpdated"));
            }

            setSuccess(true);
            setLoading(false);
            if (isCoffeePurchase) {
                setShowConfetti(true);
            }
        }, 1500);
    };

    const openBankApp = () => {
        // Deep link protocol
        window.location.href = `khqr://pay?data=${qr}`;
        // In dev/mock, we also trigger success for verifying user flow easier
        // In prod, this would wait for webhook. 
        // For this "Frontend only" request, we allow clicking this to verify.
        setTimeout(handlePaymentSuccess, 3000);
    };

    if (success) {
        return (
            <Container>
                <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md mx-auto bg-white rounded-[2rem] p-8 text-center border shadow-sm dark:bg-slate-900 dark:border-slate-800"
                >
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/20">
                        {isCoffeePurchase ? (
                            <Coffee className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                        ) : (
                            <Check className="h-10 w-10 text-green-600 dark:text-green-500" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold mb-2 dark:text-white">{t("paymentSuccess")}</h2>
                    <p className="text-slate-600 mb-8 dark:text-slate-400">
                        {isCoinPurchase ? t("coinsAdded") : isCoffeePurchase ? t("coffeeSent") : t("thankYouPro")}
                    </p>

                    <button
                        onClick={() => {
                            if (isCoinPurchase) {
                                navigate("/coins");
                            } else if (isCoffeePurchase) {
                                // Check if there's a return parameter for project request
                                const urlParams = new URLSearchParams(window.location.search);
                                if (urlParams.get("return") === "project") {
                                    navigate("/creator/creator_1");
                                } else {
                                    navigate("/creator/creator_1");
                                }
                            } else {
                                navigate("/subscription");
                            }
                        }}
                        className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition dark:bg-white dark:text-slate-900"
                    >
                        {isCoinPurchase ? t("backToCoins") : isCoffeePurchase ? t("viewCreator") : t("backToHome")}
                    </button>
                </motion.div>
            </Container >
        );
    }

    return (
        <Container>
            <div className="max-w-md mx-auto relative pt-10">
                {/* White Card Container */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden relative z-10 mx-4 dark:bg-[#0b1221] border border-slate-100 dark:border-[#1e293b]">

                    {/* Header - ABA PAY Logo */}
                    <div className="pt-8 pb-4 flex justify-center items-center">
                        <div className="flex items-center gap-1">
                            <span className="text-[#005ea8] text-4xl font-bold tracking-tight">ABA</span>
                            <span className="text-[#ee1d23] text-4xl font-bold -ml-1">{"'"}</span>
                            <span className="text-[#00b9d9] text-4xl font-bold tracking-tight">PAY</span>
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className="text-center pb-6">
                        <p className="text-slate-900 text-lg font-medium dark:text-white">{t("scanPayDone")}</p>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex justify-center px-8 relative">
                        {/* QR Brackets/Corners - decorative */}
                        <div className="absolute top-0 left-8 w-8 h-8 border-t-2 border-l-2 border-slate-300 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-8 w-8 h-8 border-t-2 border-r-2 border-slate-300 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-8 w-8 h-8 border-b-2 border-l-2 border-slate-300 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-8 w-8 h-8 border-b-2 border-r-2 border-slate-300 rounded-br-lg"></div>

                        <div className="p-4">
                            {loading ? (
                                <div className="h-48 w-48 flex items-center justify-center bg-slate-50 rounded-lg">
                                    <RefreshCw className="h-8 w-8 text-slate-400 animate-spin" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <QRCode url={`khqr://pay?data=${qr}`} size={192}>
                                        <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white font-bold text-lg shadow-md">
                                            $
                                        </div>
                                    </QRCode>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center pt-6 pb-2">
                        <h3 className="text-slate-800 font-bold text-xl uppercase tracking-wide dark:text-white">KOSAL SENSOK</h3>
                        {/* Account Num removed from view or just hidden based on screenshot style if needed, but usually displayed. Keeping simpler for second image style which usually just has name. 
                            Actually second image implies simpler view. Let's keep simpler.
                            Wait, first image has phone number. Second image usually has it too but sometimes hidden.
                            I will display it cleaner.
                         */}
                    </div>

                    {/* Footer / Member of KHQR */}
                    <div className="pt-8 pb-8 px-8 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-medium">{t("memberOf")}</span>
                            <div className="text-[#ee1d23] font-bold text-xl tracking-wider flex items-center gap-1">
                                KHQR
                            </div>
                        </div>

                        {/* Red Curve Graphic at bottom right */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden pointer-events-none rounded-br-[2rem]">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#ee1d23] rounded-tl-full transform translate-x-10 translate-y-10"></div>
                            {/* White curve inner */}
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-[12px] border-white rounded-tl-[2rem] rounded-br-[1rem] z-10 bottom-2 right-2"></div>
                        </div>
                    </div>
                </div>

                {/* Action Button - Outside the card */}
                <div className="mt-8 px-4 max-w-md mx-auto">
                    <button
                        onClick={openBankApp}
                        className="w-full py-4 rounded-xl bg-[#005ea8] text-white font-bold text-lg shadow-lg shadow-blue-200/50 hover:bg-[#004a85] transition flex items-center justify-center gap-2 dark:shadow-none"
                    >
                        {t("payWithBank")}
                    </button>

                    <button onClick={handlePaymentSuccess} className="mt-6 text-sm text-slate-400 underline hover:text-slate-600 block mx-auto text-center">
                        (Dev: Simulate Success)
                    </button>
                </div>
            </div>
        </Container>
    );
}
