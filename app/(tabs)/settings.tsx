import { getSession, protectRoute } from "@/hooks/session";
import { preloadIconFonts } from "@/hooks/useFont";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Workspace() {
    useEffect(() => {
        protectRoute();
        preloadIconFonts();
        (async () => {
        const session = await getSession();
        if (!session) {
            router.push("/signin");
            return;
        }
        })();
    }, []);

    return null;
}
