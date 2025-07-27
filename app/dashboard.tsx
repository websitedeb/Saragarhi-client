import { Button } from "@/components/Forms/button";
import { BentoBox, BentoGrid } from "@/hooks/bento";
import { clearSession, getSession } from "@/hooks/session";
import { Fonts } from "@/hooks/useFont";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  async function deleteSession() {
    await clearSession();
    router.push("/signin");
  }

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/signin");
        return;
      }
      setUser(session);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-900">
        <View className="flex-1">
            <Text className="text-white text-4xl mt-10 mb-5 pl-5">
            Welcome,{"\n"}
            <Text className="mainColor" style={{ fontFamily: Fonts.Shrikhand}}>{user?.Name || "User"}</Text>
            </Text>
            <BentoGrid>
              <BentoBox size="small" className="border-yellow-400 bg-yellow-300 w-40 h-40 rounded-3xl" style={{}}>
                <Text className="text-lg text-gray-800">Profile</Text>
              </BentoBox>
            </BentoGrid>
            <Button onClick={deleteSession} title="Logout" />
        </View>
    </SafeAreaView>
  );
}
