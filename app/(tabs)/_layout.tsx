import { getSession } from "@/hooks/session";
import { Fonts } from "@/hooks/useFont";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

export default function TabsLayout() {
  const [session, setSession] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    (async () => {
      const sess = await getSession();
      setSession(sess);
    }
    )();
  }, []);

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
      {/*{session && session.Role === "Captain" || session?.Role === "Organizer" && (*/}
        <Tabs.Screen
          name="team"
          options={{
            title: "Team",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" color={color} size={size} />
            ),
            headerShown: false
          }}
        />
      {/*)} : (
        <Tabs.Screen
          name="team"
          options={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        />
      )*/}

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: "Workspace",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
    </Tabs>
  );
}
