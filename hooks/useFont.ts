import { Inter_400Regular } from "@expo-google-fonts/inter";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useFonts } from "expo-font";

export async function preloadIconFonts() {
  await Font.loadAsync({
    ...AntDesign.font,
    ...FontAwesome6.font,
    ...MaterialIcons.font,
  });
}

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

