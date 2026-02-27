import { BentoBox, BentoGrid } from "@/hooks/bento";
import { getSession, protectRoute, saveSession } from "@/hooks/session";
import { Fonts, preloadIconFonts } from "@/hooks/useFont";
import { requestNotificationPermission, useNotifs } from "@/hooks/useNotifs";
import { AntDesign, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignStore } from "@/hooks/store";
import { DB_URL } from "@/constants/constants";

export default function Dashboard() {
  const [sess, setSess] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { setSign } = useSignStore() as { setSign: (sign: any) => void };
  
    useEffect(() => {
      (async () => {
        const token = await getSession();
        if (token?.sign) {
          setSign(token.sign);
          router.push("/dashboard");
          return;
        }
        else{
          const res = await fetch(`${DB_URL}/get-sign`);
          const data = await res.json();
  
          setSign(data.sign);
  
          if (token) {
            token.sign = data.sign;
            await saveSession(token, 1440);
            router.push("/dashboard");
          }
        }
      })();
    }, []);

  const hasPerms = Boolean(permission?.granted);

  useEffect(() => {
  (async () => {
    await preloadIconFonts();
    await protectRoute();
    const session = await getSession();
    setSess(session);
    const n = await requestNotificationPermission();
    
    if (n) {
      await useNotifs(
        "Scouting in 5 MINUTES!",
        "Don't forget to fill out your scouting form for {team}'s match."
      );
    }
  })();
}, []);


  function qrcodefunc() {
    requestPermission();
    if (hasPerms) router.push("/qrcode" as any);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-900">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
            <Text className="text-white text-4xl mt-16 pl-5 mb-10">
              Welcome,{"\n"}
              <Text className="mainColor" style={{ fontFamily: Fonts.Shrikhand }}>
                {(sess?.Name)} / {(sess?.Role)}
              </Text>{"\n"}

              <Text className="text-lg" style={{ fontFamily:Fonts.Inter }}>What are We Going to Do Today?</Text>
            </Text>

            <BentoGrid className="web:!flex-col">
              <TouchableOpacity onPress={() => {router.push("/scout")}}>
                <BentoBox size="small" className="border-yellow-400 w-48 h-40 rounded-3xl mb-5 web:!w-screen web:!h-28" style={{ backgroundColor: "rgba(253, 224, 71, 0.3)", borderWidth: 1 }}>
                  <AntDesign name="form" size={30} color="white" className=""/>
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Scout</Text>
                </BentoBox>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {router.push("/picklist")}}>
                <BentoBox size="small" className="border-rose-400 w-48 h-40 rounded-3xl mb-5 web:!w-screen web:!h-28" style={{ backgroundColor: "rgba(244, 63, 94, 0.3)", borderWidth: 1 }}>
                  <MaterialIcons name="checklist-rtl" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Picklist</Text>
                </BentoBox>
              </TouchableOpacity>

                <TouchableOpacity onPress={() => {router.push("/planner")}}>
                  <BentoBox size="small" className="border-cyan-400 w-48 h-40 rounded-3xl mb-5 web:!w-screen web:!h-28" style={{ backgroundColor: "rgba(6, 182, 212, 0.3)", borderWidth: 1 }}>
                    <MaterialIcons name="draw" size={30} color="white" />
                    <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Planner</Text>
                  </BentoBox>
                </TouchableOpacity>

              <TouchableOpacity onPress={() => {router.push("/rank")}}>
                <BentoBox size="small" className="border-purple-400 w-48 h-40 rounded-3xl mb-5 web:!w-screen web:!h-28" style={{ backgroundColor: "rgba(168, 85, 247, 0.3)", borderWidth: 1 }}>
                  <FontAwesome6 name="ranking-star" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Ranks</Text>
                </BentoBox>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {router.push("/lookup")}}>
                <BentoBox size="small" className="border-orange-400 w-48 h-40 rounded-3xl mb-5 web:!w-screen web:!h-28" style={{ backgroundColor: "rgba(249, 115, 22, 0.3)", borderWidth: 1 }}>
                  <FontAwesome6 name="magnifying-glass" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Lookup</Text>
                </BentoBox>
              </TouchableOpacity>

                <TouchableOpacity onPress={() => {qrcodefunc()}}>
                  <BentoBox size="small" className="border-fuchsia-400 w-48 h-40 rounded-3xl mb-5 web:!w-screen web:!h-28" style={{ backgroundColor: "rgba(217, 70, 239, 0.3)", borderWidth: 1 }}>
                    <FontAwesome6 name="qrcode" size={30} color="white" />
                    <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>QR</Text>
                  </BentoBox>
                </TouchableOpacity>
            </BentoGrid>
        </ScrollView>
    </SafeAreaView>
  );
}
