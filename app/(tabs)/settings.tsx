import { Button } from "@/components/Forms/button";
import { clearSession, getSession, protectRoute } from "@/hooks/session";
import { Fonts, preloadIconFonts } from "@/hooks/useFont";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

    async function deleteSession() {
        await clearSession();
        router.push("/");
    }

    return (
        <SafeAreaView className="bg-gray-900 w-screen h-screen">
            <View style={styles.headerContainer} className="mb-10">
                <MaterialIcons name="settings" size={30} color="red" />
                <Text style={styles.headerText}>Your Settings</Text>
            </View>
            <ScrollView>
                <View className="m-10 border-red-600 border-xl p-2" style={{ borderColor: "rgba(239, 68, 68, 0.45)", borderWidth: 2, borderRadius: 12 }}>
                    <View className="flex-row items-center mb-5" style={{ gap: 8 }}>
                        <MaterialIcons name="dangerous" size={24} color="red" />
                        <Text className="text-red-600 text-2xl mb-5 pt-5" style={styles.headerText}>Danger Zone</Text>
                    </View>
                    <Button onClick={deleteSession} title="Logout" style={{ backgroundColor: "rgba(239, 68, 68, 0.45)" }} className="text-xl"/>
                    <Text className="mt-1"></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#4b5563",
  },
  headerText: {
    color: "red",
    fontFamily: Fonts.Shrikhand,
    fontSize: 26,
  }
});