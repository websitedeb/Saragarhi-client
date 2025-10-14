import { Fonts } from "@/hooks/useFont";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
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
