import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { DB_URL } from "@/constants/constants";
import { protectRoute } from "@/hooks/session";
import { useSignStore } from "@/hooks/store";

export default function Predict() {
    const { sign } = useSignStore() as { sign: string };

    useEffect(() => {
       protectRoute();
    }, []);

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-gray-950">
            
        </SafeAreaView>
    );
}