import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Canvas,
  Group,
  Path,
  Skia,
  Image as SkiaImage,
  useCanvasRef,
  useImage
} from "@shopify/react-native-skia";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

export default function Web() {
  const image = useImage(
    "/MAP.jpg"
  );
  const canvasRef = useCanvasRef();
  const router = useRouter();

  const [paths, setPaths] = useState<{ path: any; color: string }[]>([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("red");

  const handleUndo = () => setPaths((prev) => prev.slice(0, -1));

  const handleSave = async () => {
    try {
      if (!canvasRef.current) {
        alert("Failed to capture canvas.");
        return;
      }

      const snapshot = canvasRef.current.makeImageSnapshot();
      if (!snapshot) {
        alert("Failed to capture canvas.");
        return;
      }

      const base64 = snapshot.encodeToBase64();

      const link = document.createElement("a");
      link.href = `data:image/png;base64,${base64}`;
      link.download = "planner_drawing.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Drawing downloaded!");
    } catch (err) {
      console.error(err);
      alert("Failed to save the drawing.");
    }
  };

  return (
    <View style={styles.container}>
      {image && (
        <GestureDetector
          gesture={Gesture.Pan()
            .onStart((pt) => {
              const newPath = Skia.Path.Make();
              newPath.moveTo(pt.x, pt.y);
              setCurrentPath(newPath);
            })
            .onUpdate((pt) => {
              if (!currentPath) return;
              currentPath.lineTo(pt.x, pt.y);
              setCurrentPath(Skia.Path.MakeFromSVGString(currentPath.toSVGString())!);
            })
            .onEnd(() => {
              if (!currentPath) return;
              setPaths((prev) => [...prev, { path: currentPath, color: currentColor }]);
              setCurrentPath(null);
            })}
        >
          <Canvas ref={canvasRef} style={styles.canvas}>
            <Group
              transform={[
                { translateX: width },
                { rotate: Math.PI / 2 },
                { scaleX: height / image.width() },
                { scaleY: width / image.height() },
              ]}
            >
              <SkiaImage image={image} x={0} y={0} width={image.width()} height={image.height()} />
            </Group>

            {paths.map((p, i) => (
              <Path key={i} path={p.path} color={p.color} style="stroke" strokeWidth={3} />
            ))}

            {currentPath && (
              <Path path={currentPath} color={currentColor} style="stroke" strokeWidth={3} />
            )}
          </Canvas>
        </GestureDetector>
      )}

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => router.push("/dashboard")} style={styles.button}>
          <Ionicons name="arrow-back" color="white" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentColor("red")} style={[styles.color, { backgroundColor: "red" }]} />
        <TouchableOpacity onPress={() => setCurrentColor("blue")} style={[styles.color, { backgroundColor: "blue" }]} />
        <TouchableOpacity onPress={() => setCurrentColor("green")} style={[styles.color, { backgroundColor: "green" }]} />
        <TouchableOpacity onPress={() => setCurrentColor("yellow")} style={[styles.color, { backgroundColor: "yellow" }]} />

        <TouchableOpacity onPress={() => setCurrentColor("white")} style={[styles.color, { backgroundColor: "white" }]} />

        <TouchableOpacity onPress={handleUndo} style={styles.button}>
          <Entypo name="back-in-time" color="white" size={22} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <MaterialIcons name="save-alt" color="white" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  canvas: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#000000aa",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
  },
  button: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#333", borderRadius: 8 },
  color: { width: 30, height: 30, borderRadius: 20, borderWidth: 1, borderColor: "white" },
});
