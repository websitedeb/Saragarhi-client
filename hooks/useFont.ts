import { Inter_400Regular } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

export function useFont() {
  const [loaded, error] = useFonts({
    'Shrikhand': require('../assets/fonts/Shrikhand/Shrikhand-Regular.ttf'),
    'Inter': Inter_400Regular
  });

  return { loaded, error };
}

export const Fonts = {
    Shrikhand: 'Shrikhand', 
    Inter: "Inter"
}