import { View } from "react-native";
//import { Overlay } from "../components/overlay";
//import { Camera, CameraView } from "expo-camera";
import { protectRoute } from "@/hooks/session";
import { useEffect } from "react";
import {
    Platform,
    StatusBar
} from "react-native";


export default function QR() {
    useEffect(() => {
        protectRoute();
    }, []);

    return (
        <View>
            {Platform.OS === "android" && <StatusBar barStyle="light-content" />}
        </View>
    );
}