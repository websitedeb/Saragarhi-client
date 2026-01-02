import { ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  name: "Saragarhi",
  slug: "saragarhi",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "saragarhi",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.reactive-nodes.saragarhi",
    infoPlist: {
      NSCameraUsageDescription: "Allow $(PRODUCT_NAME) to access your camera",
      NSMicrophoneUsageDescription: "Allow $(PRODUCT_NAME) to access your microphone",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#ed1c24",
    },
    edgeToEdgeEnabled: true,
    notification: {
      icon: "./assets/images/icon.png",
      color: "#dc2626",
    },
    permissions: ["android.permission.CAMERA", "android.permission.RECORD_AUDIO"],
    package: "com.reactive_nodes.saragarhi",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/icon.png",
    output: "static"
  },
  splash: {
    image: "./assets/images/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ed1c24",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ed1c24",
      },
    ],
    "expo-font",
    "expo-secure-store",
    "expo-notifications",
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
        recordAudioAndroid: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    TBA: process.env.TBA,
    TEST: process.env.TEST,
    PROD: process.env.PROD,

    router: {},
    eas: {
      projectId: "e2feb6bc-da55-4e16-8be0-dfb207be222a",
    },
  },
  owner: "reactive_nodes",
});
