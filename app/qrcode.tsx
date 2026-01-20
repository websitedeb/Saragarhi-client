import React from "react";
import { Platform } from "react-native";

let PlannerComponent: React.FC<any>;

if (Platform.OS === "web") {
  PlannerComponent = require("../components/QR/web").default
} else {
  PlannerComponent = require("../components/QR/mobile").default;
}

export default function QRCodeWrapper() {
  return <PlannerComponent />; 
}