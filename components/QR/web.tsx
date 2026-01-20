import { DB_URL } from "@/constants/constants";
import { protectRoute } from "@/hooks/session";
import { router } from "expo-router";
//@ts-ignore
import qrcodeReaderPkg from "qrcode-reader";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function QRWeb() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    protectRoute();

    const qr = new (qrcodeReaderPkg as any)();
    qr.callback = (err: any, result: any) => {
      if (err) return;
      // Only run once
      if (result && !scanned) {
        setScanned(true);
        console.log("Scanned QR Code:", result); 

        fetch(`${DB_URL}/addReport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: result }),
        })
          .then((res) => {
            if (res.ok) router.replace("/complete2");
          })
          .catch(console.error);
      }
    };

    let stream: MediaStream | null = null;
    const startCamera = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        });
        if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // wait until video metadata is loaded
        videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
            console.warn("Video play interrupted:", err);
            });
        };
        }

        // Start your scan loop here...
    } catch (e) {
        console.error(e);
        setError("Camera access denied or not available.");
    }
    };


    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [scanned]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {!scanned && <Text style={styles.overlay}>Point at a QR code</Text>}
      {scanned && <Text style={styles.overlay}>Scanning…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    position: "absolute",
    top: 20,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 6,
  },
});
