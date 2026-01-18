import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PageTitle() {
    const { pathname } = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
        let title = "";

        // Base title based on language
        const appName = "Confession";

        switch (pathname) {
            case "/":
                title = i18n.language === "km" ? "ទំព័រដើម" : "Home";
                break;
            case "/create":
                title = i18n.language === "km" ? "សរសេរសារភាព" : "Create";
                break;
            case "/feed":
                title = i18n.language === "km" ? "មើលសារភាពសាធារណៈ" : "Feed";
                break;
            default:
                if (pathname.startsWith("/c/")) {
                    title = i18n.language === "km" ? "លម្អិត" : "Details";
                } else {
                    title = "";
                }
        }

        document.title = title ? `${title} | ${appName}` : appName;
    }, [pathname, i18n.language]);

    return null;
}
