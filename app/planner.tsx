import React from "react";
import { Platform } from "react-native";

let PlannerComponent: React.FC<any>;

if (Platform.OS === "web") {
  PlannerComponent = require("../components/Planner/web").default
} else {
  PlannerComponent = require("../components/Planner/mobile").default;
}

export default function PlannerWrapper() {
  return <PlannerComponent />; 
}