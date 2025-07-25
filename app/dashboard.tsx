import { clearSession, getSession } from "@/hooks/session";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View, } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const [user, setUser] = useState<Record<string, any> | null>(null);

    async function deleteSession() {
        await clearSession();
        router.push('/signin');
    }

    useEffect(() => {
        (async () => {
            const session = await getSession();
            if (!session) {
                router.push('/signin');
                return;
            }
           setUser(session);
        })
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Text className="text-black text-2xl">
                    Welcome to your dashboard, {user ? user.Name : "User"}!
                </Text>
                <Button onPress={deleteSession} title="Logout" />
            </View>
        </SafeAreaView>
    );
}