import { getSession } from "@/hooks/session";
import { Fonts } from "@/hooks/useFont";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

export default function TabsLayout() {
  const [session, setSession] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    (async () => {
      const sess = await getSession();
      setSession(sess);
    })();
  }, []);

  const canViewTeam =
    session?.Role === "Captain" || session?.Role === "Organizer";

  if (session === null) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#ed1c24",
        headerTitleStyle: {
          fontFamily: Fonts.Shrikhand,
        },
        headerStyle: {
          backgroundColor: "#374151",
        },
        tabBarActiveTintColor: "#ed1c24",
        tabBarInactiveTintColor: "#ffffff",
        tabBarStyle: {
          backgroundColor: "#111827",
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.Shrikhand,
          fontSize: 12,
        },
      }}
    >
      {canViewTeam ? (
        <Tabs.Screen
          name="team"
          options={{
            title: "Team",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      ) : (
        <Tabs.Screen
          name="team"
          options={{
            headerShown: false,
            tabBarButton: () => null,
          }}
        />
      )}

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="dashboard" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
