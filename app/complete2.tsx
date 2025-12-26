import { Button } from "@/components/Forms/button";
import { protectRoute } from "@/hooks/session";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Complete2(){

    useEffect(() => {
        protectRoute();
    }, [])

    return (
        <SafeAreaView className="bg-gray-900 w-screen h-screen items-center justify-center">
            <Text className="text-white font-['Shrikhand'] text-4xl text-center mt-10 mainColor">Scanned!</Text>
            <Text className="text-white font-['Fun'] text-3xl text-center mt-5 px-5 mb-5">Good Work!</Text>
            <Button onClick={() => {router.navigate("/dashboard")}} title={"Dashboard"} />
        </SafeAreaView>
    );
}