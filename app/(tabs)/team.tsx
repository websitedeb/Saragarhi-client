import getRole from "@/hooks/getRole";
import { getSession, protectRoute } from "@/hooks/session";
import { preloadIconFonts } from "@/hooks/useFont";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Teams() {
    useEffect(() => {
        protectRoute();
        preloadIconFonts();
        (async () => {
        const session = await getSession();
        if (!session) {
            router.push("/signin");
            return;
        }
        const role = await getRole();
        if (role !== "Captain" || role !== "Organizer"){
            router.push("/dashboard");
        }
        })();
    }, []);

    return null;
}
