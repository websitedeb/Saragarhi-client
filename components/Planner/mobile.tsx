import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Canvas,
  Path,
  Skia,
  Image as SkiaImage,
  useCanvasRef,
  useImage,
} from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("screen");

export default function Mobile() {
  const image = useImage(require("../../assets/images/MAP.jpg"));
  const canvasRef = useCanvasRef();
  const router = useRouter();

  const [paths, setPaths] = useState<{ path: any; color: string }[]>([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("red");

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          const newPath = Skia.Path.Make();
          newPath.moveTo(locationX, locationY);
          setCurrentPath(newPath);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          if (currentPath) {
            currentPath.lineTo(locationX, locationY);
            setCurrentPath(Skia.Path.MakeFromSVGString(currentPath.toSVGString())!);
          }
        },
        onPanResponderRelease: () => {
          if (currentPath) {
            setPaths([...paths, { path: currentPath, color: currentColor }]);
            setCurrentPath(null);
          }
        },
      }),
    [currentPath, paths, currentColor]
  );

  const handleUndo = () => {
      setPaths((prev) => prev.slice(0, -1));
    };

    const handleSave = async () => {
      try {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permission required",
            "Camera roll access is needed to save."
          );
          return;
        }

        const snapshot = canvasRef.current?.makeImageSnapshot();
        if (!snapshot) {
          Alert.alert("Error", "Failed to capture canvas.");
          return;
        }

        const base64 = snapshot.encodeToBase64();
        const filePath = `${FileSystem.cacheDirectory}canvas.png`;
        await FileSystem.writeAsStringAsync(filePath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(filePath);
        await MediaLibrary.createAlbumAsync("PlannerDrawings", asset, false);

        Alert.alert("Saved!", "Drawing saved to your camera roll.");
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to save the drawing.");
      }
    };

  return (
    <View style={styles.container}>
      {image && (
        <Canvas ref={canvasRef} style={styles.canvas} {...panResponder.panHandlers}>
          <SkiaImage image={image} width={width} height={height} fit={"cover"} />
          {paths.map((p, i) => (
            <Path key={i} path={p.path} color={p.color} style="stroke" strokeWidth={3} />
          ))}
          {currentPath && (
            <Path path={currentPath} color={currentColor} style="stroke" strokeWidth={3} />
          )}
        </Canvas>
      )}

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => router.push("/dashboard")} style={styles.button}>
          <Ionicons name="arrow-back" color={"white"} size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentColor("red")} style={[styles.color, { backgroundColor: "red" }]} />
        <TouchableOpacity onPress={() => setCurrentColor("blue")} style={[styles.color, { backgroundColor: "blue" }]} />
        <TouchableOpacity onPress={() => setCurrentColor("green")} style={[styles.color, { backgroundColor: "green" }]} />
        <TouchableOpacity onPress={() => setCurrentColor("yellow")} style={[styles.color, { backgroundColor: "yellow" }]} />

        <TouchableOpacity onPress={() => setCurrentColor("#ffffff")} style={[styles.color, { backgroundColor: "white" }]} />

        <TouchableOpacity onPress={handleUndo} style={styles.button}>
          <Entypo name="back-in-time" color={"white"} size={22} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <MaterialIcons name="save-alt" color="white" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  canvas: {
    flex: 1,
  },
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
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
});