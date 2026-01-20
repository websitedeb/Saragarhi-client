import { Button } from "@/components/Forms/button";
import { protectRoute } from "@/hooks/session";
import NetInfo from "@react-native-community/netinfo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { DB_URL } from "../constants/constants";
import { useSignStore } from '@/hooks/store';

export default function Complete() {
  const { sign } = useSignStore() as { sign: string };
  const { dataset } = useLocalSearchParams();
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    protectRoute();

    const checkNetwork = async () => {
      const state = await NetInfo.fetch();
      setIsOnline(state.isConnected);
    };

    checkNetwork();
  }, []);

  useEffect(() => {
    if (!isOnline || sent) return;

    const sendDataset = async () => {
      try {
        let parsedDataset = dataset;

        if (typeof dataset === "string") {
          try {
            parsedDataset = JSON.parse(decodeURIComponent(dataset));
          } catch {
            parsedDataset = dataset;
          }
        }

        const res = await fetch(`${DB_URL}/addReport?sign=${sign}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedDataset),
        });

        const data = await res.json();

        if (data.success) {
          console.log(data)
          setSent(true);
        }
      } catch (err) {
        console.error("Failed to send dataset:", err);
      }
    };

    sendDataset();
  }, [isOnline]);

  return (
    <SafeAreaView className="bg-gray-900 w-screen h-screen items-center justify-center">
      <Text className="text-white font-['Shrikhand'] text-4xl text-center mt-10 mainColor">
        Scouting Form Completed!
      </Text>

      <Text className="text-white font-['Fun'] text-3xl text-center mt-5 px-5 mb-5">
        Good Work!
      </Text>

      {isOnline === false && (
        <View className="items-center">
          <Text className="text-red-500 font-['Fun'] text-center px-10 mb-1 text-xl">
            You are currently offline. Show This QR Code to Your Organizer
          </Text>
          <Text className="text-red-500 font-['Fun'] text-center px-10 mb-5 text-xl">
            TAKE A SCREENSHOT OF THIS!
          </Text>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <QRCode
              value={typeof dataset === "string" ? dataset : JSON.stringify(dataset)}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>
        </View>
      )}

      <Text className="pb-10"></Text>

      <Button onClick={() => router.navigate("/dashboard")} title={"Dashboard"} />
    </SafeAreaView>
  );
}
