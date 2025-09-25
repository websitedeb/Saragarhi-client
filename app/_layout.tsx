import { Fonts, useFont } from "@/hooks/useFont";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const {loaded, error} = useFont();
    const [queryClient] = useState(() => new QueryClient());
    
    useEffect(() => {
        if (loaded || error) {
          SplashScreen.hideAsync();
        }
      }, [loaded, error]);
    
      if (!loaded && !error) {
        return null;
      }

    return (
        <QueryClientProvider client={queryClient}>
            <Stack>
                  <Stack.Screen name="index" options={{
                      headerShown: false
                  }} />
                  <Stack.Screen name="signin" options={{
                      headerTitle: "Login",
                      headerTitleAlign: "center",
                      headerTintColor: "#ed1c24",
                      headerTitleStyle: { fontFamily: Fonts.Shrikhand},
                      headerStyle: {backgroundColor: "#374151"},
                      headerShadowVisible: true
                  }} />
                  <Stack.Screen name="signup" options={{
                      headerTitle: "Sign-up",
                      headerTitleAlign: "center",
                      headerTintColor: "#ed1c24",
                      headerTitleStyle: { fontFamily: Fonts.Shrikhand},
                      headerStyle: {backgroundColor: "#374151"},
                      headerShadowVisible: true,
                  }} />
                  <Stack.Screen name="+not-found" options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name="dashboard" options={{
                      headerShown: false
                  }} />
                  <Stack.Screen name="planner" options={{
                      headerShown:false
                  }} />
                  <Stack.Screen name="complete" options={{
                      headerShown:false
                  }} />
                  <Stack.Screen name="picklist" options={{
                    headerTitle: "Picklist",
                    headerTitleAlign: "center",
                    headerTintColor: "#ed1c24",
                    headerTitleStyle: { fontFamily: Fonts.Shrikhand},
                    headerStyle: {backgroundColor: "#111827"},
                    headerShadowVisible: true,
                  }} />
                  <Stack.Screen name="scout" options={{
                    headerTitle: "Scout",
                    headerTitleAlign: "center",
                    headerTintColor: "#ed1c24",
                    headerTitleStyle: { fontFamily: Fonts.Shrikhand},
                    headerStyle: {backgroundColor: "#111827"},
                    headerShadowVisible: true,
                  }} />
                  <Stack.Screen name="rank" options={{
                    headerTitle: "Rank",
                    headerTitleAlign: "center",
                    headerTintColor: "#ed1c24",
                    headerTitleStyle: { fontFamily: Fonts.Shrikhand},
                    headerStyle: {backgroundColor: "#111827"},
                    headerShadowVisible: true,
                  }} />
                  <Stack.Screen name="lookup" options={{
                    headerTitle: "Lookup",
                    headerTitleAlign: "center",
                    headerTintColor: "#ed1c24",
                    headerTitleStyle: { fontFamily: Fonts.Shrikhand},
                    headerStyle: {backgroundColor: "#111827"},
                    headerShadowVisible: true,
                  }} />
                  <Stack.Screen name="teams" options={{
                    headerShown: false
                  }} />
            </Stack>
        </QueryClientProvider>
    );
}
