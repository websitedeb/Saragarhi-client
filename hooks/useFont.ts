import { Inter_400Regular } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

const path = `../assets/fonts`

export function useFont() {
  const [loaded, error] = useFonts({
    'Shrikhand': require(`${path}/Shrikhand/Shrikhand-Regular.ttf`),
    'Fun': require(`${path}/Shadows_Into_Light/ShadowsIntoLight-Regular.ttf`),
    'Inter': Inter_400Regular
  });

  return { loaded, error };
}

export const Fonts = {
    Shrikhand: 'Shrikhand', 
    Inter: "Inter",
    Fun: "Fun"
}