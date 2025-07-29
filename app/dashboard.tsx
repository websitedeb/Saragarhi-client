import { Button } from "@/components/Forms/button";
import { BentoBox, BentoGrid } from "@/hooks/bento";
import { clearSession, getSession } from "@/hooks/session";
import { Fonts } from "@/hooks/useFont";
import { AntDesign, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
            <Text className="text-white text-4xl mt-16 pl-5 mb-16">
              Welcome,{"\n"}
              <Text className="mainColor" style={{ fontFamily: Fonts.Shrikhand}}>{user?.Name || "User"}</Text>{"\n"}
              <Text className="text-lg" style={{ fontFamily:Fonts.Inter }}>What are We Going to Do Today?</Text>
            </Text>

            <BentoGrid>
              <TouchableOpacity onPress={() => {}}>
                <BentoBox size="small" className="border-yellow-400 w-40 h-40 rounded-3xl mb-5" style={{ backgroundColor: "rgba(253, 224, 71, 0.3)", borderWidth: 1 }}>
                  <AntDesign name="form" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Scout</Text>
                </BentoBox>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {router.push("/checklist")}}>
                <BentoBox size="small" className="border-rose-400 w-40 h-40 rounded-3xl mb-5" style={{ backgroundColor: "rgba(244, 63, 94, 0.3)", borderWidth: 1 }}>
                  <MaterialIcons name="checklist-rtl" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Checklist</Text>
                </BentoBox>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {router.push("/planner")}}>
                <BentoBox size="small" className="border-cyan-400 w-40 h-40 rounded-3xl" style={{ backgroundColor: "rgba(6, 182, 212, 0.3)", borderWidth: 1 }}>
                  <MaterialIcons name="draw" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Planner</Text>
                </BentoBox>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <BentoBox size="small" className="border-purple-400 w-40 h-40 rounded-3xl" style={{ backgroundColor: "rgba(168, 85, 247, 0.3)", borderWidth: 1 }}>
                  <FontAwesome6 name="ranking-star" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Ranks</Text>
                </BentoBox>
              </TouchableOpacity>
            </BentoGrid>
            <View className="mb-28" />

            <Text id="data" className="">
              
            </Text>
            
            <Button onClick={deleteSession} title="Logout"/>

        </ScrollView>
    </SafeAreaView>
  );
}
