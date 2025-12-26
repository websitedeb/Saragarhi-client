import { protectRoute } from "@/hooks/session";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QR() {
  const [CameraView, setCameraView] = useState<any>(null);
  const [Overlay, setOverlay] = useState<null | (() => React.ReactElement)>(null);

  useEffect(() => {
    protectRoute();

    if (Platform.OS !== "web") {
      const { CameraView: CV } = require("expo-camera");
      setCameraView(() => CV);

      const OverlayModule = require("../components/overlay");
      setOverlay(() => OverlayModule.Overlay);
    }
  }, []);

  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera not supported on web.</Text>
      </View>
    );
  }

  if (!CameraView || !Overlay) {
    return null;
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFill} className="bg-black">
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }: { data: string }) => {
          console.log("Scanned QR Code:", data);
          fetch(
            "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/addReport",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: data,
            }
          )
            .then((res) => {
              if (res.ok) router.replace("/complete2");
            })
            .catch(console.error);
        }}
      >
        <Overlay />
      </CameraView>
    </SafeAreaView>
  );
}
