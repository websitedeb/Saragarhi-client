import "@expo/metro-runtime";
import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";
import { Platform } from "react-native";

async function start() {
  if (Platform.OS === "web") {
    const { LoadSkiaWeb } = await import(
      "@shopify/react-native-skia/lib/module/web"
    );

    await LoadSkiaWeb({
      locateFile: () => "/canvaskit.wasm",
    });
  }

  renderRootComponent(App);
}

start();
