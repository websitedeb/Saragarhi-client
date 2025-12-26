import { Button } from "@/components/Forms/button";
import { protectRoute } from "@/hooks/session";
import NetInfo from "@react-native-community/netinfo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Complete(){
    const { dataset } = useLocalSearchParams();
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const state = await NetInfo.fetch();
            setIsOnline(state.isConnected);
        })();

        protectRoute();

        if (isOnline) {
            fetch("https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/addReport", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataset),
                })
                .then(async res => {
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    console.error("Not valid JSON:", err);
                    return;
                }
                if (data.success) router.push({ pathname: "/complete", params: { dataset: `${JSON.stringify(dataset)}` } });
                })
                .catch(err => console.error(err, dataset));
        }
    }, [])

    return (
        <SafeAreaView className="bg-gray-900 w-screen h-screen items-center justify-center">
            <Text className="text-white font-['Shrikhand'] text-4xl text-center mt-10 mainColor">Scouting Form Completed!</Text>
            <Text className="text-white font-['Fun'] text-3xl text-center mt-5 px-5 mb-5">Good Work!</Text>
            {isOnline === false ? (
                <View className="items-center">
                    <Text className="text-red-500 font-['Fun'] text-center px-10 mb-1 text-xl">You are currently offline. Show This QR Code to Your Organizer</Text>
                    <Text className="text-red-500 font-['Fun'] text-center px-10 mb-5 text-xl">TAKE A SCREEN SHOT OF THIS!</Text>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <QRCode
                                value={dataset as string}
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>
                </View>
            ) : null}
            <Text className="pb-10"></Text>
            <Button onClick={() => {router.navigate("/dashboard")}} title={"Dashboard"} />
        </SafeAreaView>
    );
}