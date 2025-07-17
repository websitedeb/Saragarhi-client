import { Fonts, useFont } from "@/hooks/useFont";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const {loaded, error} = useFont();
    
    useEffect(() => {
        if (loaded || error) {
          SplashScreen.hideAsync();
        }
      }, [loaded, error]);
    
      if (!loaded && !error) {
        return null;
      }

    return (
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
        </Stack>
    );
}
